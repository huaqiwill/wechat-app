const { Client } = require("ssh2");
const SFTPClient = require("ssh2-sftp-client");
require("dotenv").config();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const conn = new Client();
const sftp = new SFTPClient();

const HOSTNAME = "150.158.199.226";
const PORT = "22";
const USERNAME = "root";
const PASSWORD = "Bing2003";
const LOCAL_PROJECT_PATH = path.resolve(__dirname, '..');  // 当前项目路径的父路径
const REMOTE_PROJECT_PATH = "/opt/wechat-app";  // 服务器项目路径
const SERVICE_NAME = "wechat-app-service";  // 服务名称

// 上传文件夹并排除 node_modules
async function uploadDirectory(localDir, remoteDir) {
    try {
        const files = fs.readdirSync(localDir);

        for (const file of files) {
            const localPath = path.join(localDir, file);
            const remotePath = `${remoteDir}/${file}`;

            const stats = fs.statSync(localPath);

            // 跳过 node_modules 文件夹
            if (file === "node_modules" || file === "script") {
                console.log("跳过 node_modules 文件夹");
                continue;
            }

            if (stats.isDirectory()) {
                console.log(`创建远程目录：${remotePath}`);
                await sftp.mkdir(remotePath, true);  // 递归创建目录
                await uploadDirectory(localPath, remotePath);
            } else {
                console.log(`上传文件：${localPath} -> ${remotePath}`);
                await uploadFile(localPath, remotePath);
            }
        }
    } catch (error) {
        console.error("文件夹上传失败：", error);
    }
}

// 单文件上传函数
async function uploadFile(localFilePath, remoteFilePath) {
    try {
        console.log(`上传文件：${localFilePath}`);
        await sftp.put(localFilePath, remoteFilePath);
    } catch (error) {
        console.error("文件上传失败：", error);
    }
}

// 远程创建文件夹
async function createRemoteFile(filename) {
    console.log(`远程创建文件夹 ${filename}`);
    return execCommand(`mkdir -p ${filename} || echo '服务未运行'`);
}

// 停止服务
async function stopServer() {
    console.log("停止服务...");
    return execCommand(`pm2 stop ${SERVICE_NAME} || echo '服务未运行'`);
}

// 删除服务器上的旧文件
async function cleanFile() {
    console.log("清理旧文件...");
    return execCommand(`rm -rf ${REMOTE_PROJECT_PATH}`);
}

// 安装依赖
async function installDependencies() {
    console.log("安装项目依赖...");
    return execCommand(`cd ${REMOTE_PROJECT_PATH} && npm install`);
}

// 启动服务
async function runServer() {
    console.log("启动服务...");
    return execCommand(`cd ${REMOTE_PROJECT_PATH} && pm2 start main.js --name ${SERVICE_NAME}`);
}

// 执行远程命令
function execCommand(command) {
    return new Promise((resolve, reject) => {
        conn.exec(command, (err, stream) => {
            if (err) reject(err);

            stream
                .on("close", (code, signal) => {
                    console.log(`命令执行完成: ${command}`);
                    resolve();
                })
                .on("data", (data) => {
                    process.stdout.write(data.toString());
                })
                .stderr.on("data", (data) => {
                    process.stdout.write(data.toString());
                });
        });
    });
}

// 主流程：停止服务 -> 清理旧文件 -> 上传文件 -> 安装依赖 -> 启动服务
conn
    .on("ready", async () => {
        try {
            await stopServer();
            await cleanFile();

            console.log("连接到SFTP...");
            await sftp.connect({
                host: HOSTNAME,
                port: PORT,
                username: USERNAME,
                password: PASSWORD,
            });

            await createRemoteFile(REMOTE_PROJECT_PATH);

            console.log("开始上传项目...");
            await uploadDirectory(LOCAL_PROJECT_PATH, REMOTE_PROJECT_PATH);

            console.log("项目上传完成");
            await sftp.end();

            await installDependencies();
            await runServer();
            console.log("服务已启动");
        } catch (error) {
            console.error("部署过程中出错：", error);
        } finally {
            conn.end();
        }
    })
    .connect({
        host: HOSTNAME,
        port: PORT,
        username: USERNAME,
        password: PASSWORD,
    });

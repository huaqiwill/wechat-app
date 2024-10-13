const axios = require('axios');
const fs = require('fs');

class AccessToken {

    constructor({ appId, appSecret }) {
        this.appId = appId;
        this.appSecret = appSecret;
        this.prefix = "https://api.weixin.qq.com/cgi-bin/token";
    }

    // 缓存access_token到文件
    cacheAccessToken = (token) => {
        return new Promise((resolve, reject) => {
            fs.writeFile('access_token', JSON.stringify(token), (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            })
        });
    }

    // 从缓存文件中读取access_token
    getAccessTokenFormCache = () => {
        return new Promise((resolve, reject) => {
            fs.readFile('access_token', 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(JSON.parse(data));
            })
        });
    }

    // 从微信服务器获取access_token
    async getAccessToken() {
        const result = await axios.get(`${this.prefix}?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`);
        const { access_token, expire_in } = result.data;
        let token = {
            accessToken: access_token,
            expireTime: Date.now() + (expire_in - 20) * 1000
        }
        await this.cacheAccessToken(token);
        return token;
    }

    // 确保access_token始终为最新的
    async ensureAccessToken() {
        let token = {};
        try {
            token = await this.getAccessTokenFormCache();
        } catch (error) {
            token = await this.getAccessToken();
        }

        // token没有过期
        if (this.isValidToken(token)) {
            return token;
        }

        // 重新获取access_token
        return this.getAccessToken();
    }

    // 验证token是否合法（access_token存在且access_token没有过期）
    isValidToken(accessToken, expireTime) {
        return !!accessToken && Date.now < expireTime;
    }
}

module.exports = AccessToken;

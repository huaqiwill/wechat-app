const config = require('../config');
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const { parse } = require('dotenv');
const parseString = require('xml2js').parseString;
const replyText = require('./message').replyText;

/**
 * 解析xml数据为js对象
 * @param {} xml 
 * @returns 
 */
function parseXML(xml) {
    return new Promise((resolve, reject) => {
        parseString(xml, {
            trim: true,
            explicitArray: false,
            ignoreAttrs: true
        }, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.xml);
        })
    })
}

const auth = () => {
    return async ctx => {
        // ctx.body = 'hello';

        const { signature, echostr, timestamp, nonce } = ctx.query;
        const { token } = config;
        const sha1Str = sha1([timestamp, nonce, token].join(""));

        if (ctx.method === "GET") {

            if (sha1Str === signature) {
                // 来自微信服务器
                return ctx.body = echostr;
            }
        } else if (ctx.method === "POST") {
            if (sha1Str === signature) {
                // 解析XML数据 raw-body
                const xml = await getRawBody(ctx.req, {
                    length: ctx.request.length,
                    limit: "1mb",
                    encoding: ctx.request.charset || "utf-8",
                });
                const formatResult = await parseXML(xml);
                console.log(formatResult);
                if (formatResult.Content === '1') {
                    const replyXML = replyText(formatResult, "你好");
                    console.log(replyXML);
                    return ctx.body = replyXML;
                } else if (formatResult.Content === '2') {
                    const replyXML = replyText(formatResult, "代正帮 大傻波一");
                    console.log(replyXML);
                    return ctx.body = replyXML;
                }
                console.log(formatResult);
                // 来自微信服务器
                return ctx.body = echostr;
            }
        }

        ctx.body = 'hello';
    }
}

module.exports = auth;

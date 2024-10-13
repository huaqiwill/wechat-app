const Koa = require('koa');
const app = new Koa();
// const Router = require('koa-router');
// const router = new Router();
const wechat = require('./wechat');

app.use(wechat());

app.listen(8000, () => {
    console.log("Server is running http://localhost:8000")
})

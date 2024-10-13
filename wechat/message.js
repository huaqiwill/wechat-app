const ejs = require('ejs');

const tpl = `<xml>
  <ToUserName><![CDATA[<%=ToUserName%>]]></ToUserName>
  <FromUserName><![CDATA[<%=FromUserName%>]]></FromUserName>
  <CreateTime><%=CreateTime%></CreateTime>
  <MsgType><![CDATA[<%=MsgType%>]]></MsgType>
  <Content><![CDATA[<%=Content%>]]></Content>
</xml>`;

const replyText = (wechatRequest, content) => {
    const tpl = `<xml>
  <ToUserName><![CDATA[<%=ToUserName%>]]></ToUserName>
  <FromUserName><![CDATA[<%=FromUserName%>]]></FromUserName>
  <CreateTime><%=CreateTime%></CreateTime>
  <MsgType><![CDATA[<%=MsgType%>]]></MsgType>
  <Content><![CDATA[<%=Content%>]]></Content>
</xml>`;
    const compiled = ejs.compile(tpl);
    const { FromUserName, ToUserName } = wechatRequest;
    return compiled({
        ToUserName: ToUserName,
        FromUserName: FromUserName,
        CreateTime: new Date().getTime(),
        MsgType: "text",
        Content: content
    })
}

const replyImage = (wechatRequest, mediaId) => {
    const tpl = `<xml>
  <ToUserName><![CDATA[<%=ToUserName%>]]></ToUserName>
  <FromUserName><![CDATA[<%=FromUserName%>]]></FromUserName>
  <CreateTime><%=CreateTime%></CreateTime>
  <MsgType><![CDATA[<%=MsgType%>]]></MsgType>
  <Image>
    <MediaId><![CDATA[<%=MediaId%>]]></MediaId>
  </Image>
</xml>`;
    const compiled = ejs.compile(tpl);
    const { FromUserName, ToUserName } = wechatRequest;
    return compiled({
        ToUserName: ToUserName,
        FromUserName: FromUserName,
        CreateTime: new Date().getTime(),
        MsgType: "image",
        MediaId: mediaId
    })
}

const replyVoice = (wechatRequest, mediaId) => {
    const tpl = `<xml>
  <ToUserName><![CDATA[<%=ToUserName%>]]></ToUserName>
  <FromUserName><![CDATA[<%=FromUserName%>]]></FromUserName>
  <CreateTime><%=CreateTime%></CreateTime>
  <MsgType><![CDATA[<%=MsgType%>]]></MsgType>
  <Voice>
    <MediaId><![CDATA[<%=MediaId%>]]></MediaId>
  </Voice>
</xml>`;
    const compiled = ejs.compile(tpl);
    const { FromUserName, ToUserName } = wechatRequest;
    return compiled({
        ToUserName: ToUserName,
        FromUserName: FromUserName,
        CreateTime: new Date().getTime(),
        MsgType: "voice",
        MediaId: mediaId
    })
}

const replyVideo = (wechatRequest, mediaId) => {
    const tpl = `<xml>
  <ToUserName><![CDATA[<%=ToUserName%>]]></ToUserName>
  <FromUserName><![CDATA[<%=FromUserName%>]]></FromUserName>
  <CreateTime><%=CreateTime%></CreateTime>
  <MsgType><![CDATA[<%=MsgType%>]]></MsgType>
  <Voice>
    <MediaId><![CDATA[<%=MediaId%>]]></MediaId>
  </Voice>
</xml>`;
    const compiled = ejs.compile(tpl);
    const { FromUserName, ToUserName } = wechatRequest;
    return compiled({
        ToUserName: ToUserName,
        FromUserName: FromUserName,
        CreateTime: new Date().getTime(),
        MsgType: "voice",
        MediaId: mediaId
    })
}

const replyMusic = (wechatRequest, mediaId) => {
    const tpl = `<xml>
  <ToUserName><![CDATA[<%=ToUserName%>]]></ToUserName>
  <FromUserName><![CDATA[<%=FromUserName%>]]></FromUserName>
  <CreateTime><%=CreateTime%></CreateTime>
  <MsgType><![CDATA[<%=MsgType%>]]></MsgType>
  <Voice>
    <MediaId><![CDATA[<%=MediaId%>]]></MediaId>
  </Voice>
</xml>`;
    const compiled = ejs.compile(tpl);
    const { FromUserName, ToUserName } = wechatRequest;
    return compiled({
        ToUserName: ToUserName,
        FromUserName: FromUserName,
        CreateTime: new Date().getTime(),
        MsgType: "voice",
        MediaId: mediaId
    })
}

const replyArticles = (wechatRequest, mediaId) => {
    const tpl = `<xml>
  <ToUserName><![CDATA[<%=ToUserName%>]]></ToUserName>
  <FromUserName><![CDATA[<%=FromUserName%>]]></FromUserName>
  <CreateTime><%=CreateTime%></CreateTime>
  <MsgType><![CDATA[<%=MsgType%>]]></MsgType>
  <Voice>
    <MediaId><![CDATA[<%=MediaId%>]]></MediaId>
  </Voice>
</xml>`;
    const compiled = ejs.compile(tpl);
    const { FromUserName, ToUserName } = wechatRequest;
    return compiled({
        ToUserName: ToUserName,
        FromUserName: FromUserName,
        CreateTime: new Date().getTime(),
        MsgType: "voice",
        MediaId: mediaId
    })
}

const reply = (wechatRequest, type = 'text', content = '') => {
    if (type == 'image') {
        return replyImage();
    } else if (type == 'video') {
        return replyVideo();
    } else if (type == 'voice') {
        return replyVideo();
    } else if (type == 'music') {
        return replyVideo();
    } else if (type == 'articles') {
        return replyVideo();
    } else {
        return replyText();
    }
}

module.exports = {
    reply,
    replyText,
    replyImage,
    replyVoice,
    replyVideo,
    replyMusic,
    replyArticles
}

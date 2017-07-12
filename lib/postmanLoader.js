'use strict';

function kvConverter(obj) {
  return Object.keys(obj).map(key => {
    return {
      key,
      value: obj[key],
      description: '',
    };
  });
}
function bodyConverter(postItem) {
  const { headers, body, rawBody } = postItem.requestInfo;
  const jsonReg = new RegExp(/json/);
  const urlencodedReg = new RegExp(/urlencoded/);
  const headType = headers['content-type'];
  let bodyMode = 'raw';
  if (jsonReg.test(headType)) bodyMode = 'raw';
  if (urlencodedReg.test(headType)) bodyMode = 'urlencoded';
  const requestBody = { mode: bodyMode };
  const raw = rawBody || body;
  requestBody[bodyMode] = bodyMode === 'urlencoded' ? kvConverter(body) : raw;
  return requestBody;
}
module.exports = postInfo => {
  const urls = Object.keys(postInfo);
  const postItems = urls.map(key => {
    const postItem = postInfo[key];
    const request = {
      url: `${postItem.requestInfo.headers.host}${postItem.requestInfo.originalUrl}`,
      method: postItem.requestInfo.method,
      headers: kvConverter(postItem.requestInfo.headers),
      body: bodyConverter(postItem),
      description: '',
    };
    const response = {
      originalRequest: request,
      headers: kvConverter(postItem.responseInfo.headers),
      body: postItem.responseInfo.body,
      status: postItem.responseInfo.statusMessage,
      code: postItem.responseInfo.statusCode,
      cookie: [],
      description: '',
    };
    const jsonReg = new RegExp(/json/);
    if (jsonReg.test(postItem.responseInfo.headers['content-type'])) {
      response.body = JSON.stringify(response.body);
      Object.assign(response, {
        _postman_previewlanguage: 'json',
        _postman_previewtype: 'text',
      });
    }
    return {
      name: postItem.requestInfo.key,
      request,
      response,
    };
  });
  return {
    variables: [],
    info: {
      name: 'koa-api-history',
      _postman_id: '723bf088-1314-c9eb-d2f8-55be8a676415',
      description: '',
      schema: 'https://schema.getpostman.com/json/collection/v2.0.0/collection.json',
    },
    item: postItems,
  };
};

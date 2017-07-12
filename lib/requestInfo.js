'use strict';

module.exports = ctx => {
  const headers = Object.assign({}, ctx.request.accept.headers);
  const originalUrl = ctx.request.originalUrl.toString();
  const keyIndex = originalUrl.indexOf('?') === -1 ? originalUrl.length : originalUrl.indexOf('?');
  const key = originalUrl.substring(0, keyIndex);
  const method = ctx.req.method;
  const rawBody = ctx.request.rawBody;
  const body = Object.assign({}, ctx.request.body);
  return {
    headers,
    originalUrl,
    key,
    method,
    rawBody,
    body,
  };
};


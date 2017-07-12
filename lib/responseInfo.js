'use strict';

module.exports = ctx => {
  const headers = Object.assign({}, ctx.res._headers);
  const body = Object.assign({}, ctx.response.body);
  const statusCode = ctx.res.statusCode;
  const statusMessage = ctx.res.statusMessage;
  return {
    headers,
    body,
    statusCode,
    statusMessage,
  };
};

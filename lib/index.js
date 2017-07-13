'use strict';

const log4js = require('log4js');
const unless = require('koa-unless');
const fs = require('fs');
const path = require('path');
const getRequestInfo = require('./requestInfo');
const getResponseInfo = require('./responseInfo');
const postmanLoader = require('./postmanLoader');

const log = log4js.getLogger('koa-api-recorder');


function readJSON(filePath) {
  if (fs.existsSync(filePath)) {
    const context = fs.readFileSync(filePath);
    return JSON.parse(context);
  }
  return null;
}

function writeJSON(filePath, obj) {
  const context = JSON.stringify(obj);
  fs.writeFile(filePath, context, err => {
    if (err)log.error('写入文件失败');
  });
}


function recorder({ dirPath, postMan }) {
  let postInfo = {};
  const historyDir = path.join(dirPath, 'koa-api-recorder');
  try {
    if (fs.existsSync(dirPath)) {
      if (!fs.existsSync(historyDir)) {
        fs.mkdirSync(historyDir);
      }
      postInfo = readJSON(path.join(historyDir, 'history.json'));
      postInfo = postInfo || {};
    } else {
      log.error(`找不到文件夹:${dirPath}`);
    }
  } catch (ex) {
    log.error(ex);
  }
  const midware = async (ctx, next) => {
    const requestInfo = getRequestInfo(ctx);
    await next();
    const responseInfo = getResponseInfo(ctx);
    postInfo[requestInfo.key] = { requestInfo, responseInfo };
    writeJSON(path.join(historyDir, 'history.json'), postInfo);
    if (postMan) {
      writeJSON(path.join(historyDir, 'postman.json'), postmanLoader(postInfo));
    }
  };
  midware.unless = unless;
  return midware;
}

module.exports = recorder;

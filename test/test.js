'use strict';

const koa = require('koa2');
const recorder = require('../index');
const path = require('path');
const request = require('supertest');
const assert = require('assert');
const fs = require('fs');
const bodyParser = require('koa-bodyparser');
const getHttp = require('http').Server;


const app = new koa();
const server = getHttp(app.callback());
app.use(bodyParser());
app.use(recorder({ dirPath: path.join(__dirname, '../files'), postMan: true }));
app.use(async (ctx, next) => {
  ctx.body = { test: 'test body' };
  await next();
});
server.listen();

describe('koa-api-recorder', () => {
  it('测试文件生成', done => {
    request(server)
      .post('/test')
      .set('Content-Type', 'application/json')
      .send({ foo: 'bar' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.test === 'test body');
        assert(fs.existsSync(path.join(__dirname, '../files/koa-api-recorder/history.json')) === true);
        assert(fs.existsSync(path.join(__dirname, '../files/koa-api-recorder/postman.json')) === true);
        const historyStr = fs.readFileSync(path.join(__dirname, '../files/koa-api-recorder/history.json'), 'utf-8');
        assert(historyStr.indexOf('test body') > -1);
        assert(historyStr.indexOf('json') > -1);
        assert(historyStr.indexOf('bar') > -1);
        const postmanStr = fs.readFileSync(path.join(__dirname, '../files/koa-api-recorder/history.json'), 'utf-8');
        assert(postmanStr.indexOf('test body') > -1);
        assert(postmanStr.indexOf('json') > -1);
        assert(postmanStr.indexOf('bar') > -1);
        done();
      });
  });
});

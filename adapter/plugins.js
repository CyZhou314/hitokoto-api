'use strict'
const path = require('path')
const nconf = require('nconf')

module.exports = [
  ['respond', require('@hitokoto/koa-respond')()],
  // MiddleWares
  ['requestId', require('../src/middlewares/requestId')()],
  ['countRequests', require('../src/middlewares/countRequest')()],
  ['responseHandler', require('../src/middlewares/responseHandler')()],

  // Mail Error
  ['MailError', require('../src/middlewares/MailError')()],

  // Basic Plugins
  ['koa-helmet', require('koa-helmet')()],
  ['koa-query-pretty', require('koa-query-pretty')()],
  ['koa-jsonp', require('@hitokoto/koa-jsonp')()],
  [
    'koa-bodyparser',
    require('koa-bodyparser')({
      enableTypes: ['json', 'form'],
      formLimit: '10mb',
      jsonLimit: '10mb',
    }),
  ],
  [
    'kcors',
    require('kcors')({
      origin: '*',
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
      exposeHeaders: ['X-Request-Id'],
    }),
  ],
  [
    'koa-favicon',
    require('koa-favicon')(path.join(__dirname, '../public/favicon.ico')),
  ],
  !nconf.get('server:compress_body') || [
    'koa-compress',
    require('koa-compress')({
      filter: (contentType) => {
        return /text/i.test(contentType)
      },
      threshold: 2048,
      flush: require('zlib').Z_SYNC_FLUSH,
    }),
  ],
  ['logger', require('../src/logger')()],
]

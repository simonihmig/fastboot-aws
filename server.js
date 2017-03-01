"use strict";

const S3Downloader      = require('fastboot-s3-downloader');
const S3Notifier        = require('fastboot-s3-notifier');
const RedisCache        = require('fastboot-redis-cache');
const FastBootAppServer = require('fastboot-app-server');

const S3_BUCKET    = process.env.FASTBOOT_S3_BUCKET;
const S3_KEY       = process.env.FASTBOOT_S3_KEY;
const REDIS_HOST   = process.env.FASTBOOT_REDIS_HOST;
const REDIS_PORT   = process.env.FASTBOOT_REDIS_PORT;
const REDIS_EXPIRY = process.env.FASTBOOT_REDIS_EXPIRY;
const USERNAME     = process.env.FASTBOOT_USERNAME;
const PASSWORD     = process.env.FASTBOOT_PASSWORD;
const GZIP         = process.env.FASTBOOT_GZIP;

let downloader = new S3Downloader({
  bucket: S3_BUCKET,
  key: S3_KEY
});

let notifier = new S3Notifier({
  bucket: S3_BUCKET,
  key: S3_KEY
});

let cache;
if (REDIS_HOST || REDIS_PORT) {
  cache = new RedisCache({
    host: REDIS_HOST,
    port: REDIS_PORT,
    expiration: REDIS_EXPIRY
  });
} else {
  console.log('No FASTBOOT_REDIS_HOST or FASTBOOT_REDIS_PORT provided; caching is disabled.');
}

let server = new FastBootAppServer({
  downloader: downloader,
  notifier: notifier,
  cache: cache,
  username: USERNAME,
  password: PASSWORD,
  gzip: GZIP
});

server.start();

'use strict';

const adminUser = require('./adminUser');
const userPermission = require('./userPermission');

module.exports = appInfo => {
  const config = {
    security: {
      csrf: false,
    },
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'fdsafdsf_098098494324FDASJR[],,,,434#@$$%$#@@#';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    adminUser,
    userPermission,
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/mcms',
        options: {},
      },
    },
    encrypt_key: '483FDSA;,,KKER',
    auth_cookie_name: 'mcms,dsd,ds',
    encryptApp_key: '751f621ea8f930',
    encryptApp_vi: '26247500048718',
    mongo_connection_uri: 'mongodb://127.0.0.1:27017/doracms2',
    openqn: false,
    accessKey: 'ZeS04ItPQVfTJIOgefn2wKC1_njJ62n4yB9ujo',
    secretKey: 'LKK2d1je3AuLrA5JKeRdmWKxKfdnaJqK2JMVm7',
    bucket: 'cmsupload',
    origin: 'https://cdn.html-js.cn',
    fsizeLimit: 5242880,
    openRedis: false,
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_psd: 'hello123',
    redis_db: 0,
    redis_ttl: 12,
    upload_path: '/home/doraData/uploadFiles/doracms2/upload',
  };

  return {
    ...config,
    ...userConfig,
  };
};

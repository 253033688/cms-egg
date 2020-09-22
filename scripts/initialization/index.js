'use strict';

const path = require('path');
const BASE_DIR = path.resolve(__dirname, '../../');

const configFun = require(BASE_DIR + '/config/config.default');
const config = configFun({});

const mongoose = require('mongoose');
const md5 = require('md5');
const userGroupFun = require(BASE_DIR + '/app/model/UserGroup.js');
const userFun = require(BASE_DIR + '/app/model/User.js');

const userGroupModel = userGroupFun({ app: { mongoose } });
const userModel = userFun({ app: { mongoose } });

userGroupModel.create({

});

// userModel.create({
//   name: 's-admin',
//   userName: 's-admin',
//   password: md5('s-admin-123456', config.encrypt_key),
//   email: '',
//   phoneNum: '',
//   countryCode: '', // 手机号前国家代码
//   comments: '',
//   enable: true,
//   state: '1',
//   auth: {
//     type: Boolean,
//     default: false,
//   },
//   group: {
//     type: String,
//     ref: 'AdminGroup',
//   },
// });

console.log(config);

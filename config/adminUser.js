'use strict';

const md5 = require('md5');

module.exports = {
  name: 'super--admin',
  userName: 'admin-ww',
  password: md5('ww-AB12-admin'),
  email: '',
  phoneNum: '',
  comments: '超级管理员',
  enable: true,
  state: '1',
};

'use strict';

const md5 = require('md5');

// app.js
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async willReady() {
    // 检查超级管理员是否存在，每次启动都需要重置
    this.app.model.User.remove({ name: this.app.config.adminUser.name }, err => {
      if (err) {
        throw new Error('database error');
      }

      const user = Object.assign({}, this.app.config.adminUser,
        { password: md5(this.app.config.adminUser.password, this.app.config.encrypt_key) });
      this.app.model.User.create(user, err => {
        if (err) {
          throw new Error('database error');
        }
      });
    });

    this.app.validator.addRule('ObjectId', (rule, value) => {
      if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        return '主键错误';
      }
    });

    this.app.validator.addRule('ObjectIds', (rule, value) => {
      if (value.split(',').some(item => !/^[0-9a-fA-F]{24}$/.test(item))) {
        return '主键错误';
      }
    });

    this.app.validator.addRule('nameEn', (rule, value) => {
      if (!/^[0-9a-zA-Z]+$/.test(value)) {
        return '英文名错误';
      }
    });

    this.app.validator.addRule('nameCh', (rule, value) => {
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        return '中文名错误';
      }
    });

    this.app.validator.addRule('userName', (rule, value) => {
      if (!/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/.test(value)) {
        return '用户名错误';
      }
    });

    this.app.validator.addRule('phoneNumber', (rule, value) => {
      if (parseInt(value).toString() === value) {
        value = parseInt(value);
      }

      if (!/^1\d{10}$/.test(value)) {
        return '手机号码错误';
      }
    });
  }
}

module.exports = AppBootHook;

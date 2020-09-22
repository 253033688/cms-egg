'use strict';

const Controller = require('egg').Controller;
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

class AdminController extends Controller {
  async login() {
    try {
      const rule = {
        userName: {
          type: 'string',
          required: true,
          min: 2,
          max: 30,
        },
        password: {
          type: 'string',
          required: true,
          len: 32,
        },
      };
      this.ctx.validate(rule);

      const fields = this.ctx.request.body || {};

      const systemConfigs = await this.ctx.service.adminSystemConfigService.find({});
      const { showImgCode } = systemConfigs[0] || {};
      if (showImgCode && (!fields.imageCode || fields.imageCode !== this.ctx.session.imageCode)) {
        throw new Error('imageCode is essential');
      }

      const formObj = {
        userName: fields.userName,
        password: md5(fields.password, this.config.encrypt_key),
      };
      const user = await this.ctx.service.userService.item({
        query: formObj,
        populate: [{
          path: 'UserGroup',
          select: 'power _id enable name',
        }],
        files: 'enable password _id email userName',
      });
      if (!_.isEmpty(user)) {
        if (!user.enable) {
          throw new Error('validate_user_forbiden');
        }

        const adminUserToken = jwt.sign({
          _id: user._id,
          password: user.password,
        }, this.config.encrypt_key, {
          expiresIn: '30day',
        });
        this.ctx.cookies.set('admin_' + this.config.auth_cookie_name, adminUserToken, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 30,
          signed: true,
          httpOnly: true,
        }); // cookie 有效期30天

        // 记录登录日志
        const loginLog = {
          type: 'login',
          logs: user.userName + ' login，ip:' + this.ctx.ip,
        };
        await this.ctx.service.adminLogOfSystemService.create(loginLog);

        this.ctx.body = { data: '' };
      } else {
        throw new Error('validate_login_notSuccess');
      }
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  logout() {
    this.ctx.session = null;
    this.ctx.cookies.set('admin_' + this.config.auth_cookie_name, null, {
      path: '/',
    });

    this.ctx.body = { data: '' };
  }

  async getMenu() {
    try {
      // if (this.ctx.session.adminUserInfo.name === this.config.adminUser.name) {
      // }
      const menu = this.ctx.helper.buildMenu(
        this.config.userPermission,
        this.config.userPermission.map(item => item.id)
      );

      this.ctx.body = { data: menu };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async getBasicSiteInfo() {
    try {
      const adminUserCount = await this.ctx.service.userService.count({
        state: '1',
      });
      const regUserCount = await this.ctx.service.userService.count({
        state: '1',
      });

      const regUsers = await this.ctx.service.userService.find({
        isPaging: '0',
        pageSize: 10,
      }, {
        files: {
          email: 0,
        },
      });
      const contentCount = await this.ctx.service.contentService.count({
        state: '2',
      });
      const messageCount = await this.ctx.service.adminMessageService.count();

      const reKey = new RegExp(this.ctx.session.adminUserInfo.userName, 'i');
      const loginLogs = await this.ctx.service.adminLogOfSystemService.find({
        isPaging: '0',
        pageSize: 1,
      }, {
        query: {
          type: 'login',
          logs: {
            $regex: reKey,
          },
        },
      });

      const messages = await this.ctx.service.adminMessageService.find({
        isPaging: '0',
        pageSize: 8,
      }, {
        populate: [{
          path: 'contentId',
          select: 'stitle _id',
        }, {
          path: 'author',
          select: 'userName _id enable date logo',
        }, {
          path: 'replyAuthor',
          select: 'userName _id enable date logo',
        }, {
          path: 'adminAuthor',
          select: 'userName _id enable date logo',
        }, {
          path: 'adminReplyAuthor',
          select: 'userName _id enable date logo',
        }],
      });
      // 权限标记
      const fullResources = await this.ctx.service.userPermissionService.find({
        isPaging: '0',
      });
      const newResources = [];
      for (let i = 0; i < fullResources.length; i++) {
        const resourceObj = JSON.parse(JSON.stringify(fullResources[i]));
        if (resourceObj.type === '1' && !_.isEmpty(this.ctx.session.adminUserInfo)) {
          const adminPower = this.ctx.session.adminUserInfo.group.power;
          if (adminPower && adminPower.indexOf(resourceObj._id) > -1) {
            resourceObj.hasPower = true;
          } else {
            resourceObj.hasPower = false;
          }
          newResources.push(resourceObj);
        } else {
          newResources.push(resourceObj);
        }
      }
      const renderBasicInfo = {
        adminUserCount,
        regUserCount,
        regUsers,
        contentCount,
        messageCount,
        messages,
        loginLogs,
        resources: newResources,
      };

      this.ctx.body = { data: renderBasicInfo };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async getUserSession() {
    try {
      const noticeCounts = await this.ctx.service.memberNotifyService.count({
        systemUser: this.ctx.session.adminUserInfo._id,
        isRead: false,
      });
      const renderData = {
        noticeCounts,
        loginState: this.ctx.session.adminlogined,
        userInfo: this.ctx.session.adminUserInfo,
      };

      this.ctx.body = { data: renderData };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = AdminController;

'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');
const xss = require('xss');

class AdminMessageController extends Controller {
  async index() {
    try {
      const payload = this.ctx.query;
      const messageList = await this.ctx.service.adminMessageService.find({});

      this.ctx.body = { data: messageList };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async create() {
    try {
      const rule = {
        content: {
          type: 'string',
          required: true,
          min: 5,
          max: 200,
        },
      };
      this.ctx.validate(rule);

      const fields = this.ctx.request.body || {};
      if (_.isEmpty(this.ctx.session.user) && _.isEmpty(this.ctx.session.adminUserInfo)) {
        throw new Error('validate_error_params');
      }

      const formObj = {
        contentId: fields.contentId,
        content: xss(fields.content),
        replyAuthor: fields.replyAuthor,
        adminReplyAuthor: fields.adminReplyAuthor,
        relationMsgId: fields.relationMsgId,
        utype: fields.utype || '0',
      };
      if (fields.utype === '1') { // 管理员
        formObj.adminAuthor = this.ctx.session.adminUserInfo._id;
      } else {
        formObj.author = this.ctx.session.user._id;
      }

      const targetMessage = await this.ctx.service.adminMessageService.create(formObj);

      // todo: 啥是客户端？
      // 发送消息给客户端
      // const passiveUser = fields.replyAuthor ? fields.replyAuthor : contentInfo.uAuthor;
      // siteFunc.addSiteMessage('3', req.session.user, passiveUser, targetMessage._id, {
      //   targetMediaType: '1',
      // });

      const returnMessage = await this.ctx.service.adminMessageService.item({
        query: {
          _id: targetMessage._id,
        },
      });
      this.ctx.body = { data: returnMessage };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async show() {
    try {
      const _id = this.ctx.query.id;

      const targetItem = await this.ctx.service.adminMessageService.item({
        query: {
          _id,
        },
      });
      this.ctx.body = { data: targetItem };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async destroy() {
    try {
      const targetIds = this.ctx.query.ids;
      await this.ctx.service.adminMessageService.removes(targetIds);

      this.ctx.body = { data: '删除成功' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = AdminMessageController;

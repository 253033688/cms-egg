'use strict';

const Controller = require('egg').Controller;

class AdminNotifyController extends Controller {
  async index() {
    try {
      const rule = {
        type: [ 1, 2 ], // 1代表用户消息，映射4；2代表系统消息，映射1、2
      };
      this.ctx.validate(rule);

      let type;
      const query = this.ctx.query;
      if (query.type === 1) {
        type = [ 4 ];
      } else if (query.type === 2) {
        type = [ 1, 2 ];
      }
      const notifyList = await this.ctx.service.adminNotifyService.find({
        query: {
          type,
        },
        populate: [{
          path: 'adminSender',
          select: 'userName -_id',
        }],
      });

      this.ctx.body = { data: notifyList };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async create() {
    try {
      const rule = {
        title: {
          type: 'string',
          required: true,
          min: 5,
          max: 100,
        },
        content: {
          type: 'string',
          required: true,
          min: 5,
          max: 500,
        },
      };
      this.ctx.validate(rule);

      const fields = this.ctx.request.body || {};
      const formObj = {
        title: fields.title,
        content: fields.content,
        adminSender: this.ctx.session.adminUserInfo._id,
        type: '1',
      };

      const announceObj = await this.ctx.service.adminNotifyService.create(formObj);
      // 发送公告给用户
      const regUsers = await this.ctx.service.adminUserService.find({
        isPaging: '0',
      }, {
        query: {
          state: '1',
        },
      });
      if (regUsers.length > 0) {
        for (let i = 0; i < regUsers.length; i++) {
          await this.ctx.service.memberNotifyService.create({
            user: regUsers[i]._id,
            notify: announceObj._id,
          });
        }
      }

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async show() {
    try {
      const _id = this.ctx.query.id;
      const targetUser = await this.ctx.service.adminNotifyService.item({
        query: {
          _id,
        },
      });

      this.ctx.body = { data: targetUser };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async destroy() {
    try {
      const targetIds = this.ctx.query.ids;
      await this.ctx.service.adminNotifyService.removes(targetIds);
      await this.ctx.service.memberNotifyService.removes(targetIds, 'notify');

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = AdminNotifyController;

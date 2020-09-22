'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');

class UserNotifyController extends Controller {
  async index() {
    try {
      const payload = this.ctx.query;
      const userNotifyList = await this.ctx.UserNotifyService.find({
        query: {
          systemUser: this.ctx.session.adminUserInfo._id,
        },
        populate: [{
          path: 'notify',
          select: 'title content _id',
        }],
      });

      this.ctx.body = { data: userNotifyList };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async show() {
    try {
      const _id = this.ctx.query.id;
      const targetUser = await this.ctx.UserNotifyService.item({
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
      const rule = {
        targetIds: 'ObjectIds',
      };
      this.ctx.validate(rule, { targetIds });

      const ids = targetIds.split(',');
      // 删除消息记录
      for (let i = 0; i < ids.length; i++) {
        const userNotifyId = ids[i];
        const userNotifyObj = await this.ctx.UserNotifyService.item({
          query: {
            _id: userNotifyId,
          },
        });

        if (!_.isEmpty(userNotifyObj)) {
          await this.ctx.service.adminNotifyService.removes(userNotifyObj.notify);
        }
      }

      await this.ctx.UserNotifyService.removes(targetIds);

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async setMessageHasRead() {
    try {
      let targetIds = this.ctx.query.ids;
      const rule = {
        targetIds: 'ObjectIds',
      };
      this.ctx.validate(rule, { targetIds });

      targetIds = targetIds.split(',');
      await this.ctx.UserNotifyService.updateMany(targetIds, {
        isRead: true,
      }, {
        query: {
          systemUser: this.ctx.session.adminUserInfo._id,
        },
      });

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = UserNotifyController;

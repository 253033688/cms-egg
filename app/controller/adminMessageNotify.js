'use strict';

const Controller = require('egg').Controller;

class AdminMessageNotifyController extends Controller {
  async index() {
    try {
      const payload = this.ctx.query;
      const siteMessageList = await this.ctx.service.adminMessageNotifyService.find({
        populate: [{
          path: 'activeUser',
          select: this.ctx.helper.getAuthUserFields('base'),
        }, {
          path: 'passiveUser',
          select: this.ctx.helper.getAuthUserFields(),
        }, {
          path: 'content',
          select: 'title _id',
        }, {
          path: 'message',
          select: 'content _id contentId',
          populate: {
            path: 'contentId',
            select: 'title _id date',
          },
        }],
      });

      this.ctx.body = { data: siteMessageList };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async show() {
    try {
      const _id = this.ctx.query.id;
      const targetUser = await this.ctx.service.adminMessageNotifyService.item({
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
      await this.ctx.service.adminMessageNotifyService.removes(targetIds);

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = AdminMessageNotifyController;

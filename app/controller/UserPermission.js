'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');

class UserPermissionController extends Controller {
  async index() {
    try {
      const data = await this.ctx.service.userPermissionService.find();

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async show() {
    try {
      const _id = this.ctx.query.id;
      const targetItem = await this.ctx.service.userPermissionService.item({
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
}

module.exports = UserPermissionController;

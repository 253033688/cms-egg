'use strict';

const Controller = require('egg').Controller;

class AdminLogOfSystemController extends Controller {
  async index() {
    try {
      const data = await this.ctx.service.adminLogOfSystemService.find({});

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async destroy() {
    try {
      const targetIds = this.ctx.query.ids;
      await this.ctx.service.adminLogOfSystemService.removes(targetIds);

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async removeAll() {
    try {
      await this.ctx.service.adminLogOfSystemService.removeAll();

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = AdminLogOfSystemController;

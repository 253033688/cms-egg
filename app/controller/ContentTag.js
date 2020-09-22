'use strict';

const Controller = require('egg').Controller;

class ContentTagController extends Controller {
  async index() {
    try {
      const payload = this.ctx.query;
      const contentTagList = await this.ctx.service.contentTagService.find({
        searchKeys: ['name'],
      });

      this.ctx.body = { data: contentTagList };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async create() {
    try {
      const rule = {
        name: {
          type: 'string',
          required: true,
          min: 1,
          max: 12,
        },
        comments: {
          type: 'string',
          required: true,
          min: 2,
          max: 30,
        },
      };
      this.ctx.validate(rule);

      const fields = this.ctx.request.body || {};
      const formObj = {
        name: fields.name,
        alias: fields.alias,
        comments: fields.comments,
      };

      await this.ctx.service.contentTagService.create(formObj);

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
      const targetItem = await this.ctx.service.contentTagService.item({
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

  async update() {
    try {
      const rule = {
        name: {
          type: 'string',
          required: true,
          min: 1,
          max: 12,
        },
        comments: {
          type: 'string',
          required: true,
          min: 2,
          max: 30,
        },
      };
      this.ctx.validate(rule);

      const fields = this.ctx.request.body || {};
      const formObj = {
        name: fields.name,
        alias: fields.alias,
        comments: fields.comments,
      };

      await this.ctx.service.contentTagService.update(fields._id, formObj);

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async destroy() {
    try {
      const targetIds = this.ctx.query.ids;
      await this.ctx.service.contentTagService.removes(targetIds);

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = ContentTagController;

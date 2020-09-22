'use strict';

const Controller = require('egg').Controller;

class UserGroupController extends Controller {
  async index() {
    try {
      const adminGroupList = await this.ctx.service.userGroupService.find({});

      this.ctx.body = { data: adminGroupList };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async show() {
    try {
      const _id = this.ctx.params.id;
      const targetUser = await this.ctx.service.userGroupService.item({
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

  async create() {
    try {
      const rule = {
        name: {
          type: 'string',
          required: true,
          min: 2,
          max: 50,
        },
        comments: {
          type: 'string',
          required: true,
        },
      };
      this.ctx.validate(rule);

      const data = await this.ctx.service.userGroupService.item({ query: { name: this.ctx.request.body.name } });
      if (data) {
        throw new Error('name has already exist');
      }

      const fields = this.ctx.request.body || {};
      const endPer = this.ctx.helper.getEndPer(this.config.userPermission, fields.power.split(','));
      const formObj = {
        name: fields.name,
        power: endPer.join(','),
        comments: fields.comments,
      };
      await this.ctx.service.userGroupService.create(formObj);

      this.ctx.body = { data: '' };
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
          min: 2,
          max: 50,
        },
        comments: {
          type: 'string',
          required: true,
        },
      };
      this.ctx.validate(rule);

      const fields = this.ctx.request.body || {};
      const endPer = this.ctx.helper.getEndPer(this.config.userPermission, fields.power.split(','));
      const formObj = {
        name: fields.name,
        power: endPer.join(','),
        comments: fields.comments,
      };
      const _id = this.ctx.params.id;
      const data = await this.ctx.service.userGroupService.update(_id, formObj);

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async destroy() {
    try {
      const _ids = this.ctx.params.id;
      await this.ctx.service.userGroupService.removes(_ids);

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = UserGroupController;

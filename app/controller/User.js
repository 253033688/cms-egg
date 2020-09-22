'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');

const rule = {
  userName: {
    type: 'userName',
  },
  password: {
    type: 'password',
    min: 32,
    max: 32,
    // format: /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z]{2,})(?=.*[a-z]{2,})(?=.*[!@#$%^&*?;,\(\)]).*$/,
    // compare: 'comfirmPassword',
  }, // https://juejin.im/post/5aa23ee46fb9a028b86d9cf4
  email: {
    type: 'email',
    allowEmpty: true,
  },
  phoneNum: {
    type: 'phoneNumber',
    required: true,
  },
  comments: {
    type: 'string',
    required: false,
    max: 50,
  },
  enable: {
    type: 'boolean',
  },
  group: {
    type: 'ObjectId',
    required: true,
  },
};

class UserController extends Controller {
  async index() {
    try {
      const query = this.ctx.query;
      const data = await this.ctx.service.userService.find({
        query: Object.assign({ isDelete: false }, query, { name: { $ne: 'super--admin' } }),
        files: {
          password: 0,
        },
        populate: [{
          path: 'group',
          select: '_id name',
        }],
      });

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async show() {
    try {
      const _id = this.ctx.params.id;
      this.ctx.validate({ _id: 'ObjectId' }, { _id });

      const data = await this.ctx.service.userService.item({
        query: { _id },
        files: '-password',
      });

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async create() {
    try {
      this.ctx.validate(rule);

      const fields = this.ctx.request.body || {};
      const formObj = {
        userName: fields.userName,
        password: fields.password,
        email: fields.email,
        phoneNum: fields.phoneNum,
        comments: fields.comments,
        enable: fields.enable,
        group: fields.group,
      };

      const groupData = await this.ctx.service.userGroupService.item({
        query: {
          _id: fields.group,
        },
      });
      if (fields.group && _.isEmpty(groupData)) {
        throw new Error('validate_group_notexist');
      }

      const oldItem = await this.ctx.service.userService.item({
        query: {
          userName: fields.userName,
        },
      });
      if (!_.isEmpty(oldItem)) {
        throw new Error('validate_hadUse_userName');
      }

      const data = await this.ctx.service.userService.create(formObj);

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async update() {
    try {
      this.ctx.validate(rule);

      const _id = this.ctx.params.id;
      this.ctx.validate({ _id: 'ObjectId' }, { _id });

      const fields = this.ctx.request.body || {};
      const formObj = {
        userName: fields.userName,
        password: fields.password,
        email: fields.email,
        phoneNum: fields.phoneNum,
        comments: fields.comments,
        enable: fields.enable,
        group: fields.group,
      };

      const groupData = await this.ctx.service.userGroupService.item({
        query: {
          _id: fields.group,
        },
      });
      if (fields.group && _.isEmpty(groupData)) {
        throw new Error('validate_group_notexist');
      }

      const oldItem = await this.ctx.service.userService.item({
        query: {
          userName: fields.userName,
        },
      });
      if (oldItem && !oldItem._id.equals(_id)) {
        throw new Error('validate_hadUse_userName');
      }

      const data = await this.ctx.service.userService.update(_id, formObj);

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
      this.ctx.validate({ _ids: 'ObjectIds' }, { _ids });
      const data = await this.ctx.service.userService.safeDelete(_ids);

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = UserController;

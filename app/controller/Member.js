'use strict';

const Controller = require('egg').Controller;
const xss = require('xss');

const rules = {
  userName: {
    type: 'userName',
  },
  level: {
    type: 'int',
    min: 0,
    max: 5,
  },
  comments: {
    type: 'string',
    required: false,
    max: 50,
  },
  enable: {
    type: 'boolean',
  },
};

class MemberController extends Controller {
  async index() {
    try {
      const query = this.ctx.query;
      const data = await this.ctx.service.memberService.find({
        query,
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
      const targetUser = await this.ctx.service.memberService.item({
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
      const _rules = Object.assign({}, {
        password: {
          type: 'string',
          len: 32,
          // eslint-disable-next-line no-useless-escape
          // format: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?\(\)]).{6,16}$/,
          message: 'password is not enough complex',
        },
        // https://juejin.im/post/5aa23ee46fb9a028b86d9cf4
        // https://juejin.im/post/5b583fede51d4516e91f9e2f
      }, rules);
      this.ctx.validate(_rules);

      const fields = this.ctx.request.body || {};
      const userObj = {};
      userObj.password = this.ctx.helper.encrypt(fields.password, this.config.encrypt_key);

      [ 'userName', 'password', 'level', 'enable' ].forEach(item => {
        userObj[item] = fields[item];
      });
      [ 'comments' ].forEach(item => {
        userObj[item] = xss(fields[item]);
      });

      const data = await this.ctx.service.memberService.create(userObj);

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async update() {
    try {
      this.ctx.validate(rules);

      const fields = this.ctx.request.body || {};
      const userObj = {};
      if (fields.password) {
        userObj.password = this.ctx.helper.encrypt(fields.password, this.config.encrypt_key);
      }
      [ 'userName', 'level', 'enable' ].forEach(item => {
        userObj[item] = fields[item];
      });
      [ 'comments' ].forEach(item => {
        userObj[item] = xss(fields[item]);
      });

      const _id = this.ctx.params.id;
      const data = await this.ctx.service.memberService.update(_id, userObj);

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async destroy() {
    try {
      const ids = this.ctx.params.id;
      const data = await this.ctx.service.memberService.safeDelete(ids);

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = MemberController;

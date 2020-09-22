'use strict';

const Controller = require('egg').Controller;

class AdminSystemConfigController extends Controller {
  async index() {
    try {
      const data = await this.ctx.service.adminSystemConfigService.item({});

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  // 新建/更新
  async create() {
    try {
      const rule = {
        siteName: {
          type: 'string',
          required: true,
          min: 5,
          max: 20,
        },
        siteTitle: {
          type: 'string',
          required: true,
          min: 5,
          max: 50,
        },
        siteDiscription: {
          type: 'string',
          required: true,
          min: 5,
          max: 200,
        },
        siteKeywords: {
          type: 'string',
          required: true,
          min: 5,
          max: 100,
        },
        siteEmailServer: {
          type: 'string',
          required: true,
        },
        siteEmail: {
          type: 'email',
          required: true,
        },
        siteEmailPwd: {
          type: 'string',
          required: false,
          min: 6,
        },
      };
      this.ctx.validate(rule);

      const fields = this.ctx.request.body || {};
      const formObj = {
        siteName: fields.siteName,
        siteTitle: fields.siteTitle,
        siteDiscription: fields.siteDiscription,
        siteKeywords: fields.siteKeywords,
        siteEmailServer: fields.siteEmailServer,
        siteEmail: fields.siteEmail,
        siteEmailPwd: fields.siteEmailPwd,
      };
      if (fields.siteEmailPwd) {
        formObj.siteEmailPwd = this.ctx.helper.encrypt(formObj.siteEmailPwd, this.config.encrypt_key);
      }

      if (fields._id) {
        await this.ctx.service.adminSystemConfigService.update(fields._id, formObj);
      } else {
        await this.ctx.service.adminSystemConfigService.create(formObj);
      }

      this.ctx.body = { data: formObj };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err.message);
    }
  }
}

module.exports = AdminSystemConfigController;

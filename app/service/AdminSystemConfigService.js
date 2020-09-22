'use strict';

const Service = require('egg').Service;

class AdminSystemConfigService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.AdminSystemConfig, {
      query,
      searchKeys,
      populate,
      files,
    });

    return listdata;
  }

  async item(params = {}) {
    return this.ctx.helper._item(this.ctx.model.AdminSystemConfig, params);
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.AdminSystemConfig, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.AdminSystemConfig, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.AdminSystemConfig, values, key);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.AdminSystemConfig, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.AdminSystemConfig, _id, payload);
  }
}

module.exports = AdminSystemConfigService;

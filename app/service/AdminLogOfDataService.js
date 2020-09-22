'use strict';

const Service = require('egg').Service;

class AdminLogOfDataService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.AdminLogOfData, {
      query,
      searchKeys,
      populate,
      files,
    });
    return listdata;
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.AdminLogOfData, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.AdminLogOfData, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.AdminLogOfData, values, key);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.AdminLogOfData, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.AdminLogOfData, _id, payload);
  }

  async item(params = {}) {
    return this.ctx.helper._item(this.ctx.model.AdminLogOfData, params);
  }
}

module.exports = AdminLogOfDataService;

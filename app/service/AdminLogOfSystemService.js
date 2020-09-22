'use strict';

const Service = require('egg').Service;

class AdminLogOfSystemService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.AdminLogOfSystem, {
      query,
      searchKeys,
      populate,
      files,
    });
    return listdata;
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.AdminLogOfSystem, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.AdminLogOfSystem, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.AdminLogOfSystem, values, key);
  }

  async removeAll() {
    return this.ctx.helper._removeAll(this.ctx.model.AdminLogOfSystem);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.AdminLogOfSystem, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.AdminLogOfSystem, _id, payload);
  }

  async item(params = {}) {
    return this.ctx.helper._item(this.ctx.model.AdminLogOfSystem, params);
  }
}

module.exports = AdminLogOfSystemService;

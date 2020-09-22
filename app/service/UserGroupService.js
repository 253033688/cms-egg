'use strict';

const Service = require('egg').Service;

class UserGroupService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.UserGroup, {
      query,
      searchKeys,
      populate,
      files,
    });

    return listdata;
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.UserGroup, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.UserGroup, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.UserGroup, values, key);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.UserGroup, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.UserGroup, _id, payload);
  }

  async item(params = {}) {
    return this.ctx.helper._item(this.ctx.model.UserGroup, params);
  }
}

module.exports = UserGroupService;

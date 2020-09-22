'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

class ContentTagService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.ContentTag, {
      query,
      searchKeys,
      populate,
      files,
    });
    return listdata;

  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.ContentTag, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.ContentTag, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.ContentTag, values, key);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.ContentTag, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.ContentTag, _id, payload);
  }

  async item(params = {}) {
    return this.ctx.helper._item(this.ctx.model.ContentTag, params);
  }
}

module.exports = ContentTagService;

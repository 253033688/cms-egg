'use strict';

const Service = require('egg').Service;

class MemberNotifyService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.MemberNotify, {
      query,
      searchKeys,
      populate,
      files,
    });

    return listdata;
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.MemberNotify, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.MemberNotify, payload);
  }

  async removes(res, values, key = '_id') {
    return this.ctx.helper._removes(res, this.ctx.model.MemberNotify, values, key);
  }

  async safeDelete(res, values) {
    return this.ctx.helper._safeDelete(res, this.ctx.model.MemberNotify, values);
  }

  async update(res, _id, payload) {
    return this.ctx.helper._update(res, this.ctx.model.MemberNotify, _id, payload);
  }

  async updateMany(res, ids, params) {
    return this.ctx.helper._updateMany(res, this.ctx.model.MemberNotify, ids, params);
  }

  async item(res, params = {}) {
    return this.ctx.helper._item(res, this.ctx.model.MemberNotify, params);
  }
}

module.exports = MemberNotifyService;

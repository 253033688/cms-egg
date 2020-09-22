'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

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
      populate: !_.isEmpty(populate) ? populate : [{
        path: 'activeUser',
        select: this.ctx.helper.getAuthUserFields('base'),
      }, {
        path: 'passiveUser',
        select: this.ctx.helper.getAuthUserFields(),
      }, {
        path: 'content',
        select: 'title _id',
      }, {
        path: 'message',
        select: 'content _id contentId',
        populate: {
          path: 'contentId',
          select: 'title _id date',
        },
      }],
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

  async updateMany(ids, params) {
    return this.ctx.helper._updateMany(this.ctx.model.AdminLogOfData, ids, params);
  }

  async item(params = {}) {
    return this.ctx.helper._item(this.ctx.model.AdminLogOfData, params);
  }
}

module.exports = AdminLogOfDataService;

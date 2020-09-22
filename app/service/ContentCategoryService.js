'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

class ContentCategoryService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.ContentCategory, {
      query: Object.assign({ isDelete: false }, query),
      searchKeys,
      populate: !_.isEmpty(populate) ? populate : [{
        path: 'pid',
        select: '_id catNameEn catNameCh',
      }],
      files,
      sort: {
        sortId: 1,
      },
    });
    return listdata;
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.ContentCategory, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.ContentCategory, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.ContentCategory, values, key);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.ContentCategory, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.ContentCategory, _id, payload);
  }

  async item({
    query = {},
    populate = [],
    files = null,
  } = {}) {
    return this.ctx.helper._item(this.ctx.model.ContentCategory, {
      files,
      query,
      populate: !_.isEmpty(populate) ? populate : [ 'contentTemp' ],
    });
  }
}

module.exports = ContentCategoryService;

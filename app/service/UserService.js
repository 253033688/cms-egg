'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

class UserService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    return this.ctx.helper._list(this.ctx.model.User, {
      query,
      searchKeys,
      populate,
      files,
    });
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.User, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.User, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.User, values, key);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.User, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.User, _id, payload);
  }

  async item({
    query = {},
    populate = [],
    files = null,
  } = {}) {
    return this.ctx.helper._item(this.ctx.model.User, {
      files: files ? files : {
        password: 0,
      },
      query,
      populate: !_.isEmpty(populate) ? populate : [{
        path: 'UserGroup',
        select: 'power _id enable name',
      }],
    });
  }

}

module.exports = UserService;

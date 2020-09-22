'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

class AdminMessageService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.AdminMessage, {
      query,
      searchKeys,
      populate: !_.isEmpty(populate) ? populate : [{
        path: 'contentId',
        select: 'title stitle _id',
      }, {
        path: 'author',
        select: 'userName _id enable date logo',
      }, {
        path: 'replyAuthor',
        select: 'userName _id enable date logo',
      }, {
        path: 'adminAuthor',
        select: 'userName _id enable date logo',
      }, {
        path: 'adminReplyAuthor',
        select: 'userName _id enable date logo',
      }],
      files,
    });

    return listdata;
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.adminMessage, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.adminMessage, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.adminMessage, values, key);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.adminMessage, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.adminMessage, _id, payload);
  }

  async item({
    query = {},
    populate = [],
    files = null,
  } = {}) {
    return this.ctx.helper._item(this.ctx.model.adminMessage, {
      query,
      populate: !_.isEmpty(populate) ? populate : [{
        path: 'contentId',
        select: 'title stitle _id',
      }, {
        path: 'author',
        select: 'userName _id enable date logo',
      }, {
        path: 'replyAuthor',
        select: 'userName _id enable date logo',
      }, {
        path: 'adminAuthor',
        select: 'userName _id enable date logo',
      }, {
        path: 'adminReplyAuthor',
        select: 'userName _id enable date logo',
      }],
      files,
    });
  }
}

module.exports = AdminMessageService;

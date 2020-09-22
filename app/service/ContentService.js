'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

class ContentService extends Service {
  async find({
    sort = {
      date: -1,
    },
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.Content, {
      files,
      query,
      searchKeys,
      populate: !_.isEmpty(populate) ? populate : [{
        path: 'author',
        select: 'userName _id id logo',
      },
      {
        path: 'uAuthor',
        select: 'userName name logo _id group',
      },
      {
        path: 'tags',
        select: 'name _id',
      },
      {
        path: 'categories',
        select: 'name _id contentTemp enable defaultUrl',
        populate: {
          path: 'contentTemp',
        },
      },
      ],
      sort,
    });

    return listdata;
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.Content, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.Content, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.Content, values, key);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.Content, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.Content, _id, payload);
  }

  async inc(_id, payload) {
    return this.ctx.helper._inc(this.ctx.model.Content, _id, payload);
  }

  async updateMany(ids, payload) {
    return this.ctx.helper._updateMany(this.ctx.model.Content, ids, payload);
  }

  async item({
    query = {},
    populate = [],
    files = null,
  } = {}) {
    return this.ctx.helper._item(this.ctx.model.Content, {
      files,
      query,
      populate: !_.isEmpty(populate) ? populate : [{
        path: 'author',
        select: 'userName _id id logo',
      },
      {
        path: 'uAuthor',
        select: 'userName name logo _id group',
      },
      {
        path: 'tags',
        select: 'name _id',
      },
      {
        path: 'categories',
        select: 'name _id contentTemp enable defaultUrl',
        populate: {
          path: 'contentTemp',
        },
      }],
    });
  }
}

module.exports = ContentService;

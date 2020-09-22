'use strict';

const Service = require('egg').Service;

class AdminNotifyService extends Service {
  async find(params = {}) {
    return this.ctx.helper._list(this.ctx.model.AdminNotify, params);
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.AdminNotify, params);
  }

  async item(params = {}) {
    return this.ctx.helper._item(this.ctx.model.AdminNotify, params);
  }

  async create(data) {
    return this.ctx.helper._create(this.ctx.model.AdminNotify, data);
  }

  async update(_id, data) {
    return this.ctx.helper._update(this.ctx.model.AdminNotify, _id, data);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.AdminNotify, values, key);
  }

  async safeDelete(_ids) {
    return this.ctx.helper._safeDelete(this.ctx.model.AdminNotify, _ids);
  }
}

module.exports = AdminNotifyService;

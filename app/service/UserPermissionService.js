'use strict';

const Service = require('egg').Service;

class UserPermissionService extends Service {
  async find() {
    return this.config.userPermission;
  }

  async item(res, params = {}) {
    return this.ctx.helper._item(res, this.ctx.model.UserPermission, params);
  }
}

module.exports = UserPermissionService;

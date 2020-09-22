'use strict';

const _ = require('lodash');

module.exports = {
  async _list(Model, {
    query = {},
    search = null,
    searchKeys = [],
    prePage = null,
    nextPage = null,
    files = null,
    sort = {
      createdAt: -1,
    },
    populate = [],
  } = {}) {
    const $and = [ query ];

    // 关键字搜索
    if (search) {
      const _query = {};
      // 多于1个，用$or拼接
      if (searchKeys.length > 0) {
        const search = [];
        for (let i = 0; i < searchKeys.length; i++) {
          const keyItem = searchKeys[i];
          search.push({
            [keyItem]: {
              $regex: search,
            },
          });
        }

        _query.$or = search;
      } else {
        _query[searchKeys] = {
          $regex: search,
        };
      }

      $and.push(_query);
    }

    // 分页
    if (nextPage) {
      $and.push({ _id: { $gt: nextPage } });
    } else if (prePage) {
      $and.push({ _id: { $lt: prePage } });
    }

    return await Model.find({ $and }, files).sort(sort)
      .populate(populate)
      .exec();
  },

  async _count(Model, {
    query = {},
    search = null,
    searchKeys = [],
  } = {}) {
    const $and = [ query ];

    // 关键字搜索
    if (search) {
      const _query = {};
      // 多于1个，用$or拼接
      if (searchKeys.length > 0) {
        const search = [];
        for (let i = 0; i < searchKeys.length; i++) {
          const keyItem = searchKeys[i];
          search.push({
            [keyItem]: {
              $regex: search,
            },
          });
        }

        _query.$or = search;
      } else {
        _query[searchKeys] = {
          $regex: search,
        };
      }

      $and.push(_query);
    }

    return await Model.count({ $and });
  },

  async _item(Model, {
    query = {}, // 除了_id外，也可能是name，如user表查询超级管理员等
    files = null,
    populate = [],
  } = {}) {
    return await Model.findOne(query, files).populate(populate).exec();
  },

  async _create(Model, data) {
    return await Model.create(data);
  },

  async _update(Model, _id, data) {
    if (!_id) {
      throw new Error('validate_error_params');
    }

    const _data = await this._item(Model, {
      query: { _id },
    });
    if (_.isEmpty(_data)) {
      throw new Error('validate_error_params');
    }

    return await Model.findOneAndUpdate({ _id }, {
      $set: data,
    });
  },

  async _updateMany(Model, ids = [], data) {
    if (_.isEmpty(ids)) {
      throw new Error('validate_error_params');
    }

    // 因为用$in，所以不用查询_id是否存在
    return await Model.updateMany({
      _id: {
        $in: ids,
      },
    }, {
      $set: data,
    });
  },

  async _addToSet(Model, id, data) {
    if (_.isEmpty(id)) {
      throw new Error('validate_error_params');
    }

    return await Model.updateMany({
      _id: id,
    }, {
      $addToSet: data,
    });
  },

  async _pull(Model, id, data) {
    if (_.isEmpty(id)) {
      throw new Error('validate_error_params');
    }

    return await Model.updateMany({
      _id: id,
    }, {
      $pull: data,
    });
  },

  async _inc(Model, id, data) {
    if (_.isEmpty(id)) {
      throw new Error('validate_error_params');
    }

    return await Model.updateMany({
      _id: id,
    }, {
      $inc: data,
    });
  },

  async _removes(Model, ids, key) {
    ids = ids.split(',');

    return await Model.remove({
      [key]: {
        $in: ids,
      },
    });
  },

  async _removeAll(Model) {
    return await Model.remove({});
  },

  async _safeDelete(Model, ids) {
    ids = ids.split(',');

    return await Model.updateMany({
      _id: {
        $in: ids,
      },
    }, {
      $set: {
        isDelete: true,
      },
    });
  },
};

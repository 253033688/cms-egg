'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

class MemberService extends Service {
  async find({
    query = {},
    searchKeys = [],
    populate = [],
    files = null,
  } = {}) {
    const listdata = this.ctx.helper._list(this.ctx.model.Member, {
      query: Object.assign({ isDelete: false }, query),
      searchKeys: !_.isEmpty(searchKeys) ? searchKeys : [ 'userName', 'phoneNum', 'email' ],
      populate: !_.isEmpty(populate) ? populate : [
        {
          path: 'myFavorites',
        },
        {
          path: 'followers',
        },
        {
          path: 'watchers',
        },
      ],
      files: files ? files : {
        password: 0,
      },
    });

    return listdata;
  }

  async findRecomend(payload) {
    const {
      current,
      pageSize,
      searchkey,
      area, // 查询来源
      category,
      sortby,
      follow,
    } = payload;
    let res = [];
    const queryObj = {};
    let count = 0;
    const skip = ((Number(current)) - 1) * Number(pageSize || 10);
    const sortObj = {
      date: -1,
    };

    if (sortby === '1') {
      sortObj.followers = 1;
    }

    let populateArr = [{
      path: 'category',
      select: 'name _id',
    }];

    if (searchkey) {
      const reKey = new RegExp(searchkey, 'i');
      if (area === '1') {
        queryObj.$or = [{
          userName: {
            $regex: reKey,
          },
        }, {
          phoneNum: {
            $regex: reKey,
          },
        }, {
          email: {
            $regex: reKey,
          },
        }];
      } else {
        queryObj.userName = {
          $regex: reKey,
        };
      }
    }

    if (category) {
      queryObj.category = category;
    }

    // console.log('--req.session.user---', req.session.user);
    if (follow) {
      if (follow === '1' && this.ctx.session.user) {
        queryObj._id = {
          $in: this.ctx.session.user.watchers,
        };
        populateArr = [{
          path: 'category',
          select: 'name _id',
        }];
      }
    }

    res = await this.ctx.model.Member.find(queryObj).skip(skip).limit(Number(pageSize))
      .sort(sortObj)
      .popupate(populateArr)
      .exec();
    count = await this.ctx.model.Member.count(queryObj).exec();

    return {
      docs: res,
      pageInfo: {
        totalItems: count,
        pageSize: Number(pageSize),
        current: Number(current),
        searchkey,
      },
    };
  }

  async count(params = {}) {
    return this.ctx.helper._count(this.ctx.model.Member, params);
  }

  async create(payload) {
    return this.ctx.helper._create(this.ctx.model.Member, payload);
  }

  async removes(values, key = '_id') {
    return this.ctx.helper._removes(this.ctx.model.Member, values, key);
  }

  async safeDelete(values) {
    return this.ctx.helper._safeDelete(this.ctx.model.Member, values);
  }

  async update(_id, payload) {
    return this.ctx.helper._update(this.ctx.model.Member, _id, payload);
  }

  async addToSet(_id, payload) {
    return this.ctx.helper._addToSet(this.ctx.model.Member, _id, payload);
  }

  async pull(_id, payload) {
    return this.ctx.helper._pull(this.ctx.model.Member, _id, payload);
  }

  async item({
    query = {},
    populate = [],
    files = null,
  } = {}) {
    return this.ctx.helper._item(this.ctx.model.Member, {
      query: _.assign({
        state: '1',
      }, query),
      populate: !_.isEmpty(populate) ? populate : [{
        path: 'category',
        select: 'name _id',
      }],
      files: files ? files : '-password',
    });
  }
}

module.exports = MemberService;

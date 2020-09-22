'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const MemberSchema = new Schema({
    enable: { type: Boolean, default: true }, // 用户是否有效
    isDelete: { type: Boolean, default: false },
    openid: String, // 微信openid，不展示
    userName: String,
    nickName: String, // 微信昵称，不可修改
    password: String,
    level: { type: Number, default: 1 },
    regIp: String,
    lastLoginIp: String,
    avatar: '',
    birth: Date, // 出生年月日
    gender: { type: String, enum: [ '男', '女' ], default: '男' }, // 可根据微信获取，不可修改
    province: String, // 所在省份
    city: String, // 所在城市，可根据微信获取，可修改
    email: String,
    phoneNum: String,
    qq: Number,
    industry: String, // 行业
    profession: String, // 职业
    position: String, // 职位
    experience: String, // 最高学历
    company: String, // 大学或公司
    introduction: String, // 个人简介
    comments: String, // 后台管理员评论
    myFavorites: [{ type: String, ref: 'Content' }], // 我的收藏文章
    followers: [{ type: String, ref: 'Member' }], // 关注我的
    watchers: [{ type: String, ref: 'Member' }], // 我的关注
  }, { timestamps: true });

  return mongoose.model('Member', MemberSchema, 'Member');
};

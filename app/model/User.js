'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    name: String,
    userName: String,
    password: String,
    email: String,
    phoneNum: String,
    comments: String,
    enable: { type: Boolean, default: false }, // 是否启用
    isDelete: { type: Boolean, default: false }, // 是否删除，不能彻底删除，目的是保留操作记录
    group: { type: String, ref: 'UserGroup' },
  }, { timestamps: true });

  return mongoose.model('User', UserSchema, 'User');
};

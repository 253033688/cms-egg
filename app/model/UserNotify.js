'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserNotifySchema = new Schema({
    notify: { type: String, ref: 'AdminNotify' }, // 通知id
    user: { type: String, ref: 'User' }, // 被通知的用户id
  }, { timestamps: true });

  return mongoose.model('UserNotify', UserNotifySchema, 'UserNotify');
};

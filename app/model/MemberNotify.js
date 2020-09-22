'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const MemberNotifySchema = new Schema({
    notify: { type: String, ref: 'AdminNotify' }, // 通知id
    member: { type: String, ref: 'Member' }, // 被通知的用户id
  }, { timestamps: true });

  return mongoose.model('MemberNotify', MemberNotifySchema, 'MemberNotify');
};

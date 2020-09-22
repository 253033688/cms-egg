'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminNotifySchema = new Schema({
    type: { type: Number, enum: [ 1, 2, 3, 4, 5 ] }, // 消息的类型，1系统公告，2管理员公告，3关注提醒，4用户留言提醒，5用户留言回复提醒
    title: { type: String }, // 消息的标题
    content: { type: String }, // 消息的内容
    member: { type: String, ref: 'Member' }, // 关注者的ID
    user: { type: String, ref: 'User' }, // 发送公告管理员的ID
  }, { timestamps: true });

  return mongoose.model('AdminNotify', AdminNotifySchema, 'AdminNotify');
};

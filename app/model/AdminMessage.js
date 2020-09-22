'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminMessageSchema = new Schema({
    title: String, // 留言的标题
    content: String, // 留言的内容
    isRead: { type: Boolean, default: false }, // 是否已读
    isFlag: { type: Boolean, default: false }, // 是否标记
    isDelete: { type: Boolean, default: false }, // 是否删除
    member: { type: String, ref: 'Member' }, // 留言用户
    adminUser: { type: String, ref: 'User' }, // 操作管理员
    relMsgId: String, // 关联留言id
  }, { timestamps: true });

  return mongoose.model('AdminMessage', AdminMessageSchema, 'AdminMessage');
};

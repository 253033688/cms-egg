'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminMessageNotifySchema = new Schema({
    type: { type: String, enum: [ '1', '2', '3' ] }, // 消息类别 1点赞，2点踩，3文章评论、问答、回复
    content: { type: String, ref: 'Content' }, // 关联文章ID，针对文章
    message: { type: String, ref: 'AdminMessage' }, // 关联文章评论ID，针对文章评论
    isRead: { type: Boolean, default: false }, // 是否已读
    activeUser: { type: String, ref: 'Member' }, // 主动关联人，每个类别只保存1个id，这是1个关联表，为被点赞、被踩、被关注、被评论方
    passiveUser: { type: String, ref: 'Member' }, // 被动关联人，为被评论方等
  }, { timestamps: true });

  return mongoose.model('AdminMessageNotify', AdminMessageNotifySchema, 'AdminMessageNotify');
};

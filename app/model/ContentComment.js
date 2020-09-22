'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ContentCommentSchema = new Schema({
    type: { type: String, default: 0 }, // 留言类型：0普通评论 1问答
    content: { type: String, default: '输入评论内容...' }, // 留言内容
    contentId: { type: String, ref: 'Content' }, // 留言对应的内容ID，用于后台管理，前台不需要
    contentTitle: String, // 留言对应的内容标题，用于后台管理，前台不需要
    praiseNum: { type: Number, default: 0 }, // 被赞次数
    praiseMembers: [{ type: String, ref: 'Member' }], // 点赞用户id集合，不仅是为了显示全部点赞的人，还用于判断当前用户是否点赞
    opposeNum: { type: Number, default: 0 }, // 被踩次数
    opposeMembers: [{ type: String, ref: 'Member' }], // 点踩用户id集合，不显示点踩的人，但用于判断当前用户是否点赞
    status: { type: Number, emum: [ 0, 1, 2 ], default: 0 }, // 0审核中，1审核通过，审核不通过
    dismissReason: String, // 驳回原因(针对审核不通过)
    isInform: { type: Boolean, default: false }, // 是否被举报
    isDelete: { type: Boolean, default: false }, // 是否被删除
    author: { type: String, ref: 'Member' }, // 留言者ID
    relMsgId: String, // 关联的留言Id，用于跳转，锚点id格式：con-msg-{id}
    relMsgCnt: String, // 关联的留言内容，用于跳转显示文字##，内容固定，不需要重写
    relMsgAuthor: { type: String, ref: 'Member' }, // 被回复者ID，不需要用户名，返回数据时查询拼装用户名
    utype: { type: String, default: '0' }, // 评论者类型 0普通用户，1管理员 用于后台管理，前台不显示
    adminAuthor: { type: String, ref: 'User' }, // 管理员ID，用于后台显示，前台不显示
  }, { timestamps: true });

  return mongoose.model('ContentComment', ContentCommentSchema, 'ContentComment');
};

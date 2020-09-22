'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ContentSchema = new Schema({
    categoryId: { type: String, ref: 'ContentCategory' },
    title: String,
    subTitle: String,
    summary: String, // 文章摘要
    imgForList: String, // 文章列表微缩图、动图等
    author: { type: String, ref: 'Member' }, // 文档作者(普通用户)
    uAuthor: { type: String, ref: 'User' }, // 文档作者(管理员)
    status: { type: Number, emum: [ 0, 1, 2 ], default: 0 }, // 0审核中，1审核通过，审核不通过
    dismissReason: String, // 驳回原因(针对审核不通过)
    allowcomment: { type: Boolean, default: true }, // 是否可以评论
    allowAnonymouseComment: { type: Boolean, default: false }, // 是否可以匿名评论
    isDelete: { type: Boolean, default: false }, // 是否被删除
    isRecommend: { type: Boolean, default: false }, // 是否推荐
    isTop: { type: Boolean, default: false }, // 是否置顶
    displayorder: { type: Number, default: 1 }, // 排序 正整数
    viewNum: Number, // 文章查看数
    commentNum: Number, // 文章评论数
    favTimes: Number, // 文章收藏次数
    seoTitle: String,
    seoKeywords: String,
    seoDiscription: String,
    adminComment: String, // 管理员评论，用于后台管理
  }, { timestamps: true });

  return mongoose.model('Content', ContentSchema, 'Content');
};

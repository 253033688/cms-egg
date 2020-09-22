'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ContentCategorySchema = new Schema({
    pid: { type: String, ref: 'ContentCategory' }, // 自关联
    catNameEn: String,
    catNameCh: String,
    enable: { type: Boolean, default: true }, // 是否公开 默认公开
    showInNav: { type: Boolean, default: true }, // 是否在导航栏中显示
    allowcomment: { type: Boolean, default: true }, // 是否可以评论
    allowAnonymouseComment: { type: Boolean, default: false }, // 是否可以匿名评论
    isDelete: { type: Boolean, default: false },
    displayorder: { type: Number, default: 1 }, // 排序 正整数
    perpage: { type: Number, default: 20 }, // 每页显示文章数量
    frontComponentName: String, // 前端组件名
    creator: { type: String, ref: 'User' }, // 创建者
    seoTitle: String,
    seoKeywords: String,
    seoDiscription: String,
  }, { timestamps: true });

  return mongoose.model('ContentCategory', ContentCategorySchema, 'ContentCategory');
};

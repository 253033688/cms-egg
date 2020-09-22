"use strict";

const Controller = require("egg").Controller;
const _ = require("lodash");
const xss = require("xss");

const rules = {
  categoryId: "ObjectId",
  title: {
    type: "string",
    min: 5,
    max: 20
  },
  subTitle: {
    type: "string",
    required: false,
    min: 5,
    max: 20
  },
  summary: {
    type: "string",
    required: false,
    min: 5,
    max: 200
  },
  status: {
    type: "enum",
    values: [0, 1, 2]
  },
  dismissReason: {
    type: "string",
    required: false,
    max: 50
  },
  allowcomment: "boolean",
  allowAnonymouseComment: "boolean",
  isRecommend: "boolean",
  isTop: "boolean",
  displayorder: {
    type: "number",
    required: false,
    min: 0,
    max: 99
  },
  viewNum: {
    type: "number",
    required: false,
    min: 0,
    max: 99
  },
  seoTitle: {
    type: "string",
    required: true,
    min: 10,
    max: 200
  },
  seoKeywords: {
    type: "string",
    required: true,
    min: 10,
    max: 200
  },
  seoDiscription: {
    type: "string",
    required: true,
    min: 10,
    max: 200
  },
  adminComment: {
    type: "string",
    required: false,
    min: 10,
    max: 200
  }
};

class ContentController extends Controller {
  async index() {
    try {
      const state = this.ctx.query.state;
      const userId = this.ctx.query.userId;
      const queryObj = this.ctx.query;
      if (state) {
        queryObj.state = state;
      }
      if (userId) {
        queryObj.uAuthor = userId;
      }

      const contentList = await this.ctx.service.contentService.find({
        query: queryObj,
        searchKeys: ["userName", "title", "comments", "discription"],
        populate: [
          {
            path: "author",
            select: "userName name logo _id group"
          },
          {
            path: "uAuthor",
            select: "userName name logo _id group",
            $match: {
              group: "1"
            }
          },
          {
            path: "categories",
            select: "name _id defaultUrl"
          },
          {
            path: "tags",
            select: "name _id"
          }
        ]
      });

      this.ctx.body = { data: contentList };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async create() {
    try {
      this.ctx.validate(rules);

      const fields = this.ctx.request.body || {};
      let targetKeyWords = [];
      if (fields.keywords) {
        if (fields.keywords.indexOf(",") >= 0) {
          targetKeyWords = fields.keywords.split(",");
        } else if (fields.keywords.indexOf("，") >= 0) {
          targetKeyWords = fields.keywords.split("，");
        } else {
          targetKeyWords = fields.keywords;
        }
      }

      const formObj = {
        title: fields.title,
        stitle: fields.stitle,
        type: fields.type,
        categories: fields.categories,
        sortPath: fields.sortPath,
        tags: fields.tags,
        keywords: targetKeyWords,
        sImg: fields.sImg,
        author: !_.isEmpty(this.ctx.session.adminUserInfo)
          ? this.ctx.session.adminUserInfo._id
          : "",
        state: fields.state,
        dismissReason: fields.dismissReason,
        isTop: fields.isTop,
        discription: xss(fields.discription),
        comments: fields.comments,
        simpleComments: xss(fields.simpleComments),
        likeUserIds: []
      };
      // 设置显示模式
      const checkInfo = this.ctx.helper.checkContentType(
        formObj.simpleComments
      );
      formObj.appShowType = checkInfo.type;
      formObj.imageArr = checkInfo.imgArr;
      formObj.videoArr = checkInfo.videoArr;
      if (checkInfo.type === "3") {
        formObj.videoImg = checkInfo.defaultUrl;
      }
      formObj.simpleComments = this.ctx.helper.renderSimpleContent(
        formObj.simpleComments,
        checkInfo.imgArr,
        checkInfo.videoArr
      );

      // 如果是管理员代发,则指定用户
      if (this.ctx.session.adminUserInfo && fields.targetUser) {
        formObj.uAuthor = fields.targetUser;
      }

      await this.ctx.service.contentService.create(formObj);

      this.ctx.body = { data: "" };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async show() {
    try {
      const _id = this.ctx.query.id;
      const targetContent = await this.ctx.service.contentService.item({
        query: {
          _id
        },
        populate: [
          {
            path: "author",
            select: "userName name logo _id group"
          },
          {
            path: "uAuthor",
            select: "userName name logo _id group",
            $match: {
              group: "1"
            }
          },
          {
            path: "categories",
            select: "name _id defaultUrl"
          },
          {
            path: "tags",
            select: "name _id"
          }
        ]
      });

      this.ctx.body = { data: targetContent };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  // 文章推荐
  async updateContentToTop() {
    try {
      const fields = this.ctx.request.body || {};
      if (!fields._id) {
        throw new Error("validate_error_params");
      }
      await this.ctx.service.contentService.update(fields._id, {
        isTop: fields.isTop
      });

      this.ctx.body = { data: "" };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  // 文章置顶
  async roofPlacement() {
    try {
      const fields = this.ctx.request.body || {};
      await this.ctx.service.contentService.update(fields._id, {
        roofPlacement: fields.roofPlacement
      });

      this.ctx.body = { data: "" };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  // 给文章分配用户
  async redictContentToUsers() {
    try {
      const fields = this.ctx.request.body || {};
      const targetUser = fields.targetUser;
      let targetIds = fields.ids;

      const rule = {
        targetUser: "ObjectId",
        targetIds: "ObjectIds"
      };
      this.ctx.validate(rule, { targetUser, targetIds });

      targetIds = targetIds.split(",");
      await this.ctx.service.contentService.updateMany(targetIds, {
        uAuthor: targetUser
      });

      this.ctx.body = { data: "" };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async update() {
    try {
      this.ctx.validate(rules);

      const fields = this.ctx.request.body || {};
      const formObj = {
        title: fields.title,
        stitle: fields.stitle,
        type: fields.type,
        categoryId: fields.categoryId,
        sortPath: fields.sortPath,
        tags: fields.tags,
        keywords: fields.keywords ? fields.keywords.split(",") : [],
        sImg: fields.sImg,
        author: !_.isEmpty(this.ctx.session.adminUserInfo)
          ? this.ctx.session.adminUserInfo._id
          : "",
        state: fields.state,
        dismissReason: fields.dismissReason,
        isTop: fields.isTop,
        updateDate: new Date(),
        discription: xss(fields.discription),
        comments: fields.comments,
        simpleComments: xss(fields.simpleComments)
      };

      // 设置显示模式
      const checkInfo = this.ctx.helper.checkContentType(
        formObj.simpleComments
      );
      formObj.appShowType = checkInfo.type;
      formObj.imageArr = checkInfo.imgArr;
      formObj.videoArr = checkInfo.videoArr;
      formObj.simpleComments = this.ctx.helper.renderSimpleContent(
        formObj.simpleComments,
        checkInfo.imgArr,
        checkInfo.videoArr
      );

      if (checkInfo.type === "3") {
        formObj.videoImg = checkInfo.defaultUrl;
      }

      // 如果是管理员代发,则指定用户
      if (this.ctx.session.adminUserInfo && fields.targetContent) {
        formObj.uAuthor = fields.targetContent;
      }

      await this.ctx.service.contentService.update(fields._id, formObj);

      this.ctx.body = { data: "" };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async destroy() {
    try {
      const targetIds = this.ctx.query.ids;
      const rule = {
        targetIds: "ObjectIds"
      };
      this.ctx.validate(rule, { targetIds });

      await Promise.all([
        this.ctx.service.adminMessageService.removes(targetIds, "contentId"),
        this.ctx.service.contentService.removes(targetIds)
      ]);

      this.ctx.body = { data: "" };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = ContentController;

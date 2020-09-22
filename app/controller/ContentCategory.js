"use strict";

const Controller = require("egg").Controller;

const rules = {
  catNameEn: {
    type: "nameEn",
    required: true,
    min: 2,
    max: 20
  },
  catNameCh: {
    type: "nameCh",
    required: true,
    min: 2,
    max: 20
  },
  enable: "boolean",
  showInNav: "boolean",
  allowcomment: "boolean",
  allowAnonymouseComment: "boolean",
  displayorder: {
    type: "number",
    required: false,
    min: 0,
    max: 99
  },
  perpage: {
    type: "number",
    required: false,
    min: 0,
    max: 99
  },
  frontComponentName: {
    type: "nameEn",
    required: true,
    min: 2,
    max: 20
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
  }
};

class ContentCategoryController extends Controller {
  async index() {
    try {
      const data = await this.ctx.service.contentCategoryService.find({});

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async create() {
    try {
      const fields = this.ctx.request.body || {};
      if (fields.pid) {
        rules.pid = "ObjectId";
      }
      this.ctx.validate(rules);

      // 检查pid是否存在
      if (fields.pid) {
        const pidObj = await this.ctx.service.contentCategoryService.item({
          query: {
            _id: fields.pid
          }
        });
        if (!pidObj) {
          throw new Error("pid not exist");
        }
      }

      // 检查catNameEn、catNameCh是否重复
      const nameObj = await this.ctx.service.contentCategoryService.item({
        query: {
          $or: [
            { catNameEn: fields.catNameEn },
            { catNameCh: fields.catNameCh }
          ]
        }
      });
      if (nameObj) {
        throw new Error("catNameEn/catNameCh already exist");
      }

      const formObj = {
        pid: fields.pid || null,
        catNameEn: fields.catNameEn,
        catNameCh: fields.catNameCh,
        enable: fields.enable,
        showInNav: fields.showInNav,
        allowcomment: fields.allowcomment,
        allowAnonymouseComment: fields.allowAnonymouseComment,
        displayorder: fields.displayorder,
        perpage: fields.perpage,
        frontComponentName: fields.frontComponentName,
        seoTitle: fields.seoTitle,
        seoKeywords: fields.seoKeywords,
        seoDiscription: fields.seoDiscription
      };
      const data = await this.ctx.service.contentCategoryService.create(
        formObj
      );

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async show() {
    try {
      const _id = this.ctx.query.id;
      const targetItem = await this.ctx.service.contentCategoryService.item({
        query: {
          _id
        }
      });

      this.ctx.body = { data: targetItem };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async alllist() {
    return await this.ctx.service.contentCategoryService.find({
      isPaging: "0"
    });
  }

  async update() {
    try {
      const fields = this.ctx.request.body || {};
      if (fields.pid) {
        rules.pid = "ObjectId";
      }
      rules._id = "ObjectId";
      this.ctx.validate(rules);

      // 检查pid是否存在
      if (fields.pid) {
        const pidObj = await this.ctx.service.contentCategoryService.item({
          query: {
            _id: fields.pid
          }
        });
        if (!pidObj) {
          throw new Error("pid not exist");
        }
      }

      // 检查catNameEn、catNameCh是否重复
      const nameObj = await this.ctx.service.contentCategoryService.item({
        query: {
          $or: [
            { catNameEn: fields.catNameEn },
            { catNameCh: fields.catNameCh }
          ]
        }
      });
      console.log(nameObj._id, fields._id);
      if (!nameObj._id.equals(fields._id)) {
        throw new Error("catNameEn/catNameCh already exist");
      }

      const formObj = {
        pid: fields.pid || null,
        catNameEn: fields.catNameEn,
        catNameCh: fields.catNameCh,
        enable: fields.enable,
        showInNav: fields.showInNav,
        allowcomment: fields.allowcomment,
        allowAnonymouseComment: fields.allowAnonymouseComment,
        displayorder: fields.displayorder,
        perpage: fields.perpage,
        frontComponentName: fields.frontComponentName,
        seoTitle: fields.seoTitle,
        seoKeywords: fields.seoKeywords,
        seoDiscription: fields.seoDiscription
      };

      const data = await this.ctx.service.contentCategoryService.update(
        fields._id,
        formObj
      );

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async destroy() {
    try {
      const _ids = this.ctx.params.id;
      this.ctx.validate({ _ids: "ObjectIds" }, { _ids });
      const data = await this.ctx.service.contentCategoryService.safeDelete(
        _ids
      );

      this.ctx.body = { data };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = ContentCategoryController;

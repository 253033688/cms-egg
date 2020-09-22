'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminSystemConfigSchema = new Schema({
    siteName: String,
    siteTitle: String,
    siteDiscription: String,
    siteKeywords: String,
    siteEmailServer: String,
    siteEmail: String,
    siteEmailPwd: String,
  }, { timestamps: true });

  return mongoose.model('AdminSystemConfig', AdminSystemConfigSchema, 'AdminSystemConfig');
};

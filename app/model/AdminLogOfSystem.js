'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminLogOfSystemSchema = new Schema({
    type: String, // login:登录 exception:异常
    logs: String,
  }, { timestamps: true });

  return mongoose.model('AdminLogOfSystem', AdminLogOfSystemSchema, 'AdminLogOfSystem');
};

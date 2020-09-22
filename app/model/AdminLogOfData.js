'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminLogOfDataSchema = new Schema({
    fileName: { type: String }, // 备份路径
    path: { type: String }, // 文件名
    logs: String, // 日志类型
  }, { timestamps: true });

  return mongoose.model('AdminLogOfData', AdminLogOfDataSchema, 'AdminLogOfData');
};

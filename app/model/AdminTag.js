'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminTagSchema = new Schema({
    name: String,
  }, { timestamps: false });

  return mongoose.model('AdminTag', AdminTagSchema, 'AdminTag');
};

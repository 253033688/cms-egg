'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserGroupSchema = new Schema({
    name: String,
    power: String,
    comments: String,
  }, { timestamps: true });

  return mongoose.model('UserGroup', UserGroupSchema, 'UserGroup');
};

'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ContentTagSchema = new Schema({
    contentId: { type: String, ref: 'Content' },
    tagId: { type: String, ref: 'AdminTag' },
  }, { timestamps: false });

  return mongoose.model('ContentTag', ContentTagSchema, 'ContentTag');
};

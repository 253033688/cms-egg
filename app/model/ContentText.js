'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ContentTextSchema = new Schema({
    contentId: { type: String, ref: 'Content' },
    text: String,
  }, { timestamps: false });

  return mongoose.model('ContentText', ContentTextSchema, 'ContentText');
};

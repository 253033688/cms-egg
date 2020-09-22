'use strict';

const fs = require('fs');
const crypto = require('crypto');
const helperDb = require('./helperDb');
const helperSys = require('./helperSys');

// 筛选内容中的url
const getAHref = (htmlStr, type = 'image') => {
  let reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
  if (type === 'video') {
    reg = /<video.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
  } else if (type === 'audio') {
    reg = /<audio.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
  }
  const arr = [];
  const tem = reg.exec(htmlStr);
  if (tem) {
    arr.push(tem[2]);
  }

  return arr;
};

const helper = {
  encrypt(data, key) { // 密码加密
    const cipher = crypto.createCipher('bf', key);
    let newPsd = '';
    newPsd += cipher.update(data, 'utf8', 'hex');
    newPsd += cipher.final('hex');
    return newPsd;
  },

  decrypt(data, key) { // 密码解密
    const decipher = crypto.createDecipher('bf', key);
    let oldPsd = '';
    oldPsd += decipher.update(data, 'hex', 'utf8');
    oldPsd += decipher.final('utf8');
    return oldPsd;
  },

  formatUser(user) {
    return !!user;
  },

  getAuthUserFields(type = '') {
    let fieldStr = 'id userName category group logo date enable state';
    if (type === 'login') {
      fieldStr = 'id userName category group logo date enable state phoneNum countryCode email comments position loginActive birth password';
    } else if (type === 'base') {
      fieldStr = 'id userName category group logo date enable state phoneNum countryCode email watchers followers comments favorites favoriteCommunityContent despises comments profession experience industry introduction birth creativeRight gender';
    } else if (type === 'session') {
      fieldStr = 'id userName name category group logo date enable state phoneNum countryCode email watchers followers praiseContents praiseMessages praiseCommunityContent watchSpecials watchCommunity watchTags favorites favoriteCommunityContent despises despiseMessage despiseCommunityContent comments position gender vip';
    }

    return fieldStr;
  },

  deleteFolder(path) {
    // console.log("---del path--" + path);
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      let files = [];
      if (fs.existsSync(path)) {
        // console.log("---begin to del--");
        if (fs.statSync(path).isDirectory()) {
          const walk = function(path) {
            files = fs.readdirSync(path);
            // eslint-disable-next-line no-unused-vars
            files.forEach(function(file, index) {
              const curPath = path + '/' + file;
              if (fs.statSync(curPath).isDirectory()) { // recurse
                walk(curPath);
              } else { // delete file
                fs.unlinkSync(curPath);
              }
            });

            fs.rmdirSync(path);
          };

          walk(path);
          console.log('---del folder success----');
          resolve();
        } else {
          fs.unlink(path, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log('del file success');
              resolve();
            }
          });
        }
      } else {
        resolve();
      }
    });
  },

  getVideoImgByLink(link) {
    const oldFileType = link.replace(/^.+\./, '');
    return link.replace('.' + oldFileType, '.jpg');
  },

  checkContentType(htmlStr, type = 'content') {
    const imgArr = getAHref(htmlStr, 'image');
    const videoArr = getAHref(htmlStr, 'video');
    const audioArr = getAHref(htmlStr, 'audio');

    let defaultType = '0',
      targetFileName = '';
    if (videoArr && videoArr.length > 0) {
      defaultType = '3';
      targetFileName = videoArr[0];
    } else if (audioArr && audioArr.length > 0) {
      defaultType = '4';
      targetFileName = audioArr[0];
    } else if (imgArr && imgArr.length > 0) {
      // 针对帖子有两种 大图 小图
      if (type === 'content') {
        defaultType = (Math.floor(Math.random() * 2) + 1).toString();
      } else if (type === 'class') {
        defaultType = '1';
      }
      targetFileName = imgArr[0];
    } else {
      defaultType = '1';
    }

    let renderLink = targetFileName;
    if (type === '3') {
      // 视频缩略图
      renderLink = helper.getVideoImgByLink(targetFileName);
    }

    return {
      type: defaultType,
      defaultUrl: renderLink,
      imgArr,
      videoArr,
    };
  },

  renderSimpleContent(htmlStr, imgLinkArr, videoLinkArr) {
    // console.log('----imgLinkArr-', imgLinkArr);
    const renderStr = [];
    // 去除a标签
    htmlStr = htmlStr.replace(/(<\/?a.*?>)|(<\/?span.*?>)/g, '');
    htmlStr = htmlStr.replace(/(<\/?br.*?>)/g, '\n\n');
    if (imgLinkArr.length > 0 || videoLinkArr.length > 0) {
      // console.log('----1111---')
      let delImgStr;
      let delEndStr;
      const imgReg = /<img[^>]*>/gim;
      const videoReg = /<video[^>]*>/gim;
      if (imgLinkArr.length > 0) {
        delImgStr = htmlStr.replace(imgReg, '|I|');
      } else {
        delImgStr = htmlStr;
      }
      if (videoLinkArr.length > 0) {
        delEndStr = delImgStr.replace(videoReg, '|V|');
      } else {
        delEndStr = delImgStr;
      }
      // console.log('--delEndStr--', delEndStr);
      const imgArr = delEndStr.split('|I|');
      let imgTag = 0,
        videoTag = 0;
      for (let i = 0; i < imgArr.length; i++) {
        const imgItem = imgArr[i];
        // console.log('---imgItem---', imgItem);
        if (imgItem.indexOf('|V|') < 0) {
          // console.log('----i----', imgItem);
          imgItem && renderStr.push({
            type: 'contents',
            content: imgItem,
          });
          if (imgLinkArr[imgTag]) {
            renderStr.push({
              type: 'image',
              content: imgLinkArr[imgTag],
            });
            imgTag++;
          }
        } else { // 包含视频片段
          const smVideoArr = imgItem.split('|V|');
          for (let j = 0; j < smVideoArr.length; j++) {
            const smVideoItem = smVideoArr[j];
            smVideoItem && renderStr.push({
              type: 'contents',
              content: smVideoItem,
            });
            if (videoLinkArr[videoTag]) {
              const videoImg = helper.getVideoImgByLink(videoLinkArr[videoTag]);
              renderStr.push({
                type: 'video',
                content: videoLinkArr[videoTag],
                videoImg,
              });
              videoTag++;
            }
          }
          if (imgLinkArr[imgTag]) {
            renderStr.push({
              type: 'image',
              content: imgLinkArr[imgTag],
            });
            imgTag++;
          }
        }
      }
    } else {
      renderStr.push({
        type: 'contents',
        content: htmlStr,
      });
    }

    return JSON.stringify(renderStr);
  },

};

module.exports = { ...helper, ...helperDb, ...helperSys };

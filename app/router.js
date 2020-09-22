'use strict';

module.exports = app => {
  const { router, controller } = app;

  // resource
  router.resources('asystemconfig', '/api/asystemconfig', controller.adminSystemConfig);
  router.resources('u', '/api/u', controller.user);
  router.resources('ugroup', '/api/ugroup', controller.userGroup);
  router.resources('unotify', '/api/unotify', controller.userNotify);
  router.resources('upermission', '/api/upermission', controller.userPermission);
  router.resources('member', '/api/member', controller.member);
  router.resources('alogdata', '/api/alogdata', controller.adminLogOfData);
  router.resources('alogsystem', '/api/alogsystem', controller.adminLogOfSystem);
  router.resources('amessage', '/api/amessage', controller.adminMessage);
  router.resources('amessagenotify', '/api/amessagenotify', controller.adminMessageNotify);
  router.resources('anotify', '/api/anotify', controller.adminNotify);
  router.resources('content', '/api/content', controller.content);
  router.resources('contentcatetory', '/api/contentcatetory', controller.contentCategory);
  router.resources('contenttag', '/api/contenttag', controller.contentTag);

  // special
  router.post('/api/login', controller.admin.login);
  router.post('/api/logout', controller.admin.logout);
  router.post('/api/menu', controller.admin.getMenu);
  router.post('/api/alogdata/back', controller.adminLogOfData.backUpData);
  router.post('/api/alogsystem/clear', controller.adminLogOfSystem.removeAll);
  router.post('/api/content/totop', controller.content.updateContentToTop);
  router.post('/api/content/roof', controller.content.roofPlacement);
  router.post('/api/content/touser', controller.content.redictContentToUsers);
  router.post('/api/contentcatetory/list', controller.contentCategory.alllist);
  router.post('/api/unotify/read', controller.userNotify.setMessageHasRead);
};

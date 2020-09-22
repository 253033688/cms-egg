
'use strict';

/*
  权限格式：一级目录、二级目录、页面操作权限
  优点：保证每级权限格式固定
*/

const sysMngt = {
  id: '0',
  label: '系统管理',
  children: [
    {
      id: '0-0',
      label: '首页',
      children: [],
    },
    {
      id: '0-1',
      label: '系统配置管理',
      children: [
        {
          id: '0-1-1',
          label: '查询',
          path: '/api/asystemconfig/index',
        },
        {
          id: '0-1-2',
          label: '更新',
          path: '/api/asystemconfig/update',
        },
        {
          id: '0-1-3',
          label: '删除',
          path: '/api/asystemconfig/destroy',
        },
      ],
    },
    {
      id: '0-2',
      label: '管理员组管理',
      children: [
        {
          id: '0-2-1',
          label: '查询',
          path: '/api/contenttag/index',
        },
        {
          id: '0-2-2',
          label: '更新',
          path: '/api/contenttag/update',
        },
        {
          id: '0-2-3',
          label: '删除',
          path: '/api/contenttag/destroy',
        },
      ],
    },
    {
      id: '0-3',
      label: '管理员管理',
      children: [
        {
          id: '0-3-0',
          label: '查询',
          path: '/api/u/index',
        },
        {
          id: '0-3-1',
          label: '新增',
          path: '/api/u/create',
        },
        {
          id: '0-3-2',
          label: '更新',
          path: '/api/u/update',
        },
        {
          id: '0-3-3',
          label: '删除',
          path: '/api/u/destroy',
        },
      ],
    },
    {
      id: '0-4',
      label: '注册用户管理',
      children: [
        {
          id: '0-4-1',
          label: '查询',
          path: '/api/member/index',
        },
        {
          id: '0-4-2',
          label: '新增',
          path: '/api/member/create',
        },
        {
          id: '0-4-3',
          label: '更新',
          path: '/api/member/update',
        },
        {
          id: '0-4-4',
          label: '删除',
          path: '/api/member/destroy',
        },
      ],
    },
    // {
    //   id: '0-1',
    //   label: '数据日志管理',
    //   children: [
    //     {
    //       id: '1-1',
    //       label: '查询',
    //       path: '/api/alogdata/index',
    //     },
    //     {
    //       id: '1-2',
    //       label: '备份',
    //       path: '/api/alogdata/back',
    //     },
    //     {
    //       id: '1-3',
    //       label: '删除',
    //       path: '/api/alogdata/destroy',
    //     },
    //   ],
    // },
    // {
    //   id: '0-2',
    //   label: '系统日志管理',
    //   children: [
    //     {
    //       id: '2-1',
    //       label: '查询',
    //       path: '/api/alogsystem/index',
    //     },
    //     {
    //       id: '2-2',
    //       label: '删除',
    //       path: '/api/alogsystem/destroy',
    //     },
    //     {
    //       id: '2-3',
    //       label: '清空',
    //       path: '/api/alogsystem/removeAll',
    //     },
    //   ],
    // },
    // {
    //   id: '0-3',
    //   label: '消息管理',
    //   children: [
    //     {
    //       id: '2-1',
    //       label: '查询',
    //       path: '/api/amessage/index',
    //     },
    //     {
    //       id: '2-2',
    //       label: '新增',
    //       path: '/api/amessage/create',
    //     },
    //     {
    //       id: '2-3',
    //       label: '删除',
    //       path: '/api/amessage/destroy',
    //     },
    //   ],
    // },
    // {
    //   id: '0-4',
    //   label: '通知管理',
    //   children: [
    //     {
    //       id: '4-1',
    //       label: '查询',
    //       path: '/api/anotify/index',
    //     },
    //     {
    //       id: '4-2',
    //       label: '新增',
    //       path: '/api/anotify/create',
    //     },
    //     {
    //       id: '4-3',
    //       label: '删除',
    //       path: '/api/anotify/destroy',
    //     },
    //   ],
    // },
    // {
    //   id: '0-12',
    //   label: '用户通知管理',
    //   children: [
    //     {
    //       id: '12-1',
    //       label: '查询',
    //       path: '/api/unotify/index',
    //     },
    //     {
    //       id: '12-2',
    //       label: '删除',
    //       path: '/api/unotify/destroy',
    //     },
    //     {
    //       id: '12-3',
    //       label: '设为已读',
    //       path: '/api/unotify/read',
    //     },
    //   ],
    // },
  ],
};

const cntMngt = {
  id: '1',
  label: '内容管理',
  children: [
    {
      id: '1-0',
      label: '内容目录管理',
      children: [
        {
          id: '1-0-0',
          label: '查询',
          path: '/api/contentcatetory/index',
        },
        {
          id: '1-0-1',
          label: '新增',
          path: '/api/contentcatetory/create',
        },
        {
          id: '1-0-2',
          label: '更新',
          path: '/api/contentcatetory/update',
        },
        {
          id: '1-0-3',
          label: '删除',
          path: '/api/contentcatetory/destroy',
        },
      ],
    },
    {
      id: '1-1',
      label: '内容管理',
      children: [
        {
          id: '1-1-0',
          label: '查询',
          path: '/api/content/index',
        },
        {
          id: '1-1-1',
          label: '新增',
          path: '/api/content/create',
        },
        {
          id: '1-1-2',
          label: '更新',
          path: '/api/content/update',
        },
        {
          id: '1-1-3',
          label: '删除',
          path: '/api/content/destroy',
        },
        {
          id: '1-1-4',
          label: '文章置顶',
          path: '/api/content/roof',
        },
        {
          id: '1-1-5',
          label: '文章推荐',
          path: '/api/content/totop',
        },
        {
          id: '1-1-6',
          label: '文章分配用户',
          path: '/api/content/touser',
        },
      ],
    },
    // {
    //   id: '1-2',
    //   label: '标签管理',
    //   children: [
    //     {
    //       id: '8-1',
    //       label: '查询',
    //       path: '/api/contenttag/index',
    //     },
    //     {
    //       id: '8-2',
    //       label: '新增',
    //       path: '/api/contenttag/create',
    //     },
    //     {
    //       id: '8-3',
    //       label: '更新',
    //       path: '/api/contenttag/update',
    //     },
    //     {
    //       id: '8-4',
    //       label: '删除',
    //       path: '/api/contenttag/destroy',
    //     },
    //   ],
    // },
  ],
};

module.exports = [ sysMngt, cntMngt ];

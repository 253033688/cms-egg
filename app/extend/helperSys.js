'use strict';

const _ = require('lodash');

/* 将权限转为一维数组 */
const flatPer = data => {
  const children = [];
  data.forEach(item => {
    if (Array.isArray(item.children)) {
      children.push(...flatPer(item.children));
    }
  });

  return [ ...data, ...children ];
};
/* 将权限列表转为权限对象 */
const buildPerMap = perList => {
  return perList.reduce((rst, item) => {
    const _item = JSON.parse(JSON.stringify(item));
    if (_item.children) {
      _item.children = buildPerMap(_item.children);
    }
    rst[_item.id] = _item;

    return rst;
  }, {});
};

module.exports = {
  /*
    处理权限：
    1.将不存在的权限去掉
  */
  resolvePer(sysPer, userPer) {
    const _sysPer = flatPer(sysPer).map(item => item.id);
    const _userPer = _.intersection(userPer, _sysPer);

    return _userPer;
  },

  /*
    获取第3级权限，构建思路：
    1.根据一级权限获取其对应的全部三级权限
    2.根据二级权限获取其对应的全部三级权限
    3.去重，去掉不存在的权限
  */
  getEndPer(sysPer, userPer) {
    const userPerFir = userPer.filter(item => item.split('-').length === 1);
    let sysPerFir = sysPer.filter(item => userPerFir.includes(item.id));
    sysPerFir = flatPer(sysPerFir); // 此时仍然是一级及下面所有权限
    console.log(userPerFir, sysPerFir, 1);
    const userPerSec = userPer.filter(item => item.split('-').length === 2);
    let sysPerSec = flatPer(sysPer).filter(item => userPerSec.includes(item.id)); // 此处要加flatPer，这样才能根据二级权限判断
    sysPerSec = flatPer(sysPerSec); // 此时仍然是二级及下面所有权限
    console.log(userPerSec, sysPerSec, 2);

    let res = [ ...sysPerFir, ...sysPerSec ].map(item => item.id);
    console.log(res);
    res = [ ...res, ...userPer ].filter(item => item.split('-').length === 3);
    console.log(res);
    res = _.uniq(res);
    console.log(res);
    res = this.resolvePer(sysPer, res);

    console.log(res);
    return res;
  },

  /*
    构建思路：
    1.获取一级目录权限，如1，2-1等均可截取一级权限，去重、排序
    2.获取二级目录权限，如果只是1级目录权限，则通过获取其全部二级目录权限填充；
    如果为2-1，3-1-1等二级、三级，可截取二级权限，去重、排序
    3.组装
  */
  buildMenu(sysPer, userPer) {
    const sysPerMap = buildPerMap(sysPer);

    const _userPer = this.resolvePer(sysPer, userPer);
    let userMenuFir = _userPer.map(item => item.split('-')[0]);
    userMenuFir = _.sortedUniq(userMenuFir);

    // 根据一级权限获取其对应全部二级目录
    const firOnly = _userPer.map(item => item.split('-')).filter(item => item.length === 1);
    let userMenuSec = [];
    firOnly.forEach(item => {
      userMenuSec.push(...(Object.keys(sysPerMap[item].children)));
    });
    // 根据二级、三级权限获取二级目录
    userMenuSec = userMenuSec.concat(
      _userPer.map(item => item.split('-'))
        .filter(item => item.length > 1)
        .map(item => `${item[0]}-${item[1]}`)
    );
    userMenuSec = _.sortedUniq(userMenuSec);

    const menu = userMenuFir.map(item => {
      const children = [];
      Object.values(sysPerMap[item].children)
        .forEach(_item => {
          if (userMenuSec.includes(_item.id)) {
            children.push(_.omit(_item, [ 'children' ]));
          }
        });

      return Object.assign({}, sysPerMap[item], { children });
    });

    return menu;
  },
};

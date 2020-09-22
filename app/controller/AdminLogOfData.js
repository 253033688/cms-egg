'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const child = require('child_process');
const moment = require('moment');
const _ = require('lodash');
const archiver = require('archiver');
const muri = require('muri');
const isDev = process.env.NODE_ENV === 'development';

class AdminLogOfDataController extends Controller {
  async index() {
    try {
      const payload = this.ctx.query;
      const dataOptionLogList = await this.ctx.service.adminLogOfDataService.find(payload);

      this.ctx.body = { data: dataOptionLogList };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }

  async backUpData() {
    const systemConfigs = await this.ctx.service.adminSystemConfigService.find({});
    if (_.isEmpty(systemConfigs)) {
      throw new Error('resdata_checkSysConfig_error');
    }

    const date = new Date();
    const ms = moment(date).format('YYYYMMDDHHmmss').toString();
    const databackforder = isDev ? process.cwd() + '/databak/' : systemConfigs[0].databackForderPath;
    const dataPath = databackforder + ms;

    const parsedUri = muri(this.config.mongoose.client);
    const parameters = [];
    if (parsedUri.auth) {
      parameters.push(`-u "${parsedUri.auth.user}"`, `-p "${parsedUri.auth.pass}"`);
    }
    if (parsedUri.db) {
      parameters.push(`-d "${parsedUri.db}"`);
    }
    const mongoBinPath = systemConfigs[0].mongodbInstallPath;
    const cmdstr = (isDev ? '' : mongoBinPath) + `mongodump ${parameters.join(' ')} -o "${dataPath}"`;

    if (!fs.existsSync(databackforder)) {
      fs.mkdirSync(databackforder);
    }
    if (fs.existsSync(dataPath)) {
      console.log('已经创建过备份了');
    } else {
      fs.mkdirSync(dataPath);
      // eslint-disable-next-line no-unused-vars
      child.exec(cmdstr, function(error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        } else {
          // 生成压缩文件
          const output = fs.createWriteStream(databackforder + ms + '.zip');
          const archive = archiver('zip');

          output.on('close', async () => {
            console.log(archive.pointer() + ' total bytes');
            console.log('back up data success');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            // 操作记录入库
            const optParams = {
              logs: 'Data backup',
              path: dataPath,
              fileName: ms + '.zip',
            };

            await this.ctx.service.adminLogOfDataService.create(optParams);
            this.ctx.body = { data: '' };
          });

          output.on('end', function() {
            console.log('Data has been drained');
          });

          archive.on('error', function(err) {
            throw err;
          });

          archive.pipe(output);
          archive.directory(dataPath + '/', false);
          archive.finalize();
        }
      });
    }
  }

  async destroy() {
    try {
      const targetIds = this.ctx.query.ids;

      const currentItem = await this.ctx.service.adminLogOfDataService.item({
        query: {
          _id: targetIds,
        },
      });
      if (currentItem && currentItem.path) {
        await this.ctx.helpers.deleteFolder(currentItem.path);
      } else {
        throw new Error('validate_error_params');
      }

      await this.ctx.service.adminLogOfDataService.removes(targetIds);

      this.ctx.body = { data: '' };
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = { msg: err.message };

      this.ctx.logger.error(err);
    }
  }
}

module.exports = AdminLogOfDataController;

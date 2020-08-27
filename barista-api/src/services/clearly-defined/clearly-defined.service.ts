import { ClearlyDefined } from '@app/models';
import { AppServiceBase } from '@app/services/app-service-base/app-base.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ClearlyDefinedDTO } from './../../models/DTOs/ClearlyDefinedDTO';

@Injectable()
export class ClearlyDefinedService extends AppServiceBase<ClearlyDefined> {
  constructor(@InjectRepository(ClearlyDefined) repo) {
    super(repo);
  }
  private logger = new Logger('ClearlyDefinedService');

  async convertPackage(packageType: string, packageName: string) {
    switch (packageType) {
      case 'maven':
        const replacevalcolon = /:/gi;
        return 'maven/mavencentral/' + packageName.replace(replacevalcolon, '/');
        break;
      case 'npm':
        const splitString = packageName.split('@');
        const newPackageName = splitString[0] + '/' + splitString[1];
        if (splitString.length > 2) {
          return  'npm/npmjs/' + '@' + splitString[1] + '/' + splitString[2];
        }
        return 'npm/npmjs/-/' + newPackageName;
        break;

      default:
        break;
    }
  }

  async postNotices(packageIndentifier: string) {
    try {
      const url = 'https://api.clearlydefined.io/notices';
      const data = {
        coordinates: [packageIndentifier.replace(/"/g, '')],
        renderer: 'json',
        options: {},
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };



      let clearlyDefined = await this.db.findOne({ where: { indentifier: packageIndentifier } });
      if (!clearlyDefined) {
        const res = await axios.post<ClearlyDefinedDTO>(url, data, config);
        clearlyDefined = this.db.create();
        if (res.data.content.packages.length > 0) {
          clearlyDefined = Object.assign(clearlyDefined, res.data.content.packages[0]);
          clearlyDefined.indentifier = packageIndentifier;
          clearlyDefined.licensetext = res.data.content.packages[0].text;
          if (res.data.content.packages[0].copyrights?.length > 0) {
            clearlyDefined.copyrights = res.data.content.packages[0].copyrights.toString();
          }
          this.db.save(clearlyDefined);
        }
      }

      return clearlyDefined;
    } catch (err) {
      this.logger.error(err);
    }
  }
}

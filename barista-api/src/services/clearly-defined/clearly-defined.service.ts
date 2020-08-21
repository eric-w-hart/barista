import { AppServiceBase } from '@app/services/app-service-base/app-base.service';
import { Injectable, Logger, HttpModule } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ClearlyDefinedDTO } from './../../models/DTOs/ClearlyDefinedDTO';

@Injectable()
export class ClearlyDefinedService {
  constructor(private http: HttpModule) {}
  private logger = new Logger('LicenseScanResultService');

  async postDefinitions(indentifier: string) {
    // const noticeArray = [];
    // noticeArray.push(pacakageCoordinates);
    // this.logger.log('corr = ' + pacakageCoordinates);
    // await axios({
    //   url: '/definitions',
    //   baseURL: 'https://api.clearlydefined.io/api-docs',
    //   method: 'GET',
    //   // data: {
    //   //   coordinates: '[' + pacakageCoordinates + ']',
    //   //   options: '',
    //   // },
    // }).then(response => {
    //   this.logger.log('clearly defined = ' + response.data);
    // });
    try {
      const url = 'https://api.clearlydefined.io/definitions';
      const data = '[' + indentifier + ']';
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.post(url, data, config);
      this.logger.log(res.data);
      return res.data;
    } catch (err) {
      this.logger.error(err);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { SystemConfigurationService } from '@app/shared/+state/systemConfiguration/system-configuration.service';
import IMenuItem from '@app/shared/interfaces/IMenuItem';
import { isArray } from 'lodash';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent implements OnInit {
  profileMenuItems: IMenuItem[] = [];

  constructor(private systemConfigService: SystemConfigurationService) {}

  ngOnInit() {
    this.systemConfigService.apiService.systemConfigurationIdGet('default').subscribe(data => {
      this.profileMenuItems = isArray(data.profileMenu) ? data.profileMenu : [];
    });
  }
}

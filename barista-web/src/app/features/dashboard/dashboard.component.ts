import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute) {}
  lodash = _;
  projectDataTableType = 'my';

  async ngOnInit() {
    console.log('route = ' + this.route.snapshot.paramMap.get('projectDataTableType'));
    if (this.route.snapshot.paramMap.get('projectDataTableType')) {
      this.projectDataTableType = this.route.snapshot.paramMap.get('projectDataTableType');
    }
  }

  ngOnDestroy(): void {}
}

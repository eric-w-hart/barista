import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private router: Router) {}
  lodash = _;
  projectDataTableType = 'user';

  ngOnDestroy(): void {}

  async ngOnInit() {
    if (this.route.snapshot.paramMap.get('projectDataTableType')) {
      this.projectDataTableType = this.route.snapshot.paramMap.get('projectDataTableType');
    }
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }
}

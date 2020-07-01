import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthServiceStatus } from '@app/features/auth/auth.service';
import { untilDestroyed } from 'ngx-take-until-destroy';import { UserInfo } from '@app/shared/api/model/user-info';
import { NavService } from '@app/shared/nav/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy{
  constructor(private router: Router, public navService: NavService, private authService: AuthService) {
    authService.statusChange.pipe(untilDestroyed(this)).subscribe((value: AuthServiceStatus) => {
      this.message = value.statusMessage;
    });
  }

  isLoggedIn: boolean;
  role: string;
  @Output() public sidenavToggle = new EventEmitter();
  userName: string;
  password = '';
  username = '';
  message = '';

  async logout() {
    await this.authService.logout();
    window.location.reload();
  }
  ngOnDestroy(): void {}

  ngOnInit() {
    this.isLoggedIn = AuthService.isLoggedIn;
    const { displayName, role } = this.authService.userInfo;
    this.userName = displayName;
    this.role = UserInfo.RoleEnum[role];
  }
  async signin() {
    await this.authService.login(this.username, this.password);
  }
  async myProjectLink(){
    await this.router.navigate(['/project']);
  }
  async dashboardLink(){
    await this.router.navigate(['/dashboard']);
  }
}

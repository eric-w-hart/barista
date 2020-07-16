import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, AuthServiceStatus } from '@app/features/auth/auth.service';
import { untilDestroyed } from 'ngx-take-until-destroy';import { UserInfo } from '@app/shared/api/model/user-info';
import { NavService } from '@app/shared/nav/nav.service';
import { NavItem } from '@app/shared/nav/nav-item';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy{
  constructor(public router: Router, public navService: NavService, private authService: AuthService, public appComponent: AppComponent) {
    authService.statusChange.pipe(untilDestroyed(this)).subscribe((value: AuthServiceStatus) => {
      this.message = value.statusMessage;
    });
  }

  private navItems: NavItem [];
  isLoggedIn: boolean;
  isAdmin: boolean;
  role: string;
  @Output() public sidenavToggle = new EventEmitter();
  userName: string;
  password = '';
  username = '';
  message = '';
  isVisible = false;

  async logout() {
    localStorage.removeItem('accessToken');
    await this.router.navigate(['/home']);
    window.location.reload();
  }
  ngOnDestroy(): void {}

  ngOnInit() {
    this.isLoggedIn = AuthService.isLoggedIn;
    const { displayName, role } = this.authService.userInfo;
    this.userName = displayName;
    this.role = UserInfo.RoleEnum[role];
    this.isAdmin = this.authService.isAdmin;
    this.navItems = this.appComponent.adminChildItems;
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
  async homeLink(){
    await this.router.navigate(['/home']);
  }
  profileBtn(){
    this.isVisible = true;
  }
}

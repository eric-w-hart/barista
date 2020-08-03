import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService, AuthServiceStatus } from '@app/features/auth/auth.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UserInfo } from '@app/shared/api/model/user-info';
import { NavService } from '@app/shared/nav/nav.service';
import { NavItem } from '@app/shared/nav/nav-item';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    public navService: NavService,
    private authService: AuthService,
    public appComponent: AppComponent,
  ) {
    authService.statusChange.pipe(untilDestroyed(this)).subscribe((value: AuthServiceStatus) => {
      this.message = value.statusMessage;
    });

    this.router.events.subscribe((routeData) => {
      if (routeData instanceof NavigationEnd) {
        var route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        const adminRoute = route.snapshot.data['isAdminRoute'];
        const path = routeData.urlAfterRedirects;
        if (adminRoute) {
          this.onHome = false;
          this.onProj = false;
          this.onAdmin = true;
        } else if (path.startsWith('/home')) {
          this.onHome = true;
          this.onProj = false;
          this.onAdmin = false;
        } else if (path.startsWith('/project')) {
          this.onHome = false;
          this.onProj = true;
          this.onAdmin = false;
        } else {
          this.onHome = false;
          this.onProj = false;
          this.onAdmin = false;
        }
      }
    });
  }

  private navItems: NavItem[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  onHome: boolean = false;
  onProj: boolean = false;
  onAdmin: boolean = false;
  menuClicked: boolean = false;
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
  async myProjectLink() {
    await this.router.navigate(['/dashboard/my']);
  }
  async organzationLink() {
    await this.router.navigate(['/dashboard/organization']);
  }
  async communityLink() {
    await this.router.navigate(['/dashboard/community']);
  }
  async homeLink() {
    await this.router.navigate(['/home']);
  }
  profileBtn() {
    this.isVisible = true;
  }

  isSignIn() {
    return this.router.url.endsWith('/signin');
  }

  menuOpened() {
    this.menuClicked = true;
  }

  menuClosed() {
    this.menuClicked = false;
  }

  receiveHelpEvent($event){
    $event ? this.menuOpened() : this.menuClosed();
  }
}

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlSegmentGroup,
  PRIMARY_OUTLET,
} from '@angular/router';
import { AuthService } from '@app/features/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    const isAdminRoute = route.data.isAdminRoute;
    return this.checkLogin(url, isAdminRoute);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string, isAdminRoute: boolean): boolean {
    if (AuthService.isLoggedIn) {
      if (isAdminRoute && !this.authService.isAdmin) {
        this.router.navigate(['/projects/user']);
        return false;
      }

      return true;
    }

    // Store the attempted URL for redirecting
    const tree = this.router.parseUrl(url);
    const primary: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    this.authService.redirectUrl = primary.toString();
    this.authService.redirictParams = tree.queryParams;

    // Navigate to the login page with extras
    this.authService.logout();
    return false;
  }
}

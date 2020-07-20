import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/features/auth/auth.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    // handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      // navigate /delete cookies or whatever
      this.authService.logout();
      if(this.router.url.endsWith('/signin')){
        this.router.navigate(['/signin'])
      }
      else{
        this.router.navigate(['/home']);
      }
      return of(err.message);
    }

    // relay error message from ImATeapotException to authservice
    if (err.status === 418) {
      throw new Error(err.error.message);
    }

    return throwError(err);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((er: HttpErrorResponse) => this.handleAuthError(er)));
  }
}

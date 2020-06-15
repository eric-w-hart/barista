import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from '@app/features/signin/signin.component';
import { SignupComponent } from '@app/features/signup/signup.component';
import { StatusComponent } from '@app/features/status/status.component';
import { HomeComponent } from '@app/features/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'status',
    component: StatusComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false },
  },
  {
    path: 'signin',
    component: SigninComponent,
    data: { showHeader: false, showSidebar: false },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { showHeader: false, showSidebar: false },
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { showHeader: false, showSidebar: false, showFooter: false },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { authenticationGuard } from './Guards/authentication.guard';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { BookListingComponent } from './Components/book-listing/book-listing.component';
import { PerfilComponent } from './Components/perfil/perfil.component';
import { ReviewComponent } from './Components/review/review.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { managerGuard } from './Guards/manager.guard';
import { clientGuard } from './Guards/client.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registerUser', component: RegisterComponent },
  { path: 'books', component: BookListingComponent },
  { path: 'books/:isbn', component: BookListingComponent },
  {
    path: 'books/my/:recommendations',
    component: BookListingComponent,
    canActivate: [clientGuard],
  },
  {
    path: 'profile',
    component: PerfilComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'reviews',
    component: ReviewComponent,
    canActivate: [clientGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [managerGuard],
  },
];

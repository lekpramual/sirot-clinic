import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!sessionStorage.getItem('authToken');

    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirect to login page if not authenticated
      return false;
    }
    return true;
  }
}

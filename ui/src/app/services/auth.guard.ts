import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _auth: AuthService,
    private router : Router
  ){

  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>{
    return this._auth.isLoggedIn
    .take(1)
    .map((isLoggedIn : boolean) =>{ console.log(isLoggedIn);
      if (!isLoggedIn) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    })
  }
}

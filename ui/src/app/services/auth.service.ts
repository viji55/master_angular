import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { GlobalVariable, NodeApiURL } from '../globalConfig';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
public baseApiUrl = GlobalVariable.BASE_API_URL
public baseFolderUrl = GlobalVariable.BASE_FOLDER_URL;
private loggedin = new BehaviorSubject<boolean>(false);
public checkLoggedIn = this.loggedin.asObservable();


  constructor(
    private router : Router,
    private http : HttpClient
  ) { }

  get isLoggedIn(){
    if(localStorage.getItem('user')){
      this.loggedin.next(true);
    }
    this.checkLoggedIn.subscribe((res) => {
      console.log(res);
    });
    return this.checkLoggedIn;
  }

  loginAdmin(userDetail){
    return this.http.post(this.baseApiUrl + NodeApiURL.ADMINLOGIN, userDetail)
    .share()
    .map(
      (result: any) => {
        if (result.status === 400) {
          this.loggedin.next(false);
        } else {
          this.loggedin.next(true);
        }
        return result;
      }
    )
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

}

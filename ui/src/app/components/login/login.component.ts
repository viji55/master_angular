import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Form, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NodeApiURL, GlobalConfig } from '../../globalConfig';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public myForm: any;
  public emailPattern: any = '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
  public formValid: any = true;
  public invalidlogin: any;
  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private http: HttpClient,
    private _auth : AuthService
  ) { }

  ngOnInit() {
    this._auth.checkLoggedIn.subscribe((res) => {
    console.log(res);
  });
    this.loginCheck();
    this.buildForm();
  }

  buildForm() {
    this.myForm = this._fb.group(
      {
        email: ['', [<any>Validators.required, Validators.pattern(this.emailPattern)]],
        password: ['', [<any>Validators.required]]
      })
  }

  loginCheck(){
    console.log(localStorage.getItem('userRole'));
    if(localStorage.getItem('token') && localStorage.getItem('userRole') == 'Admin'){
      console.log('in');
      this.router.navigate(['/f/c/home']);
    } 
  }

  loginAdmin(status: boolean ,myForm: any)
  {
    if(status){
        let userDetails = {
          'email' : myForm.email,
          'password' : myForm.password
        }
        this._auth.loginAdmin(userDetails).subscribe(
          res => {
            if(res['status'] === 200){
              var response = res.item;
              
              localStorage.setItem('user', JSON.stringify({user_id : response[0].id}));
              localStorage.setItem('userId', response[0].id);
              localStorage.setItem('userRole','Admin');
              localStorage.setItem('token', response[0].access_token);
              this.invalidlogin = false;
              this.router.navigate(['/f/c/home']);
            } else if(res['status'] ===300){
              this.invalidlogin = true;
              this.formValid = false;
            } else {
              this.invalidlogin = false;
              this.formValid = false;
            }
          },
          err => {
            console.log('Error:' + err);
          });
    } else {
      this.formValid = false;
    }
  }


}

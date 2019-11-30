import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NodeApiURL,GlobalVariable,GlobalConfig } from '../../../globalConfig';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private _common : CommonService,
    private router : Router
  ) { }

  ngOnInit() {
    console.log(localStorage.getItem('token'));
   console.log('home');
    this.getUsers();
  }
  
  getUsers(){
    this._common.get(NodeApiURL.CUSTOMERALL, {}).subscribe( res => {
      console.log(res);
    });
  }


}

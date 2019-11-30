import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,Validators,NgForm } from '@angular/forms';
import { HttpClient } from  '@angular/common/http';

import { CommonService } from  '../../../../services/common.service';
import { NodeApiURL,GlobalConfig,GlobalVariable } from '../../../../globalConfig';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  @ViewChild('formDirective') private formDirective: NgForm;
  public myForm : any;
  public formValid: any = true;
  public professionList: any;
  public qualificationList: any;
  public emailPattern: any = '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
  constructor(
    private router : Router,
    private _fb : FormBuilder,
    private http : HttpClient,
    private _cmnService : CommonService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getProfession();
    this.getQualification();

    console.log(NodeApiURL.ADDTEACHERS);
  }

  buildForm(){
    this.myForm = this._fb.group(
      {
        firstName: ['', [<any>Validators.required]],
        lastName: ['', [<any>Validators.required]],
        email: ['', [<any>Validators.required, Validators.pattern(this.emailPattern)]],
        qualification: ['', [<any>Validators.required]],
        experience: ['', [<any>Validators.required]],
        designation: ['', [<any>Validators.required]],
        martialStatus: [''],
        gender: [''],
        joinedDate: ['', [<any>Validators.required]],

      }
    )
  }

  getProfession(){
    this._cmnService.get(NodeApiURL.getProfession,{}).subscribe(
      res=>{
        if(res['status'] == 200 ){
          this.professionList = res['result'];
        }else {
          console.log(res['message']);
        }
      },
      err=>{
        console.log('Error:'+err);
      }
    )
  }

  getQualification(){
    this._cmnService.get(NodeApiURL.getQualificationAll,{}).subscribe(
      res=>{
        if(res['status'] == 200 ){
          this.qualificationList = res['result'];
        }else {
          console.log(res['message']);
        }
      },
      err=>{
        console.log('Error:'+err);
      }
    )
  }

  addTeacher(status:any,myForm){
   if(status){

    this.formValid = true;
    let sendDatas = {
      t_first_name : myForm.firstName,
      t_last_name : myForm.lastName,
      t_email : myForm.email,
      t_qualification : myForm.qualification,
      t_experience : myForm.experience,
      t_designation : myForm.designation,
      t_martial_status : myForm.martialStatus,
      t_gender : myForm.gender,
      t_joined_date : myForm.joinedDate
    }
    
    this._cmnService.post(NodeApiURL.ADDTEACHERS,sendDatas).subscribe(
    res=>{
        if(res['status'] == 200 ){
          console.log(res['result']);
          
          this.formDirective.resetForm();
        }else {
          console.log(res['message']);
        }
    },
    err=>{

    }
    )
    console.log(sendDatas);
   }else {
     this.formValid = false;
   }

  }

}

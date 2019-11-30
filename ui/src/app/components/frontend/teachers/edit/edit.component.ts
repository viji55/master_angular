import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder,FormControl,Validators,FormGroup,NgForm} from '@angular/forms';
import { MatOption } from '@angular/material'; 
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CommonService } from '../../../../services/common.service';
import { NodeApiURL,GlobalConfig,GlobalVariable } from '../../../../globalConfig';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
@ViewChild('formDirective') private formDirective: NgForm;
 public getQueryParams:number;
 public formValid:boolean = true;
 public emailPattern: any = '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
 public myForm:any;
 public professionList:any;
 public qualificationList:any;
 public teachersData:any;
 public selectedProductCategory:any;
public modeselect:any;
  constructor(
    private _fb : FormBuilder,
    private _cmnService :CommonService,
    private router : Router,
    private activateRoute : ActivatedRoute,
    private http:HttpClient
  ) {
    //get query parameter from url
    this.getQueryParams = this.activateRoute.snapshot.params.id;
   }

  ngOnInit() {
    
    this.getFacultiesData();
    this.getQualification();
    this.getProfession();
    this.buildForm();
  }

  buildForm(){
    this.myForm = this._fb.group({
      t_first_name: ['', [<any>Validators.required]],
      t_last_name: ['', [<any>Validators.required]],
      t_email: ['', [<any>Validators.required, Validators.pattern(this.emailPattern)]],
      t_qualification: ['', [<any>Validators.required]],
      t_experience: ['', [<any>Validators.required]],
      t_designation: ['', [<any>Validators.required]],
      t_martial_status: [''],
      t_gender: [''],
      t_joined_date: ['', [<any>Validators.required]],
    })
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

  getFacultiesData(){
    let sendData ={
      id : this.getQueryParams
    }
    console.log(sendData);
    this._cmnService.get(NodeApiURL.GETTEACHERS,sendData).subscribe(
      res=>{
        if(res['status'] == 200){
          this.teachersData = res['result'];
         

          this.myForm.patchValue({t_first_name: this.teachersData[0].t_first_name});
          this.myForm.patchValue({t_last_name: this.teachersData[0].t_last_name});
          this.myForm.patchValue({t_email: this.teachersData[0].t_email});
          this.myForm.patchValue({t_qualification: this.teachersData[0].t_qualification});
          this.myForm.patchValue({t_experience: this.teachersData[0].t_experience});
          this.myForm.patchValue({t_designation: this.teachersData[0].t_designation});
          this.myForm.patchValue({t_martial_status: this.teachersData[0].t_martial_status});
          this.myForm.patchValue({t_gender: this.teachersData[0].t_gender});
          this.myForm.patchValue({t_joined_date: this.teachersData[0].t_joined_date});
        }else {
          console.log(res['message']);
        }
          
      },
      err=>{
        console.log('Error'+err);
      }
    )
  }

}

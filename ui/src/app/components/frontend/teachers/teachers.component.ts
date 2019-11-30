import { Component, OnInit,Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
import { FormArray,FormBuilder,FormGroup,Validators, FormControl} from '@angular/forms';
import { MatDialog,MatPaginator,MatOption, PageEvent, MatTableDataSource, MatSort,MatSortHeader,MatTable } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs'
import "rxjs/Rx"; //fromevent
import {mergeMap} from 'rxjs/operators';
import { CommonService } from '../../../services/common.service';
import { NodeApiURL } from 'src/app/globalConfig';

interface Book {
  id:number
}

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
 // @Input('color') colorName:string;
 @ViewChild(MatPaginator) paginator: MatPaginator;
 
 @ViewChild(MatSort) sort: MatSort;
 @ViewChild('filter') filter: ElementRef; // to get input value
 @Input('sendDesgimationId') sendDesignation : number;
  public teachersList:any;
  homeworld: Observable<{}>;
  //pagintion add columns
  public displayedColumns = ["select","seqNo", "First Name", "Last Name", "Email", "Gender", "Profession", "Action"];
  dataSource:any =[]; //send result to pagination
  pageEvent: PageEvent; // page event
  pageSize: number=5; //inital page size
  length: number;
  pageSizeOptions: any = [1,5,10,50]; //size option
  public filterBy = new FormControl(); //for apply filter in pagination
  public searchArr:any = [
    {key:'t_first_name', text:'First Name'},
    {key:'t_last_name', text:'Last Name'}
  ]; // filter search based on column
  //pagintaion
  selection = new SelectionModel<string>(true,[]); // for select all checkbox
  constructor(
    private router:Router,
    private http:HttpClient,
    private _fb:FormBuilder,
    private _cmnService : CommonService
  ) { 
  
  }

  ngOnInit() {
 //   this.colorName = 'green';
    this.getAllTeachersList();
    this.searchValue();
    
  }

  ngAfterContentInit() {
    
  }

  dataLength:any;
  getAllTeachersList(){
    this._cmnService.get(NodeApiURL.ALLTEACHERS,{}).subscribe(
      res => {
        if(res['status'] == 200) {
      this.teachersList = res['result'];
      this.dataLength = res['result']['length'];
      //add object to paginator
      this.paginator.pageIndex = 0;
      console.log(res['result']);
      this.dataSource = new MatTableDataSource(res['result']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
        console.log(res);
       
        }else {
          console.log('No record Found');
        }
          
    },err=>{

    }
    );
  }
  
  
  public filterValue:any;
  searchValue(){
    //define #filter in @viewchild and using observable we can trigger the event and get value
    Observable.fromEvent(this.filter.nativeElement,'keyup').
    debounceTime(150).
    distinctUntilChanged().
    subscribe( res=>{
      this.filterValue = this.filter.nativeElement.value;
      
        if (!this.dataSource) { return; } else {
          if(this.filterBy.value){
              this.applyFilter();
          }else{
            this.dataSource.filter = this.filter.nativeElement.value;
          } 
        }
     

    });
  }

  applyFilter(){
      let filterByValue = this.filterBy.value;
      let addArray = [];
      this.selection.clear();
      console.log(this.filterBy.value);
      console.log(this.filterValue);
      if(this.filterValue == '') { this.getAllTeachersList(); }
      this.teachersList.find(x=>{ console.log(x);
        console.log(x[filterByValue]);
        var xKey = x[filterByValue].toLowerCase();
        var searchVal = this.filterValue;
        var finaSearch = (searchVal) ? searchVal.toLowerCase() : '';
        if(xKey == finaSearch){
          addArray.push(x);
          this.dataSource = new MatTableDataSource(addArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
      
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  editFaculty(id){
        this.router.navigate(['/f/c/teachers/edit/'+id]);
  }
  itemArr:any=[];
  deleteFaculty(id){
    let getFId = id;
    
    console.log(this.dataSource.data);
    this.itemArr = this.dataSource.data.filter( h => h.id !== id);
    this.dataSource = new MatTableDataSource(this.itemArr);
  }

  applyFilterOld(event){
    console.log(event);
    let searchValue = event;
    let addArray = [];
    if(event == ''){
      this.getAllTeachersList();
    }else {
    this.teachersList.find(x=>{
        if(x.t_first_name == searchValue || x.t_last_name == searchValue || x.t_email == searchValue || x.t_gender == searchValue){
          if(!x){
            return;
          }
          addArray.push(x);
          this.dataSource = new MatTableDataSource(addArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
     });
    }

  }


}

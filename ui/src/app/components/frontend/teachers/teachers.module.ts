import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS,HttpClientModule} from '@angular/common/http';
import { HttpModule} from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule,MatNativeDateModule,MatDatepickerModule,MatRadioModule,MatSelectModule,MatOptionModule,MatButtonModule,MatCheckboxModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule,MatTabsModule, MatSidenavModule, MatListModule,MatGridListModule} from '@angular/material';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { NgxLoadingModule } from 'ngx-loading';
import {RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
//modules
import { TeachersRoutingModule } from './teachers-routing.module';

//components
import { TeachersComponent } from './teachers.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';


//services
//import { AdminloginService } from './services/adminlogin.service';
//import { AdminservicesService } from './services/adminservices.service';






//guards

@NgModule({
  declarations: [
    TeachersComponent,
    AddComponent,
    EditComponent,
  ],
  imports: [
    TeachersRoutingModule,
    CommonModule,
    MatPaginatorModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  MatButtonModule,
  MatRadioModule,
  MatSelectModule,
  MatOptionModule,
  MatCheckboxModule, 
  MatCardModule,
  MatInputModule,
  MatDialogModule,
  MatTableModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  ButtonsModule,
  LayoutModule,
  MatSidenavModule,
  MatListModule,
  MatGridListModule,
  RouterModule
  ]
})
export class TeachersModule { }

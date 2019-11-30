import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS,HttpClientModule} from '@angular/common/http';
import { HttpModule} from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule,MatCheckboxModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule,MatTabsModule, MatSidenavModule, MatListModule,MatGridListModule,MatOptionModule,MatSelectModule} from '@angular/material';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { NgxLoadingModule } from 'ngx-loading';
import {RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
//modules
import { FrontendRoutingModule } from './frontend-routing.module';

//components
import { FrontendComponent } from './frontend.component';





//services
//import { AdminloginService } from './services/adminlogin.service';
//import { AdminservicesService } from './services/adminservices.service';






//guards

@NgModule({
  declarations: [
    FrontendComponent,
  ],
  imports: [
    FrontendRoutingModule,
    CommonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatToolbarModule,
  MatButtonModule, 
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
  ],
  exports: [
    FrontendComponent
  ]
})
export class FrontendModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS,HttpClientModule} from '@angular/common/http';
import {RouterModule } from '@angular/router';
/** Form Module */
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

/** Browser animation */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Flex module */
import { FlexLayoutModule } from '@angular/flex-layout';

/** Angular layout module */
import { MatTooltipModule,MatButtonModule,MatCheckboxModule, MatCardModule, MatDialogModule, MatInputModule,
  MatToolbarModule,MatMenuModule,MatIconModule, MatProgressSpinnerModule,MatTabsModule, MatSidenavModule, MatListModule,MatGridListModule,MatOptionModule,MatSelectModule,MatPaginatorModule,MatSnackBarModule} from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { LayoutModule } from '@angular/cdk/layout';
import { NgxLoadingModule } from 'ngx-loading';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
/**Navigation routing module */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TokenInterceptor } from './services/token.interceptor';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    MatPaginatorModule,
    BrowserModule,
    MatSelectModule,
    MatTooltipModule,
    MatOptionModule,
    HttpClientModule,
    MatTabsModule,
    MatCheckboxModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
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
  NgxLoadingModule.forRoot({}),
  RouterModule,
  MatSnackBarModule,

  ],
  providers: [AuthGuard,AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatTableModule, MatCheckboxModule, MatInputModule, MatIconModule, MatGridListModule, MatPaginatorModule, MatFormFieldModule, MatToolbarModule, MatTooltipModule, MatDialogModule, } from '@angular/material';
import { AppService } from "./app.service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule, MatCheckboxModule, MatInputModule, MatIconModule, MatGridListModule, MatPaginatorModule, MatFormFieldModule, MatToolbarModule,MatTooltipModule,MatDialogModule,
    FormsModule, ReactiveFormsModule,
    NgProgressModule
  ],
  entryComponents: [AppComponent, LoginDialogComponent],
  providers: [
    AppService,
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

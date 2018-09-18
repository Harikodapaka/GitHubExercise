import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatTableModule,
  MatCheckboxModule,
  MatInputModule,
  MatIconModule,
  MatGridListModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDialogModule,
} from '@angular/material';
import { AppService } from "./app.service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};


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
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule, ReactiveFormsModule,
    NgProgressModule, NotifierModule.withConfig(customNotifierOptions)
  ],
  entryComponents: [AppComponent, LoginDialogComponent],
  providers: [
    AppService,
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

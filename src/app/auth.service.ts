import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  authenticateUser(token){
    let url = `https://api.github.com/user`;
    return this.http.get(url,{'headers':{
      'Content-Type':  'application/json',
      'Authorization': 'token '+token
    }})
    .catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
  getUserToken(){
    let token = sessionStorage.getItem('user_token');
    if(token) return token;
    sessionStorage.clear();
    alert("Please Login!!");
    return "";
  }
  isUserLoggedIn(){
    let token = sessionStorage.getItem('user_token');
    if(token) return true;
    sessionStorage.clear();
    // alert("Please Login!!");
    return false;
  }
}

import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// This service deals with autherization calls..
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // This function checks the user token is valid or not and returns status code.
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
  // This function returns the token from session Storage
  getUserToken(){
    let token = sessionStorage.getItem('user_token');
    if(token) return token;
    sessionStorage.clear();
    //alert("Please Login!!");
    return "";
  }
  // This function returns a boolean
  isUserLoggedIn(){
    let token = sessionStorage.getItem('user_token');
    if(token) return true;
    sessionStorage.clear();
    // alert("Please Login!!");
    return false;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
//  This is an injectable servise to handle the API requests
@Injectable({
  providedIn: 'root'
})

export class AppService {
  constructor(private http: HttpClient, private authService:AuthService) { }
  // this function is to prepare headers and return them when it is called
  getHeaders(){
    return  {
      'Content-Type':  'application/json',
      'Authorization': 'token '+ this.authService.getUserToken()
    }
  }
  // This function returns the results (Obeservable) of search criteria  
  searchRepos(reponame){
    let url = `https://api.github.com/search/repositories?q=${reponame}&sort=updated&order=desc&per_page=10`;
    return this.http.get(url).catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });;
  }
  // This function returns the latest release of specific repository
  getLatestVersion(repo){
    let url = `https://api.github.com/repos/${repo}/releases/latest`;
    return this.http.get(url,{headers:this.getHeaders()}).catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
  // This function returns the status code 204 if specific repository is already starred otherwise error code.
  checkIsFavorite(repoDetails){
    let url = `https://api.github.com/user/starred/${repoDetails}`;
    return this.http.get(url,{headers:this.getHeaders()})
    .catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
  // This function returns the status code 204 if specific repository is starred otherwise error code.
  addToFavoritesList(repoDetails){
    let url = `https://api.github.com/user/starred/${repoDetails}`;

    return this.http.put(url,{},{headers: this.getHeaders()})
    .catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
  // This function returns the status code 204 if specific repository is unstarred otherwise error code.
  removeFromFavoritesList(repoDetails){
    let url = `https://api.github.com/user/starred/${repoDetails}`;
    return this.http.delete(url,{headers:this.getHeaders()})
    .catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
  // This function returns the starred repositories of a user.
  getFavoritesList(){
    let url = `https://api.github.com/user/starred`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'token '+ this.authService.getUserToken(),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      })
    };
    return this.http.get(url, {headers:this.getHeaders()})
    .catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
}

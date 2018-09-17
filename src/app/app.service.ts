import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  constructor(private http: HttpClient, private authService:AuthService) { }
  getHeaders(){
    return  {
      'Content-Type':  'application/json',
      'Authorization': 'token '+ this.authService.getUserToken()
    }
  }
  searchRepos(reponame){
    let url = `https://api.github.com/search/repositories?q=${reponame}&sort=updated&order=desc&limit=10`;
    return this.http.get(url).catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });;
  }
  getLatestVersion(repo){
    let url = `https://api.github.com/repos/${repo}/releases/latest`;
    return this.http.get(url,{headers:this.getHeaders()}).catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
  checkIsFavorite(repoDetails){
    let url = `https://api.github.com/user/starred/${repoDetails}`;
    return this.http.get(url,{headers:this.getHeaders()})
    .catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
  addToFavoritesList(repoDetails){
    let url = `https://api.github.com/user/starred/${repoDetails}`;
    return this.http.put(url,{headers:this.getHeaders()})
    .catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
  removeFromFavoritesList(repoDetails){
    let url = `https://api.github.com/user/starred/${repoDetails}`;
    return this.http.delete(url,{headers:this.getHeaders()})
    .catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
  getFavoritesList(){
    let url = `https://api.github.com/user/starred`;
    return this.http.get(url, {headers:this.getHeaders()})
    .catch((err) => {
      return Observable.of(err as HttpErrorResponse);
    });
  }
}

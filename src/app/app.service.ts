import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  searchRepos(reponame){
    let url = `https://api.github.com/search/repositories?q=${reponame}&sort=updated&order=desc&limit=10`;
    return this.http.get(url);
    
  } 
}

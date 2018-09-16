import { Component } from '@angular/core';
import { AppService } from './app.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  dataSource: any;
  searchInput: string;
  displayedColumns: string[] = ['full_name', 'language', 'latest_tag', 'action'];

  constructor(private appService: AppService) {
  }
  searchRepos() {
    this.appService.searchRepos(this.searchInput)
      .subscribe((repos) => this.dataSource = repos['items']);
  }
  resetrepos(){
    this.dataSource = "";
    this.searchInput = '';
  }
}

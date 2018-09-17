import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service'
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  dataSource: any;
  favouratesDataSource: any;
  displayedColumns: string[] = ['full_name', 'language', 'latest_tag', 'action'];

  constructor(private appService: AppService, public dialog: MatDialog, public authService: AuthService) {
  }
  search = new FormControl('', [Validators.required]);
  showLoginWindow() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '25em',
      data: { 'token': '' }
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        let userResponse = await this.authService.authenticateUser(result).toPromise() || { status: 200 };
        console.log(userResponse);
        if (userResponse['status'] !== 401) {
          sessionStorage.setItem('user_token', result);
        } else {
          sessionStorage.clear();
          alert('Login not successfull...');
        }
      }
    });
  }
  ngOnInit(): void {
    this.authService.isUserLoggedIn() ? this.getFavoritesList() : this.showLoginWindow();
  }
  async searchRepos() {
    if (!this.authService.isUserLoggedIn()) { this.showLoginWindow(); return; }
    if (!this.search.hasError('required')) {
      let allRepos = await this.appService.searchRepos(this.search.value).toPromise();
      let topTenRepos = allRepos['items'].slice(0, 10);
      topTenRepos.forEach(async repo => {
        let latestTag = await this.appService.getLatestVersion(repo.full_name).toPromise() || { 'status': '' };
        if (latestTag['status'] !== 404) {
          repo.latest_tag = latestTag['tag_name'];
        }
        let favrepos = await this.appService.checkIsFavorite(repo.full_name).toPromise() || { 'status': '' };
        if (favrepos['status'] !== 404) {
          repo.isStarredRepo = true;
        } else {
          repo.isStarredRepo = false;
        }
      });
      this.dataSource = topTenRepos;
    }
  }
  resetrepos() {
    this.dataSource = "";
    this.search.reset();
  }
  async addToFavourite(repo) {
    if (!this.authService.isUserLoggedIn()) { this.showLoginWindow(); return; }
    let favrepos = await this.appService.addToFavoritesList(repo.full_name).toPromise() || { 'status': '200' };
    if (favrepos['status'] !== 404) {
      alert('success' + favrepos);
    } else {
      repo.isStarredRepo = false;
      alert('danger' + favrepos);
    }
  }
  async deleteFromFavourite(repo) {
    if (!this.authService.isUserLoggedIn()) { this.showLoginWindow(); return; }
    let favrepos = await this.appService.removeFromFavoritesList(repo.full_name).toPromise() || { 'status': '200' };
    if (favrepos['status'] !== 404) {
      alert('Request Succeeded with code' + favrepos['status'] + '  Please refresh few munites later...')
      this.getFavoritesList();
    } else {
      repo.isStarredRepo = false;
      alert('danger' + favrepos);
    }
  }
  async getFavoritesList() {
    if (!this.authService.isUserLoggedIn()) { this.showLoginWindow(); return; }
    this.favouratesDataSource = await this.appService.getFavoritesList().toPromise();
  }
}

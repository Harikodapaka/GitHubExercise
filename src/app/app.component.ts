import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service'
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { AuthService } from './auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  dataSource: any;
  favouratesDataSource: any;
  displayedColumns: string[] = ['full_name', 'language', 'latest_tag', 'action'];

  constructor(private appService: AppService,
    public dialog: MatDialog,
    public authService: AuthService,
    private notifier: NotifierService) {
  }
  search = new FormControl('', [Validators.required]);
  ngOnInit(): void {
    this.authService.isUserLoggedIn() ? this.getFavoritesList() : this.showLoginWindow();
  }
  // This function open a material dialog to enter token
  showLoginWindow() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '25em',
      data: { 'token': '' }
    });
    dialogRef.afterClosed().subscribe(async result => {
      console.log('The dialog was closed');
      if (result) {
        let userResponse = await this.authService.authenticateUser(result).toPromise() || { status: 200 };
        if (userResponse['status'] !== 401) {
          sessionStorage.setItem('user_token', result);
          this.showNotification('success', 'Login in successful');
        } else {
          sessionStorage.clear();
          this.showNotification('error', 'Sorry, can not login. Enter valid token');

        }
      }
    });
  }
  public showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }
  // This function calls API to search the repos 
  async searchRepos() {
    // checking the user is valid or not
    if (!this.authService.isUserLoggedIn()) { this.showLoginWindow(); return; }
    if (!this.search.hasError('required')) {
      let allRepos = await this.appService.searchRepos(this.search.value).toPromise();
      // looping through all repositories and checking the latest tag and is alreadey favorite or no 
      allRepos['items'].forEach(async repo => {
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
      this.dataSource = allRepos['items'];
    }
  }
  // Resets the form and table data
  resetrepos() {
    this.dataSource = "";
    this.search.reset();
  }
  // This Function call the app service to add a specific repository to favourites...
  async addToFavourite(repo) {
    // checking the user is valid or not
    if (!this.authService.isUserLoggedIn()) { this.showLoginWindow(); return; }
    let favrepos = await this.appService.addToFavoritesList(repo.full_name).toPromise() || { 'status': '200' };
    if (favrepos['status'] !== 404) {
      this.showNotification('success', `Request Succeeded with code ${favrepos['status']}!!`);
      this.dataSource.forEach((ele) => {
        if(ele.full_name === repo.full_name){ ele.isStarredRepo = true;}
      });
      this.getFavoritesList();
    } else {
      this.showNotification('warning', `Request not Succeeded and response code is -  ${favrepos['status']}`);
    }
  }
  // This Function call the app service to remove a specific repository from favourites...
  async deleteFromFavourite(repo) {
    // checking the user is valid or not
    if (!this.authService.isUserLoggedIn()) { this.showLoginWindow(); return; }
    let favrepos = await this.appService.removeFromFavoritesList(repo.full_name).toPromise() || { 'status': '200' };
    if (favrepos['status'] !== 404) {
      this.showNotification('success', `Request Succeeded with code ${favrepos['status']}!!`);
      this.getFavoritesList();
    } else {
      repo.isStarredRepo = false;
      this.showNotification('warning', `Request not Succeeded and response code is -  ${favrepos['status']}`);
    }
  }
  // getting the all starred repositories
  async getFavoritesList() {
    if (!this.authService.isUserLoggedIn()) { this.showLoginWindow(); return; }
    let allRepos: any = await this.appService.getFavoritesList().toPromise();
    if(allRepos){
      allRepos.forEach(async repo => {
        let latestTag = await this.appService.getLatestVersion(repo.full_name).toPromise() || { 'status': '' };
        if (latestTag['status'] !== 404) {
          repo.latest_tag = latestTag['tag_name'];
        }
      });
      this.favouratesDataSource = allRepos;
    }
  }
}

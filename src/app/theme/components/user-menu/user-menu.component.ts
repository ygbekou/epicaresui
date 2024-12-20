import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { TokenStorage } from 'src/app/token.storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  constructor(public appService:AppService,
    public router: Router,
    public tokenStorage: TokenStorage) { }

  ngOnInit() {
  }

  logout(){
    this.tokenStorage.clearAuthData();
    this.router.navigate(['/login','0']);
  }
}

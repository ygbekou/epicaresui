import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings, Settings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public settings: Settings;
  constructor(public appSettings: AppSettings, appService: AppService, public router: Router) {
    this.settings = appService.appSettings.settings;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
  }

  public getDemo(number) {
    if (number == 1) {
      this.settings.toolbar = 1;
      this.settings.header = 'default';
      this.settings.theme = 'blue';
      this.settings.rtl = false;
    }
    if (number == 2) {
      this.settings.toolbar = 1;
      this.settings.header = 'image';
      this.settings.theme = 'blue';
      this.settings.rtl = false;
    }
    if (number == 3) {
      this.settings.toolbar = 1;
      this.settings.header = 'carousel';
      this.settings.theme = 'blue';
      this.settings.rtl = false;
    }
    if (number == 4) {
      this.settings.toolbar = 2;
      this.settings.header = 'image';
      this.settings.theme = 'blue';
      this.settings.rtl = false;
    }
    if (number == 5) {
      this.settings.toolbar = 2;
      this.settings.header = 'image';
      this.settings.theme = 'orange-dark';
      this.settings.rtl = false;
    }
    if (number == 6) {
      this.settings.toolbar = 1;
      this.settings.header = 'image';
      this.settings.theme = 'blue';
      this.settings.rtl = true;
    }
    this.router.navigate(['/']);
  }

  public getSkin(num) {
    if (num == 1) {
      this.settings.theme = 'blue';
      this.settings.header = "carousel";
    }
    if (num == 2) {
      this.settings.theme = 'green';
      this.settings.header = "carousel";
    }
    if (num == 3) {
      this.settings.theme = 'red';
      this.settings.header = "carousel";
    }
    if (num == 4) {
      this.settings.theme = 'pink';
      this.settings.header = "carousel";
    }
    if (num == 5) {
      this.settings.theme = 'purple';
      this.settings.header = "carousel";
    }
    if (num == 6) {
      this.settings.theme = 'grey';
      this.settings.header = "carousel";

    }
    this.settings.toolbar = 1;
    this.settings.rtl = false;

    this.router.navigate(['/']);
  }


  public scrollToDemos() {
    var elmnt = document.getElementById("demos");
    elmnt.scrollIntoView({ behavior: "smooth" });
  }
  public goToTop() {
    var elmnt = document.getElementById("top");
    elmnt.scrollIntoView({ behavior: "smooth" });
  }

}

import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TokenStorage } from 'src/app/token.storage';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, AfterViewInit {
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen = true;
  lang = 'fr';
  public links = [
    { name: 'Profile', href: 'user/' + this.tokenStorage.getUserId(), icon: 'person' },
    { name: 'Utilisateurs', href: 'user-list', icon: 'groups' },
    { name: 'Articles', href: 'news-list', icon: 'view_list' },
    { name: 'Projets', href: 'project-list', icon: 'handyman' },
    { name: 'Evenements', href: 'event-list', icon: 'event' },
    { name: 'Configuration', href: 'configs', icon: 'build' },
    { name: 'Setting', href: 'settings', icon: 'settings' },
    { name: 'Modifier le site', href: 'sections', icon: 'web' },
    { name: 'Deconnexion', href: '/login', icon: 'power_settings_new' },
    { name: 'Sondages & Votes ', href: 'poll-list', icon: 'view_list' },
    { name: 'Finances ', href: 'transaction-list', icon: 'view_list' }
    /*
    { name: 'Administration', href: 'admin', icon: 'admin' },
    { name: 'Publicites', href: 'publicity-list', icon: 'view_list' },
    { name: 'Videos', href: 'video-list', icon: 'view_list' },
    { name: 'Images', href: 'image-list', icon: 'view_list' },
    { name: 'Email', href: 'email', icon: 'email' },
    { name: 'Rapports de reunion', href: 'meeting-report-list', icon: 'view_list' },
    { name: 'Messages', href: 'cmessages', icon: 'phone' } */
  ];
  constructor(public router: Router, public tokenStorage: TokenStorage) {
    console.log(this.tokenStorage);
    if (!this.tokenStorage.hasToken()) {
      this.logout();
    }
  }

  ngOnInit() {
    console.log(this.tokenStorage);
    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      lang = Cookie.get('lang');
      console.log('Using cookie lang=' + Cookie.get('lang'));
    } else if (lang) {
      console.log('Using browser lang=' + lang);
      // this.translate.use(lang);
    } else {
      lang = 'fr';
      console.log('Using default lang=fr');
    }
    this.lang = lang;
    if (this.tokenStorage.getRole() === '1') { // admin
      this.links = [
        { name: 'Profile', href: 'user/' + this.tokenStorage.getUserId(), icon: 'person' },
        { name: 'Utilisateurs', href: 'user-list', icon: 'groups' },
        { name: 'Articles', href: 'news-list', icon: 'view_list' },
        { name: 'Projets', href: 'project-list', icon: 'handyman' },
        { name: 'Evenements', href: 'event-list', icon: 'event' },
        { name: "Offres d'emploi", href: 'job-position-list', icon: 'alarm' },
        { name: 'Sondages & Votes ', href: 'poll-list', icon: 'view_list' },
        { name: 'Finances ', href: 'transaction-list', icon: 'view_list' },
        { name: 'Configuration', href: 'configs', icon: 'build' },
        { name: 'Setting', href: 'settings', icon: 'settings' },
        { name: 'Modifier le site', href: 'sections', icon: 'web' },
        { name: 'Images Principales', href: 'sliders', icon: 'web' },
        { name: 'Deconnexion', href: '/login', icon: 'power_settings_new' }
        /*
        { name: 'Administration', href: 'admin', icon: 'admin' },
        { name: 'Publicites', href: 'publicity-list', icon: 'view_list' },
        { name: 'Videos', href: 'video-list', icon: 'view_list' },
        { name: 'Images', href: 'image-list', icon: 'view_list' },
        { name: 'Email', href: 'email', icon: 'email' },
        { name: 'Rapports de reunion', href: 'meeting-report-list', icon: 'view_list' },
        { name: 'Messages', href: 'cmessages', icon: 'phone' } */
      ];
    } else if (this.tokenStorage.getRole() === '10') { // editor
      this.links = [
        { name: 'Profile', href: 'user/' + this.tokenStorage.getUserId(), icon: 'person' },
        { name: 'Utilisateurs', href: 'user-list', icon: 'groups' },
        { name: 'Articles', href: 'news-list', icon: 'view_list' },
        { name: 'Projets', href: 'project-list', icon: 'handyman' },
        { name: 'Evenements', href: 'event-list', icon: 'event' },
        { name: 'Deconnexion', href: '/login', icon: 'power_settings_new' }
      ]
    } else if (this.tokenStorage.getRole() === '20') { // Finance
      this.links = [
        { name: 'Profile', href: 'user/' + this.tokenStorage.getUserId(), icon: 'person' },
        { name: 'Utilisateurs', href: 'user-list', icon: 'groups' },
        { name: 'Articles', href: 'news-list', icon: 'view_list' },
        { name: 'Projets', href: 'project-list', icon: 'handyman' },
        { name: 'Evenements', href: 'event-list', icon: 'event' },
        { name: 'Deconnexion', href: '/login', icon: 'power_settings_new' }
      ]
    } else if (this.tokenStorage.getRole() === '30') { // Membres
      this.links = [
        { name: 'Profile', href: 'user/' + this.tokenStorage.getUserId(), icon: 'person' },
        { name: 'Projets', href: 'project-list', icon: 'handyman' },
        { name: 'Evenements', href: 'event-list', icon: 'event' },
        { name: 'Deconnexion', href: '/login', icon: 'power_settings_new' }
      ]
    }

    if (this.lang === 'en') {
      if (this.tokenStorage.getRole() === '1') { // admin
        this.links = [
          { name: 'Profile', href: 'user/' + this.tokenStorage.getUserId(), icon: 'person' },
          { name: 'Users', href: 'user-list', icon: 'groups' },
          { name: 'Articles', href: 'news-list', icon: 'view_list' },
          { name: 'Projects', href: 'project-list', icon: 'handyman' },
          { name: 'Events', href: 'event-list', icon: 'event' },
          { name: 'Job Postings', href: 'job-position-list', icon: 'alarm' },
          { name: 'Sondages & Votes ', href: 'poll-list', icon: 'view_list' },
          { name: 'Finances ', href: 'transaction-list', icon: 'view_list' },
          { name: 'Configuration', href: 'configs', icon: 'build' },
          { name: 'Setting', href: 'settings', icon: 'settings' },
          { name: 'Modify website', href: 'sections', icon: 'web' },
          { name: 'Main Images', href: 'sliders', icon: 'web' },
          { name: 'Disconnect', href: '/login', icon: 'power_settings_new' }
          /*
          { name: 'Administration', href: 'admin', icon: 'admin' },
          { name: 'Publicites', href: 'publicity-list', icon: 'view_list' },
          { name: 'Videos', href: 'video-list', icon: 'view_list' },
          { name: 'Images', href: 'image-list', icon: 'view_list' },
          { name: 'Email', href: 'email', icon: 'email' },
          { name: 'Rapports de reunion', href: 'meeting-report-list', icon: 'view_list' },
          { name: 'Messages', href: 'cmessages', icon: 'phone' } */
        ];
      } else if (this.tokenStorage.getRole() === '10') { // editor
        this.links = [
          { name: 'Profile', href: 'user/' + this.tokenStorage.getUserId(), icon: 'person' },
          { name: 'Users', href: 'user-list', icon: 'groups' },
          { name: 'Articles', href: 'news-list', icon: 'view_list' },
          { name: 'Projects', href: 'project-list', icon: 'handyman' },
          { name: 'Events', href: 'event-list', icon: 'event' },
          { name: 'Disconnect', href: '/login', icon: 'power_settings_new' }
        ]
      } else if (this.tokenStorage.getRole() === '20') { // Finance
        this.links = [
          { name: 'Profile', href: 'user/' + this.tokenStorage.getUserId(), icon: 'person' },
          { name: 'Users', href: 'user-list', icon: 'groups' },
          { name: 'Articles', href: 'news-list', icon: 'view_list' },
          { name: 'Projects', href: 'project-list', icon: 'handyman' },
          { name: 'Events', href: 'event-list', icon: 'event' },
          { name: 'Disconnect', href: '/login', icon: 'power_settings_new' }
        ]
      } else if (this.tokenStorage.getRole() === '30') { // Membres
        this.links = [
          { name: 'Profile', href: 'user/' + this.tokenStorage.getUserId(), icon: 'person' },
          { name: 'Projects', href: 'project-list', icon: 'handyman' },
          { name: 'Events', href: 'event-list', icon: 'event' },
          { name: 'Disconnect', href: '/login', icon: 'power_settings_new' }
        ]
      }

    }

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    };
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (window.innerWidth < 960) {
          this.sidenav.close();
        }
      }
    });
  }
  logout() {
    this.tokenStorage.clearAuthData();
    this.router.navigate(['/login/0']);
  }

}

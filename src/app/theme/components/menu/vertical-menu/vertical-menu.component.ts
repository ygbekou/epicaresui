import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../menu.service';
import { Menu } from '../menu.model';
import { AppService } from 'src/app/app.service';
import { Section } from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  providers: [ MenuService ]
})
export class VerticalMenuComponent implements OnInit {
  @Input('menuParentId') menuParentId;
  lang='fr';
  public menuItems: Array<Menu> = [];
  constructor(private menuService: MenuService,
    private appService: AppService) {
  }

  ngOnInit() {
    this.getLang();
    this.getMenu();
  }


  getMenu() {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.lang + '|String');
    parameters.push('e.status = |status|1|Integer');
    parameters.push('e.showInMenu = |showInMenu|1|Integer');
    this.appService.getAllByCriteria('com.wack.model.website.Section', parameters,' order by e.rank ')
      .subscribe((data: Section[]) => {
        this.menuItems.push(new Menu(1, this.lang === 'fr' ? 'Accueil' : 'Home', '/', null, null, false, 0));
        this.menuItems.push(new Menu(10, this.lang === 'fr' ? 'A Propos' : 'About us', '/leadership', null, null, false, 0));
        //this.menuItems.push(new Menu(20, this.lang === 'fr' ? 'Services' : 'Services', null, null, null, true, 0));
        // this.menuItems.push(new Menu(30, this.lang === 'fr' ? 'Kalmoudou' : 'Kalmoudou', null, null, null, true, 0));
        if (data.length > 0) {
          let j = 0;
          let k = 0;
          let l = 0;
          let m = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i].menu === 'SERVICES') {
              this.menuItems.push(new Menu(21 + j++, data[i].title, '/section/' + data[i].name, null, null, false, 20));
            } else if (data[i].menu === 'EXPERTISE') {
              this.menuItems.push(new Menu(31 + k++, data[i].title, '/section/' + data[i].name, null, null, false, 30));
            } else if (data[i].menu === 'ABOUTUS') {
              this.menuItems.push(new Menu(11 + l++, data[i].title, '/section/' + data[i].name, null, null, false, 10));
            } else {
              this.menuItems.push(new Menu(100 + m++, data[i].title, '/section/' + data[i].name, null, null, false, 0));
            }
          }
        }

        if (this.appService.company.displayMenuCareer) {
          this.menuItems.push(new Menu(40, this.lang === 'fr' ? 'Blogue' : 'Blog', '/blogs', null, null, false, 0));
        }

        // this.menuItems.push(new Menu(45, this.lang === 'fr' ? 'Projets' : 'Projects', '/projects', null, null, false, 0));

        this.menuItems.push(new Menu(50, 'Contact', '/contact', null, null, false, 0));

        if (this.appService.company.displayMenuCareer) {
          this.menuItems.push(new Menu(55, this.lang === 'fr' ? 'Carri�re' : 'Careers', '/careers', null, null, false, 0));
        }

        if (this.appService.company.displayMenuPoll) {
          this.menuItems.push(new Menu(60, this.lang === 'fr' ? 'Scrutins' : 'Polls', '/polls', null, null, false, 0));
        }

        if (this.appService.company.displayMenuProject) {
          this.menuItems.push(new Menu(65, this.lang === 'fr' ? 'Projets' : 'Projects', '/projects', null, null, false, 0));
        }

        if (this.appService.company.displayMenuEvent) {
          this.menuItems.push(new Menu(70, this.lang === 'fr' ? 'Evenements' : 'Events', '/events', null, null, false, 0));
        }

        // this.menuItems.push(new Menu(60, 'FAQ', '/faq', null, null, false, 0));
        this.menuItems = this.menuItems.filter(item => item.parentId === this.menuParentId);
      }, error => console.log(error),
        () => console.log('Get Menu complete'));
  }


  getLang(): string {
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
    this.lang=lang;
    return lang;
  }

  onClick(menuId){
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuService.getVerticalMenuItems(), menuId);
  }

}

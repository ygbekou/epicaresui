import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Menu } from './menu.model';
import { verticalMenuItems, horizontalMenuItems } from './menu';
import { AppService } from 'src/app/app.service';
import { Section, SectionItem } from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class MenuService {
  constructor(private location: Location,
    private appService: AppService,
    private router: Router) {
  }

  public getVerticalMenuItems(): Array<Menu> {
    return verticalMenuItems;
  }

  public getHorizontalMenuItems(): Array<Menu> {
    return horizontalMenuItems;
  }

  public expandActiveSubMenu(menu: Array<Menu>) {
    const url = this.location.path();
    const routerLink = decodeURIComponent(url);
    const activeMenuItem = menu.filter(item => item.routerLink === routerLink);
    if (activeMenuItem[0]) {
      let menuItem = activeMenuItem[0];
      while (menuItem.parentId !== 0) {
        const parentMenuItem = menu.filter(item => item.id === menuItem.parentId)[0];
        menuItem = parentMenuItem;
        this.toggleMenuItem(menuItem.id);
      }
    }
  }

  public toggleMenuItem(menuId) {
    const menuItem = document.getElementById('menu-item-' + menuId);
    const subMenu = document.getElementById('sub-menu-' + menuId);
    if (subMenu) {
      if (subMenu.classList.contains('show')) {
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else {
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }
    }
  }

  public closeOtherSubMenus(menu: Array<Menu>, menuId) {
    const currentMenuItem = menu.filter(item => item.id === menuId)[0];
    menu.forEach(item => {
      if ((item.id !== menuId && item.parentId === currentMenuItem.parentId) || (currentMenuItem.parentId === 0 && item.id !== menuId)) {
        const subMenu = document.getElementById('sub-menu-' + item.id);
        const menuItem = document.getElementById('menu-item-' + item.id);
        if (subMenu) {
          if (subMenu.classList.contains('show')) {
            subMenu.classList.remove('show');
            menuItem.classList.remove('expanded');
          }
        }
      }
    });
  }

  public closeAllSubMenus() {
    verticalMenuItems.forEach(item => {
      const subMenu = document.getElementById('sub-menu-' + item.id);
      const menuItem = document.getElementById('menu-item-' + item.id);
      if (subMenu) {
        if (subMenu.classList.contains('show')) {
          subMenu.classList.remove('show');
          menuItem.classList.remove('expanded');
        }
      }
    });
  }

}
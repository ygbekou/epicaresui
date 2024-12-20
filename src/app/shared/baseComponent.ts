import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from '../token.storage';
import { MatTableDataSource } from '@angular/material/table';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  template: ``,
  providers: []
})
export class BaseComponent {

  public messages: string;
  public messageColor: string;
  public hasError: boolean;

  public flag: any;
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];

  constructor
    (
      protected translate: TranslateService,
      protected tokenStorage: TokenStorage
    ) {

  }

  protected processResult(result, entityObject, pictureUrl) {
    if (result.errors === null || result.errors.length === 0) {
      this.hasError = false;
      entityObject = result;
      this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
        this.messages = res['MESSAGE.SAVE_SUCCESS'];
      });

      if (entityObject.user && entityObject.user.birthDate != null) {
        entityObject.user.birthDate = new Date(entityObject.user.birthDate);
      }
      if (pictureUrl) {
        pictureUrl = '';
      }
    } else {
      this.hasError = true;
      this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
        this.messages = res['MESSAGE.SAVE_UNSUCCESS'] + '<br/>' + result.errors[0];
      });
    }
  }

  protected processResultBasedOnId(result, entityObject) {
    if (result.id > 0) {
      entityObject = result;
      this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
        this.messages = res['MESSAGE.SAVE_SUCCESS'];
      });
    } else {
      this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
        this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
      });
    }
  }



  removeItem(listItems: any[], id: number) {
    const index = listItems.findIndex(x => x.id === id);
    listItems.splice(index, 1);
  }

  removeElement(listItems: any[], name: string) {
    const index = listItems.findIndex(x => x === name);
    listItems.splice(index, 1);
  }

  protected processDeleteResult(result, messages) {
    if (result.result === 'SUCCESS') {
      this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_SUCCESS']).subscribe(res => {
        this.messages = res['MESSAGE.DELETE_SUCCESS'];
      });
    } else {
      this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_UNSUCCESS', 'MESSAGE.' + result.errors[0]]).subscribe(res => {
        messages = res['MESSAGE.DELETE_UNSUCCESS'] + ': ' + res['MESSAGE.' + result.errors[0]];
      });
    }
  }


  updateDatasourceData(dataSource, paginator, sort, obj) {

    const index = dataSource.data.findIndex(x => x.id === obj.id);

    if (index === -1) {
      dataSource.data.unshift(obj);
    } else {
      dataSource.data[index] = obj;
    }

    dataSource.data = dataSource.data.slice();
    dataSource = new MatTableDataSource(dataSource.data);
    dataSource.paginator = paginator;
    dataSource.sort = sort;
  }


  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
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
    return lang;
  }

  getFlag() {
    let lang = this.getLang();
    if (lang === 'fr') {
      this.flag = this.flags[0];
    } else {
      this.flag = this.flags[1];
    }
  }
}

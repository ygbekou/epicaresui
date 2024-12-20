import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service'; 
import { Section, SectionItem } from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-our-partners',
  templateUrl: './our-partners.component.html',
  styleUrls: ['./our-partners.component.scss']
})
export class OurPartnersComponent implements OnInit {
  section: Section = new Section();
  sectionItems: SectionItem[] = [];
  constructor(public appService: AppService ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.name = |name|OUR_PARTNERS|String');
    parameters.push('e.language = |language|' + this.getLang() + '|String');
    parameters.push('e.status = |status|1|Integer');
    this.appService.getAllByCriteria('com.wack.model.website.Section', parameters)
      .subscribe((data: Section[]) => {
        console.log(data);
        if (data.length > 0) {
          this.section = data[0];
          const params: string[] = [];
          params.push('e.section.id = |sectionId|' + this.section.id + '|Long');
          params.push('e.status = |status|1|Integer');
          this.appService.getAllByCriteria('com.wack.model.website.SectionItem', params,' order by e.rank ')
            .subscribe((data2: SectionItem[]) => {
              console.log(data2);
              this.sectionItems = data2;
            }, error => console.log(error),
              () => console.log('Get Section Items complete'));

        }
      }, error => console.log(error),
        () => console.log('Get Section complete'));
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

}

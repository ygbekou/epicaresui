import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Section, SectionItem } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sction',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  section: Section = new Section();
  sectionItems: SectionItem[] = [];
  constructor(private route: ActivatedRoute,
    private translate: TranslateService,
    public appService: AppService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params);
      this.getSection(params.get('name'));
    })
  }

  getSection(name: string) {
    const parameters: string[] = [];
    parameters.push('e.name = |name|' + name + '|String');
    parameters.push('e.language = |language|' + this.getLang() + '|String');
    parameters.push('e.status = |status|1|Integer');
    this.appService.getAllByCriteria('com.wack.model.website.Section', parameters,' order by e.rank ')
      .subscribe((data: Section[]) => {
        console.log(data);
        if (data.length > 0) {
          this.section = data[0];
          const params: string[] = [];
          params.push('e.section.id = |sectionId|' + this.section.id + '|Long');
          params.push('e.status = |status|1|Integer');
          this.appService.getAllByCriteria('com.wack.model.website.SectionItem', params)
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

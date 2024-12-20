import { Component, OnInit } from '@angular/core';
import { Section, SectionItem, JobPositionDesc } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss']
})
export class CareerComponent implements OnInit {

  jobPositionDescs: JobPositionDesc[];

  constructor(public appService: AppService,
    public router: Router,
    private translate: TranslateService) { }
  ngOnInit() {
    this.getAll();
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.appService.getFlag().code + '|String');
    parameters.push('e.jobPosition.status = |statusTxt|1|Integer');
    this.appService.getAllByCriteria('JobPositionDesc', parameters)
      .subscribe((data: JobPositionDesc[]) => {
        console.log(data);
        this.jobPositionDescs = data;
      }, error => console.log(error),
        () => console.log('Get Job position complete'));
  }


  apply(jobPositionDesc: JobPositionDesc) {
    console.log(jobPositionDesc.id)
    this.router.navigate(['/apply-job/'+ jobPositionDesc.id + '/0']);
  }

}

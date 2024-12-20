import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Transaction, User, Project } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-component',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent extends BaseComponent implements OnInit {

  public flag: any;
  transaction: Transaction = new Transaction();
  messages: any;
  error: string;
  @Output() saveEvent = new EventEmitter<any>();

  formData: FormData;
  files: any[];
  picture: any;

  currentUserOption: string;
  userOptions: User[];
  filteredUserOptions: User[];

  currentProjectOption: string;
  projectOptions: Project[];
  filteredProjectOptions: Project[];

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);

  }

  ngOnInit() {
    this.getActiveUsers();
    this.getActiveProjects();
  }

  public getActiveUsers() {
    const parameters: string[] = [];
    parameters.push('e.status = |status|1|Integer');
    this.appService.getAllByCriteriaWithFiles('User', parameters).subscribe((data: User[]) => {
      this.userOptions = data;
      this.filteredUserOptions = data;
    });
  }

  public getActiveProjects() {
    const parameters: string[] = [];
    parameters.push('e.status = |status|1|Integer');
    this.appService.getAllByCriteriaWithFiles('Project', parameters).subscribe((data: Project[]) => {
      this.projectOptions = data;
      this.filteredProjectOptions = data;
    });
  }

  getTransaction(transactionId: number) {

    if (transactionId) {
      this.appService.getOneWithChildsAndFiles(transactionId, 'Transaction')
        .subscribe(result => {
          if (result.id > 0) {
            this.transaction = result;
            console.log(this.transaction);
            this.currentUserOption = this.transaction.user.name;
            this.currentProjectOption = this.transaction.project.projectDescs[0].title;

          } else {
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      this.transaction = new Transaction();
    }
  }

  save() {
    this.transaction.modifiedBy = +this.tokenStorage.getUserId();

    this.appService.save(this.transaction, 'Transaction')
      .subscribe(result => {
        this.processResult(result, this.transaction, null);
        this.transaction = { ...result };
        this.saveEvent.emit(this.transaction);
      });
  }


  filterUserOptions(val) {
    if (val) {
      const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
      this.filteredUserOptions = this.userOptions.filter(element => element.name.toLowerCase().startsWith(filterValue));
    } else {
      this.filteredUserOptions = this.userOptions;
    }
  }

  filterProjectOptions(val) {
    if (val) {
      const filterValue = typeof val === 'string' ? val.toLowerCase() : val.title.toLowerCase();
      this.filteredProjectOptions = this.projectOptions.filter(element =>
        element.projectDescs[0].title.toLowerCase().startsWith(filterValue));
    } else {
      this.filteredProjectOptions = this.projectOptions;
    }
  }

  clear() {
    this.transaction = new Transaction();
  }

}
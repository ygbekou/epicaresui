import { Component, OnInit, EventEmitter, Output, AfterViewInit, ViewChild, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Transaction, User, Project, ProjectDesc } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';

declare var Stripe: any;

@Component({
  selector: 'app-payment-component',
  templateUrl: './payment.component.html'
})
export class PaymentComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private myStepper: MatStepper;

  transaction: Transaction = new Transaction();
  result = {};
  @Output() saveEvent = new EventEmitter<any>();

  currentProjectOption: string;
  projectOptions: ProjectDesc[];
  filteredProjectOptions: ProjectDesc[];

  stripe;
  public errors: string = '';
  data: any;
  public messages: string = '';
  public transactionSuccess: boolean = false;

  @Input()
  projectId: number;

  @Input()
  eventId: number;

  action = 'processing';

  enableSpinner = false;


  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private titleService: Title,
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);

  }

  ngOnInit() {
    this.titleService.setTitle('Paiement sécurisé - MonApplication');
    console.log('I am here ...')
    console.log("Messages:", this.messages);
    console.log("Erreurs:", this.errors);

    this.activatedRoute.params.subscribe(params => {
      if (params.projectId !== 0) {
        this.projectId = params.projectId;
      }
    });
    this.getActiveProjects();
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.setStripeSecret();
    }, 500);
    

    this.transaction.currencyCode = 'USD';
  }

  setStripeSecret() {
    this.appService.getObject('/service/Payment/stripe-key').toPromise()
      .then(result => {
        this.stripe = Stripe(result.publishableKey);
      });
  }

  createPaymentIntent() {

    this.appService.saveWithUrl('/service/Payment/clientSecret', this.transaction).toPromise()
      .then(result => {
        return result;
      })
     /*  .then(data => {
        return this.setupElements(data);
      })
      .then(data => {
        this.data = data;
        document.querySelector('button').disabled = false;
        document.getElementById('submit').removeAttribute('disabled');

        const form = document.getElementById('payment-form');
        form.addEventListener('submit', this.handleCardSave.bind(this));
      });*/
  }

  setupElements(data) {
    // this.stripe = Stripe(data.publishableKey);

    /* ------- Set up Stripe Elements to use in checkout form ------- */
    const elements = this.stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    const card = elements.create('card', { style });
    const element = document.getElementById('card-element')
    card.mount('#card-element');

    data = {
      stripe: this.stripe,
      card,
      clientSecret: data.clientSecret
    };
    this.data = data;
        document.querySelector('button').disabled = false;
        document.getElementById('submit').removeAttribute('disabled');

        const form = document.getElementById('payment-form');
        form.addEventListener('submit', this.handleCardSave.bind(this));
  }

  handleCardSave(event) {
    this.enableSpinner = true;
    event.preventDefault();
    document.getElementById('submit').setAttribute('disabled', 'disabled');
    this.submitPayment(this.data.stripe, this.data.card, this.data.clientSecret, this.translate,
      this.result, this.myStepper, this.save, this.appService, this.transaction, this.tokenStorage.getUserId(), this.processResult);
  }

  submitPayment(stripe, card, clientSecret, translate, myResult, myStepper, saveFct, appService, transaction, userId, processResult) {
    this.errors = '';
    this.appService.saveWithUrl('/service/Payment/clientSecret', this.transaction).toPromise()
      .then(result => {
        return result;
      })
      /*  .then(data => {
        return this.setupElements(data);
      })*/
      .then (data => stripe
      .confirmCardPayment(data.clientSecret, {
        payment_method: {
          card
        }
      }))
      .then((result) => {
        if (result.error) {
          this.paymentCompleted = false;
          this.translate.get(['MESSAGE.CARD_PAYMENT_FAILED']).subscribe(res => {
            this.errors = res['MESSAGE.CARD_PAYMENT_FAILED'];
          });
          document.getElementById('submit').setAttribute('disabled', 'disabled');
      
          setTimeout(() => {
            this.enableSpinner = false;
          }, 2000);
        } else {
          this.paymentCompleted = true;
          this.translate.get(['MESSAGE.CARD_PAYMENT_SUCCEDED']).subscribe(res => {
            this.messages = res['MESSAGE.CARD_PAYMENT_SUCCEDED'];
          });
          saveFct(appService, transaction, userId, this.translate, this.result);
        }
        this.action = 'complete';
        this.myStepper.selected.completed = true;
        this.myStepper.next();
      });
      
  }

  public getActiveProjects() {
    const parameters: string[] = [];
    parameters.push('e.project.status = |status|5|Integer');
    this.appService.getAllByCriteriaWithFiles('ProjectDesc', parameters).subscribe((data: ProjectDesc[]) => {
      this.projectOptions = data;
      this.filteredProjectOptions = data;

      if (this.projectId) {
        for (const pd of this.projectOptions) {
          if (pd.project.id === Number(this.projectId)) {
            this.currentProjectOption = pd.title;
            this.transaction.project = pd.project;
          }
        }
      }

    });
  }

  save(appService, transaction, userId, translate, myResult) {

    if (userId) {
      transaction.user = new User();
      transaction.modifiedBy = +userId;
      transaction.user.id = +userId;
    }

    transaction.io = 0;
    transaction.project = null;

    appService.save(transaction, 'Transaction')
      .subscribe(result => {
        if (result.errors === null || result.errors.length === 0) {
          translate.get(['MESSAGE.CARD_PAYMENT_SUCCEDED']).subscribe(res => {
          // this.messages = res['MESSAGE.CARD_PAYMENT_SUCCEDED'];
          });

        } else {
         translate.get(['MESSAGE.CARD_PAYMENT_FAILED']).subscribe(res => {
          //  this.errors = res['MESSAGE.CARD_PAYMENT_FAILED'];
          });
        }

        setTimeout(() => {
          this.enableSpinner = false;
        }, 2000);

      });
  }


  filterProjectOptions(val) {
    if (val) {
      const filterValue = typeof val === 'string' ? val.toLowerCase() : val.title.toLowerCase();
      this.filteredProjectOptions = this.projectOptions.filter(element =>
        element.title.toLowerCase().startsWith(filterValue));
    } else {
      this.filteredProjectOptions = this.projectOptions;
    }
  }

  clear() {
    this.transaction = new Transaction();
    this.errors = '';
    this.messages = '';
  }

  goBack() {
    this.myStepper.previous();
  }

  goForward() {
    this.myStepper.selected.completed = true;
    this.myStepper.next();

    if (this.myStepper.selectedIndex === 0) {
    // this.createPaymentIntent();
    }
  }

  paymentCompleted = false;

  saveTransaction() {

    this.myStepper.next();
    this.transaction.modifiedBy = +this.tokenStorage.getUserId();
    this.transaction.user = new User();
    this.transaction.user.id = +this.tokenStorage.getUserId();


    this.appService.saveWithUrl('/service/Payment/saveTransaction', this.transaction)
      .subscribe(data => {
        if (data.errors === null || data.errors.length === 0) {
          this.translate.get(['MESSAGE.CARD_PAYMENT_SUCCEDED']).subscribe(res => {
            this.messages = res['MESSAGE.CARD_PAYMENT_SUCCEDED'];
            console.log("Messages:", this.messages);
          });
        } else {
          this.translate.get(['MESSAGE.CARD_PAYMENT_FAILED', 'MESSAGE.' + data.errors[0]]).subscribe(res => {
            this.errors = res['MESSAGE.' + data.errors[0]];
            console.log("Erreurs:", this.errors);
          });
        }
        this.action = 'complete';
        this.myStepper.selected.completed = true;
        this.myStepper.next();
      });

  }

  onPaymentMethodChange(method: string) {
    this.messages = '';
    this.errors = '';
    this.paymentCompleted = false;
    if (method === 'TMONEY') {
      this.translate.get('MESSAGE.TMONEY').subscribe(res => {
        this.transaction.phone = res; // Message pour TMONEY
      });
    } else if (method === 'FLOOZ') {
      this.translate.get('MESSAGE.FLOOZ').subscribe(res => {
        this.transaction.phone = res; // Message pour FLOOZ
      });
    } else {
      this.transaction.phone = '';
      this.setupElements({});
    }
  }

}



import { Component, OnInit, EventEmitter, Output, AfterViewInit, ViewChild, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Transaction, User, Project, ProjectDesc } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';

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
  errors: string;
  data: any;

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
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);

  }

  ngOnInit() {
    console.log('I am here ...')
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
      .then(data => {
        return this.setupElements(data);
      })
      .then(data => {
        this.data = data;
        document.querySelector('button').disabled = false;
        document.getElementById('submit').removeAttribute('disabled');

        const form = document.getElementById('payment-form');
        form.addEventListener('submit', this.handleCardSave.bind(this));
      });
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

    return {
      stripe: this.stripe,
      card,
      clientSecret: data.clientSecret
    };
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
    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card
        }
      })
      .then(function (result) {
        if (result.error) {
          // Show error to your customer
          // showError(result.error.message);
          translate.get(['MESSAGE.CARD_PAYMENT_FAILED']).subscribe(res => {
            myResult.messages = res['MESSAGE.CARD_PAYMENT_FAILED'];
          });
          document.getElementById('submit').setAttribute('disabled', 'disabled');

          setTimeout(() => {
            this.enableSpinner = false;
          }, 2000);
        } else {
          // The payment succeeded!
          // orderComplete(result.paymentIntent.id);
          translate.get(['MESSAGE.CARD_PAYMENT_SUCCEDED']).subscribe(res => {
            myResult.messages = res['MESSAGE.CARD_PAYMENT_SUCCEDED'];
          });
          saveFct(appService, transaction, userId, translate, myResult);
        }
        myStepper.selected.completed = true;
        myStepper.next();
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

    myResult.errors = undefined;
    myResult.messages = undefined;

    if (userId) {
      transaction.user = new User();
      transaction.modifiedBy = +userId;
      transaction.user.id = +userId;
    }

    transaction.io = 0;

    appService.save(transaction, 'Transaction')
      .subscribe(result => {
        if (result.errors === null || result.errors.length === 0) {
          translate.get(['MESSAGE.CARD_PAYMENT_SUCCEDED']).subscribe(res => {
            myResult.messages = res['MESSAGE.CARD_PAYMENT_SUCCEDED'];
          });

        } else {
          translate.get(['MESSAGE.CARD_PAYMENT_FAILED']).subscribe(res => {
            myResult.messages = res['MESSAGE.CARD_PAYMENT_FAILED'];
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
  }

  goBack() {
    this.myStepper.previous();
  }

  goForward() {
    this.myStepper.selected.completed = true;
    this.myStepper.next();

    if (this.myStepper.selectedIndex === 2) {
      this.createPaymentIntent();
    }
  }

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
          });
        } else {
          this.translate.get(['MESSAGE.CARD_PAYMENT_FAILED', 'MESSAGE.' + data.errors[0]]).subscribe(res => {
            this.errors = res['MESSAGE.' + data.errors[0]];
          });
        }
        this.action = 'complete';
        this.myStepper.selected.completed = true;
        this.myStepper.next();
      });
  }

}
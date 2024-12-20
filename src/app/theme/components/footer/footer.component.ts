import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from '../../utils/app-validators';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { ContactUsMessage, MailingList } from 'src/app/app.models';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends BaseComponent implements OnInit {
    public lat = 45.4765;
    public lng = -75.7013;
    public zoom = 12;
    public mapStyles: any = [
        {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    saturation: 36
                },
                {
                    color: '#000000'
                },
                {
                    lightness: 40
                }
            ]
        },
        {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [
                {
                    visibility: 'on'
                },
                {
                    color: '#000000'
                },
                {
                    lightness: 16
                }
            ]
        },
        {
            featureType: 'all',
            elementType: 'labels.icon',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'administrative',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#000000'
                },
                {
                    lightness: 20
                }
            ]
        },
        {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#000000'
                },
                {
                    lightness: 17
                },
                {
                    weight: 1.2
                }
            ]
        },
        {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#8b9198'
                }
            ]
        },
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#000000'
                },
                {
                    lightness: 20
                }
            ]
        },
        {
            featureType: 'landscape',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#323336'
                }
            ]
        },
        {
            featureType: 'landscape.man_made',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#414954'
                }
            ]
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#000000'
                },
                {
                    lightness: 21
                }
            ]
        },
        {
            featureType: 'poi',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#2e2f31'
                }
            ]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#7a7c80'
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#242427'
                },
                {
                    lightness: 17
                }
            ]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#202022'
                },
                {
                    lightness: 29
                },
                {
                    weight: 0.2
                }
            ]
        },
        {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#000000'
                },
                {
                    lightness: 18
                }
            ]
        },
        {
            featureType: 'road.arterial',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#393a3f'
                }
            ]
        },
        {
            featureType: 'road.arterial',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#202022'
                }
            ]
        },
        {
            featureType: 'road.local',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#000000'
                },
                {
                    lightness: 16
                }
            ]
        },
        {
            featureType: 'road.local',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#393a3f'
                }
            ]
        },
        {
            featureType: 'road.local',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#202022'
                }
            ]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#000000'
                },
                {
                    lightness: 19
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
                {
                    color: '#000000'
                },
                {
                    lightness: 17
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#202124'
                }
            ]
        }
    ];
    public feedbackForm: FormGroup;
    public subscribeForm: FormGroup;
    constructor(public formBuilder: FormBuilder, translate: TranslateService,
        protected tokenStorage: TokenStorage,
        public appService: AppService) { super(translate, tokenStorage); }

    ngOnInit() {
        this.feedbackForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, emailValidator])],
            name: ['', Validators.required],
            message: ['', Validators.required]
        });
        this.subscribeForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, emailValidator])]
        })
    }

    public onSubscribeFormSubmit(values: any): void {
        this.messages = '';
        if (this.subscribeForm.valid) {
            const cmessage = new MailingList();
            cmessage.email = values.email;
            cmessage.modifiedBy = +this.tokenStorage.getUserId();
            const parameters: string[] = [];
            parameters.push('e.email = |email|' + values.email + '|String');
            this.appService.getAllByCriteria('com.wack.model.website.MailingList', parameters).subscribe((data1: MailingList[]) => {
                if (data1 && data1.length > 0) {
                    this.translate.get(['COMMON.SAVE', 'MESSAGE.ALREADY_SUSCRIBED']).subscribe(res => {
                        this.messages = res['MESSAGE.ALREADY_SUSCRIBED'];
                    });
                } else {
                    this.appService.save(cmessage, 'MailingList')
                        .subscribe(data => {
                            this.processResult(data, cmessage, null);
                            if (data.errors === null || data.errors.length === 0) {
                                this.feedbackForm.reset();
                            }
                        });
                }
            });

        }
    }

    public onFeedbackFormSubmit(values: any): void {
        this.messages = '';
        if (this.feedbackForm.valid) {
            const cmessage = new ContactUsMessage();
            cmessage.name = values.name;
            cmessage.email = values.email;
            cmessage.message = values.message;
            cmessage.modifiedBy = +this.tokenStorage.getUserId();
            cmessage.lang = this.getLang();
            this.appService.saveWithUrl('/service/ContactUsMessage/save', cmessage)
                .subscribe(data => {
                    this.processResult(data, cmessage, null);
                    if (data.errors === null || data.errors.length === 0) {
                        this.feedbackForm.reset();
                    }
                });
        }
    }

}

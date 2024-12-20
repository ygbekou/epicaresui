import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InputFileModule } from 'ngx-input-file';
import { AgmCoreModule } from '@agm/core';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyPropertiesComponent } from './my-properties/my-properties.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileComponent } from './profile/profile.component';
import { QuillModule } from 'ngx-quill'
import { ConfigsComponent } from './configs/configs.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NewsComponent } from './news/news.component';
import { NewsListComponent } from './news-list/news-list.component';
import { SectionsComponent } from './sections/sections.component';
import { SectionItemsComponent } from './section-items/section-items.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user/user.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqiComponent } from './faq/faqi.component';
import { CmessageListComponent } from './cmessage-list/cmessage-list.component';
import { CmessageComponent } from './cmessage/cmessage.component';
import { ProjectListComponent } from './projects-list/project-list.component';
import { ProjectComponent } from './projects/project.component';
import { EmailComponent } from './email/email.component';
import { StatusTextComponent } from './statusText/statusText.component';
import { AdminComponent } from './admin/admin.component';
import { RegulationComponent } from './regulation/regulation.component';
import { PositionsComponent } from './positions/Positions.component';
import { MeetingReportsComponent } from './meetingReport/MeetingReports.component';
import { PublicitiesComponent } from './publicity/Publicities.component';
import { VideosComponent } from './video/Videos.component';
import { ImagesComponent } from './image/Images.component';
import { PollTypesComponent } from './pollType/PollTypes.component';
import { PollsComponent } from './poll/Polls.component';
import { PollQuestionsComponent } from './poll/PollQuestions.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionComponent } from './transaction/transaction.component';
import { OnlinePaymentComponent } from './transaction/online-payment.component';
import { SlidersComponent } from './sliders/sliders.component';
import { SliderItemsComponent } from './slider-items/slider-items.component';
import { JobPositionListComponent } from './job-position-list/job-position-list.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { JobAppliComponent } from './job-appli/job-appli.component';
import { JobAppliListComponent } from './job-appli-list/job-appli-list.component';
import { SettingsComponent } from './settings/Settings.component';
import { EventComponent } from './event/event.component';
import { EventListComponent } from './event-list/event-list.component';

export const routes = [
  {
    path: '',
    component: AccountComponent, children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      { path: 'my-articles', component: MyPropertiesComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'user/:id', component: UserComponent },
      { path: 'news-list', component: NewsListComponent },
      { path: 'project-list', component: ProjectListComponent },
      { path: 'job-appli/:id', component: JobAppliComponent },
      { path: 'job-appli-list/:jobPositionId', component: JobAppliListComponent },
      { path: 'job-position/:id', component: JobPositionComponent },
      { path: 'job-position-list', component: JobPositionListComponent },
      { path: 'event/:id', component: EventComponent },
      { path: 'event-list', component: EventListComponent },
      { path: 'meeting-report-list', component: MeetingReportsComponent },
      { path: 'configs', component: ConfigsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'news/:id', component: NewsComponent },
      { path: 'project/:id', component: ProjectComponent },
      { path: 'sections', component: SectionsComponent },
      { path: 'sections/:id', component: SectionItemsComponent },
      { path: 'sliders', component: SlidersComponent },
      { path: 'sliders/:id', component: SliderItemsComponent },
      { path: 'faqs', component: FaqListComponent },
      { path: 'faq/:id', component: FaqiComponent },
      { path: 'cmessages', component: CmessageListComponent },
      { path: 'cmessage/:id', component: CmessageComponent },
      { path: 'email', component: EmailComponent },
      { path: 'regulation', component: RegulationComponent },
      { path: 'statusText', component: StatusTextComponent },
      { path: 'publicity-list', component: PublicitiesComponent },
      { path: 'video-list', component: VideosComponent },
      { path: 'image-list', component: ImagesComponent },
      { path: 'poll-list', component: PollsComponent },
      { path: 'transaction-list', component: TransactionListComponent },
      { path: 'online-payment', component: OnlinePaymentComponent },
      { path: 'admin', component: AdminComponent }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    AccountComponent,
    MyPropertiesComponent,
    FavoritesComponent,
    ProfileComponent,
    ConfigsComponent,
    NewsComponent,
    ProjectComponent,
    SectionsComponent,
    SectionItemsComponent,
    SlidersComponent,
    SliderItemsComponent,
    NewsListComponent,
    ProjectListComponent,
    UserListComponent,
    UserComponent,
    FaqListComponent,
    FaqiComponent,
    CmessageListComponent,
    CmessageComponent,
    EmailComponent,
    RegulationComponent,
    StatusTextComponent,
    AdminComponent,
    PositionsComponent,
    MeetingReportsComponent,
    PublicitiesComponent,
    VideosComponent,
    ImagesComponent,
    PollTypesComponent,
    PollsComponent,
    PollQuestionsComponent,
    TransactionListComponent,
    TransactionComponent,
    OnlinePaymentComponent,
    JobPositionListComponent,
    JobPositionComponent,
    JobAppliComponent,
    JobAppliListComponent,
    SettingsComponent,
    EventComponent,
    EventListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InputFileModule,
    AgmCoreModule,
    FormsModule,
    TranslateModule,
    QuillModule.forRoot({
      theme: 'snow',
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],               // custom button values
          [{ list: 'ordered'}, { list: 'bullet' }],
          [{ script: 'sub'}, { script: 'super' }],      // superscript/subscript
          [{ indent: '-1'}, { indent: '+1' }],          // outdent/indent
          [{ direction: 'rtl' }],                       // text direction
          [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ['clean'],                                         // remove formatting button
          ['link', 'image', 'video']                         // link and image, newsVideo
        ]
      }
    })
  ],
  exports:[
    JobAppliComponent
  ]
})
export class AccountModule { }

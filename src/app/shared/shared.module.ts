import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: false,
  suppressScrollX: true
};

import { PipesModule } from '../theme/pipes/pipes.module';
import { DirectivesModule } from '../theme/directives/directives.module';


import { HeaderImageComponent } from './header-image/header-image.component';
import { HeaderVideoComponent } from './header-video/header-video.component';
import { HeaderCarouselComponent } from './header-carousel/header-carousel.component';
import { LoadMoreComponent } from './load-more/load-more.component';
import { BlogsSearchComponent } from './blogs-search/blogs-search.component';
import { CompareOverviewComponent } from './compare-overview/compare-overview.component';
import { RatingComponent } from './rating/rating.component';
import { ClientsComponent } from './clients/clients.component';
import { GetInTouchComponent } from './get-in-touch/get-in-touch.component';
import { CommentsComponent } from './comments/comments.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { OurAgentsComponent } from './our-agents/our-agents.component';
import { MissionComponent } from './mission/mission.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { LogoComponent } from './logo/logo.component';
import { BlogCarouselComponent } from './blog-carousel/blog-carousel.component';
import { BlogItemSmallComponent } from './blog-item-small/blog-item-small.component';
import { TranslateModule } from '@ngx-translate/core';
import { BlogsToolbarComponent } from './blogs-toolbar/blogs-toolbar.component';
import { BlogsSearchResultsFiltersComponent } from './blogs-search-results-filters/blogs-search-results-filters.component';
import { BlogItemComponent } from './blog-item/blog-item.component';
import { OurExpertiseComponent } from './our-expertise/our-expertise.component';
import { FeaturedBlogCarouselComponent } from './featured-blog-carousel/featured-blog-carousel.component';
import { HeaderImageSmallComponent } from './header-image-small/header-image-small.component';
import { OurTeamComponent } from './our-team/our-team.component';
import { OurPartnersComponent } from './our-partners/our-partners.component';
import { BaseComponent } from './baseComponent';
import { ProjectItemComponent } from './project-item/project-item.component';
import { GenericChartComponent } from './Charts/GenericChart/GenericChart.component';
import { ChartsModule } from 'ng2-charts';
import { OurLeadershipComponent } from './our-leadership/our-leadership.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SwiperModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    ChartsModule,
    PerfectScrollbarModule,
    PipesModule,
    DirectivesModule,
    TranslateModule
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    SwiperModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    PerfectScrollbarModule,
    PipesModule,
    DirectivesModule,
    LogoComponent,
    HeaderImageComponent,
    HeaderVideoComponent,
    HeaderCarouselComponent,
    LoadMoreComponent,
    BlogsSearchComponent,
    CompareOverviewComponent,
    RatingComponent,
    BlogCarouselComponent,
    ClientsComponent,
    GetInTouchComponent,
    CommentsComponent,
    TestimonialsComponent,
    OurAgentsComponent,
    MissionComponent,
    OurServicesComponent,
    BlogItemSmallComponent,
    BlogsSearchResultsFiltersComponent,
    BlogsToolbarComponent,
    BlogItemComponent,
    ProjectItemComponent,
    BlogCarouselComponent,
    OurExpertiseComponent,
    FeaturedBlogCarouselComponent,
    HeaderImageSmallComponent,
    OurTeamComponent,
    OurLeadershipComponent,
    OurPartnersComponent,
    BaseComponent,
    GenericChartComponent
  ],
  declarations: [
    LogoComponent,
    HeaderImageComponent,
    HeaderVideoComponent,
    HeaderCarouselComponent,
    LoadMoreComponent,
    BlogsSearchComponent,
    CompareOverviewComponent,
    RatingComponent,
    BlogCarouselComponent,
    ClientsComponent,
    GetInTouchComponent,
    CommentsComponent,
    TestimonialsComponent,
    OurAgentsComponent,
    MissionComponent,
    OurServicesComponent,
    BlogItemSmallComponent,
    BlogsSearchResultsFiltersComponent,
    BlogsToolbarComponent,
    BlogItemComponent,
    ProjectItemComponent,
    BlogCarouselComponent,
    OurExpertiseComponent,
    FeaturedBlogCarouselComponent,
    HeaderImageSmallComponent,
    OurTeamComponent,
    OurPartnersComponent,
    OurLeadershipComponent,
    BaseComponent,
    GenericChartComponent
  ],
  entryComponents: [
    CompareOverviewComponent
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ]
})
export class SharedModule { }

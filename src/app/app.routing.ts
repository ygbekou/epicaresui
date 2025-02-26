import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LockScreenComponent } from './pages/lock-screen/lock-screen.component';

export const routes: Routes = [
    {
        path: '',
        component: PagesComponent, children: [
            // { path: '', redirectTo: '/landing', pathMatch: 'full' },
            { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
            { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule) },
            { path: 'section/:name', loadChildren: () => import('./pages/section/section.module').then(m => m.SectionModule) },
            { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule) },
            { path: 'blogs', loadChildren: () => import('./pages/blogs/blogs.module').then(m => m.BlogsModule) },
            { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule) },
            { path: 'gals', loadChildren: () => import('./pages/galery/galery.module').then(m => m.GaleryModule) },


            {
                path: 'project-assoc/:id', loadChildren: () => import('./pages/assoProject/project-assoc.module')
                    .then(m => m.ProjectAssocModule)
            },
            { path: 'careers', loadChildren: () => import('./pages/career/career.module').then(m => m.CareerModule) },
            { path: 'agents', loadChildren: () => import('./pages/agents/agents.module').then(m => m.AgentsModule) },
            { path: 'votes/:id', loadChildren: () => import('./pages/votes/votes.module').then(m => m.VotesModule) },
            { path: 'compare', loadChildren: () => import('./pages/compare/compare.module').then(m => m.CompareModule) },
            { path: 'pricing', loadChildren: () => import('./pages/pricing/pricing.module').then(m => m.PricingModule) },
            { path: 'faq', loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqModule) },
            { path: 'login/:action', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
            { path: 'register/:action', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
            {
                path: 'submit-project/:id', loadChildren: () => import('./pages/submit-project/submit-project.module')
                    .then(m => m.SubmitProjectModule)
            },
            {
                path: 'apply-job/:jobPositionDescId/:id', loadChildren: () => import('./pages/job-appli-resume/job-appli-resume.module')
                    .then(m => m.JobAppliResumeModule)
            },
            {
                path: 'terms-conditions', loadChildren: () => import('./pages/terms-conditions/terms-conditions.module')
                    .then(m => m.TermsConditionsModule)
            },
            { path: 'account', loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule) },
            { path: 'polls', loadChildren: () => import('./pages/polls/poll-items.module').then(m => m.PollItemsModule) },
            {
                path: 'poll-details/:id', loadChildren: () => import('./pages/polls/poll-details/poll-details.module')
                    .then(m => m.PollDetailsModule)
            },
            {
                path: 'poll-question-details/:operation/:id', loadChildren: () => import('./pages/polls/poll-question-details/poll-question-details.module')
                    .then(m => m.PollQuestionDetailsModule)
            },
            { path: 'events', loadChildren: () => import('./pages/events/event-items.module').then(m => m.EventItemsModule) },
            {
                path: 'event-details/:id', loadChildren: () => import('./pages/events/event-details/event-details.module')
                    .then(m => m.EventDetailsModule)
            },
            {
                path: 'payment/:projectId/:eventId', loadChildren: () => import('./pages/payment/payment.module')
                    .then(m => m.PaymentModule)
            },
            { path: 'leadership', loadChildren: () => import('./pages/leadership/leadership.module').then(m => m.LeadershipModule) },
        ]
    },
    { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule) },
    { path: 'lock-screen', component: LockScreenComponent },
    { path: '**', component: NotFoundComponent }
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
    useHash: true
});
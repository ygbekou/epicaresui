/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { GalleryModule } from '@ngx-gallery/core';
import { Lightbox } from './lightbox.service';
import { LightboxComponent } from './lightbox.component';
import { LightboxDirective } from './lightbox.directive';
import { LIGHTBOX_CONFIG } from './lightbox.model';
export class LightboxModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static withConfig(config) {
        return {
            ngModule: LightboxModule,
            providers: [
                {
                    provide: LIGHTBOX_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
LightboxModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    OverlayModule,
                    GalleryModule,
                    A11yModule
                ],
                declarations: [
                    LightboxComponent,
                    LightboxDirective
                ],
                exports: [
                    LightboxDirective
                ],
                providers: [
                    Lightbox
                ],
                entryComponents: [
                    LightboxComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3gubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1nYWxsZXJ5L2xpZ2h0Ym94LyIsInNvdXJjZXMiOlsibGliL2xpZ2h0Ym94Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBa0IsZUFBZSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFzQm5FLE1BQU0sT0FBTyxjQUFjOzs7OztJQUN6QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQXNCO1FBQ3RDLE9BQU87WUFDTCxRQUFRLEVBQUUsY0FBYztZQUN4QixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFFBQVEsRUFBRSxNQUFNO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7OztZQS9CRixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLGFBQWE7b0JBQ2IsYUFBYTtvQkFDYixVQUFVO2lCQUNYO2dCQUNELFlBQVksRUFBRTtvQkFDWixpQkFBaUI7b0JBQ2pCLGlCQUFpQjtpQkFDbEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGlCQUFpQjtpQkFDbEI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULFFBQVE7aUJBQ1Q7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLGlCQUFpQjtpQkFDbEI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQTExeU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IEdhbGxlcnlNb2R1bGUgfSBmcm9tICdAbmd4LWdhbGxlcnkvY29yZSc7XG5cbmltcG9ydCB7IExpZ2h0Ym94IH0gZnJvbSAnLi9saWdodGJveC5zZXJ2aWNlJztcbmltcG9ydCB7IExpZ2h0Ym94Q29tcG9uZW50IH0gZnJvbSAnLi9saWdodGJveC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTGlnaHRib3hEaXJlY3RpdmUgfSBmcm9tICcuL2xpZ2h0Ym94LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBMaWdodGJveENvbmZpZywgTElHSFRCT1hfQ09ORklHIH0gZnJvbSAnLi9saWdodGJveC5tb2RlbCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBPdmVybGF5TW9kdWxlLFxuICAgIEdhbGxlcnlNb2R1bGUsXG4gICAgQTExeU1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBMaWdodGJveENvbXBvbmVudCxcbiAgICBMaWdodGJveERpcmVjdGl2ZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTGlnaHRib3hEaXJlY3RpdmVcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTGlnaHRib3hcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgTGlnaHRib3hDb21wb25lbnRcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBMaWdodGJveE1vZHVsZSB7XG4gIHN0YXRpYyB3aXRoQ29uZmlnKGNvbmZpZzogTGlnaHRib3hDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IExpZ2h0Ym94TW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBMSUdIVEJPWF9DT05GSUcsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19
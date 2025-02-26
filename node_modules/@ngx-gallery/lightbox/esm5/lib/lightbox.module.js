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
var LightboxModule = /** @class */ (function () {
    function LightboxModule() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    LightboxModule.withConfig = /**
     * @param {?} config
     * @return {?}
     */
    function (config) {
        return {
            ngModule: LightboxModule,
            providers: [
                {
                    provide: LIGHTBOX_CONFIG,
                    useValue: config
                }
            ]
        };
    };
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
    return LightboxModule;
}());
export { LightboxModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3gubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1nYWxsZXJ5L2xpZ2h0Ym94LyIsInNvdXJjZXMiOlsibGliL2xpZ2h0Ym94Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBa0IsZUFBZSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFbkU7SUFBQTtJQWdDQSxDQUFDOzs7OztJQVhRLHlCQUFVOzs7O0lBQWpCLFVBQWtCLE1BQXNCO1FBQ3RDLE9BQU87WUFDTCxRQUFRLEVBQUUsY0FBYztZQUN4QixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFFBQVEsRUFBRSxNQUFNO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7O2dCQS9CRixRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLGFBQWE7d0JBQ2IsYUFBYTt3QkFDYixVQUFVO3FCQUNYO29CQUNELFlBQVksRUFBRTt3QkFDWixpQkFBaUI7d0JBQ2pCLGlCQUFpQjtxQkFDbEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGlCQUFpQjtxQkFDbEI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULFFBQVE7cUJBQ1Q7b0JBQ0QsZUFBZSxFQUFFO3dCQUNmLGlCQUFpQjtxQkFDbEI7aUJBQ0Y7O0lBYUQscUJBQUM7Q0FBQSxBQWhDRCxJQWdDQztTQVpZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT3ZlcmxheU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IEExMXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBHYWxsZXJ5TW9kdWxlIH0gZnJvbSAnQG5neC1nYWxsZXJ5L2NvcmUnO1xuXG5pbXBvcnQgeyBMaWdodGJveCB9IGZyb20gJy4vbGlnaHRib3guc2VydmljZSc7XG5pbXBvcnQgeyBMaWdodGJveENvbXBvbmVudCB9IGZyb20gJy4vbGlnaHRib3guY29tcG9uZW50JztcbmltcG9ydCB7IExpZ2h0Ym94RGlyZWN0aXZlIH0gZnJvbSAnLi9saWdodGJveC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTGlnaHRib3hDb25maWcsIExJR0hUQk9YX0NPTkZJRyB9IGZyb20gJy4vbGlnaHRib3gubW9kZWwnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBHYWxsZXJ5TW9kdWxlLFxuICAgIEExMXlNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTGlnaHRib3hDb21wb25lbnQsXG4gICAgTGlnaHRib3hEaXJlY3RpdmVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIExpZ2h0Ym94RGlyZWN0aXZlXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIExpZ2h0Ym94XG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW1xuICAgIExpZ2h0Ym94Q29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTGlnaHRib3hNb2R1bGUge1xuICBzdGF0aWMgd2l0aENvbmZpZyhjb25maWc6IExpZ2h0Ym94Q29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBMaWdodGJveE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogTElHSFRCT1hfQ09ORklHLFxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWdcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbn1cbiJdfQ==
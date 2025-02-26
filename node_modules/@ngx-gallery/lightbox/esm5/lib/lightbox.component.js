/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Optional, ChangeDetectionStrategy, ElementRef, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { lightboxAnimation } from './lightbox.animation';
var LightboxComponent = /** @class */ (function () {
    function LightboxComponent(_document, _focusTrapFactory, _elementRef, sanitizer) {
        this._document = _document;
        this._focusTrapFactory = _focusTrapFactory;
        this._elementRef = _elementRef;
        this.sanitizer = sanitizer;
        /**
         * State of the lightbox animation.
         */
        this.state = 'enter';
        this._savePreviouslyFocusedElement();
    }
    /** Callback, invoked whenever an animation on the host completes. */
    /**
     * Callback, invoked whenever an animation on the host completes.
     * @param {?} event
     * @return {?}
     */
    LightboxComponent.prototype.onAnimationDone = /**
     * Callback, invoked whenever an animation on the host completes.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.toState === 'enter') {
            this._trapFocus();
        }
        else {
            this.overlayRef.dispose();
            this._restoreFocus();
        }
    };
    /** Moves the focus inside the focus trap. */
    /**
     * Moves the focus inside the focus trap.
     * @private
     * @return {?}
     */
    LightboxComponent.prototype._trapFocus = /**
     * Moves the focus inside the focus trap.
     * @private
     * @return {?}
     */
    function () {
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        }
        // If were to attempt to focus immediately, then the content of the lightbox would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty.
        this._focusTrap.focusInitialElementWhenReady();
    };
    /** Saves a reference to the element that was focused before the lightbox was opened. */
    /**
     * Saves a reference to the element that was focused before the lightbox was opened.
     * @private
     * @return {?}
     */
    LightboxComponent.prototype._savePreviouslyFocusedElement = /**
     * Saves a reference to the element that was focused before the lightbox was opened.
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = (/** @type {?} */ (this._document.activeElement));
            // Note that there is no focus method when rendering on the server.
            if (this._elementRef.nativeElement.focus) {
                // Move focus onto the lightbox immediately in order to prevent the user from accidentally
                // opening multiple dialogs at the same time. Needs to be async, because the element
                // may not be focusable immediately.
                Promise.resolve().then(function () { return _this._elementRef.nativeElement.focus(); });
            }
        }
    };
    /** Restores focus to the element that was focused before the lightbox opened. */
    /**
     * Restores focus to the element that was focused before the lightbox opened.
     * @private
     * @return {?}
     */
    LightboxComponent.prototype._restoreFocus = /**
     * Restores focus to the element that was focused before the lightbox opened.
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var toFocus = this._elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    };
    LightboxComponent.decorators = [
        { type: Component, args: [{
                    selector: 'lightbox',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    animations: [lightboxAnimation],
                    template: "\n    <gallery [id]=\"id\" [destroyRef]=\"false\" [skipInitConfig]=\"true\">\n      <i class=\"g-btn-close\" aria-label=\"Close\" (click)=\"overlayRef.detach()\"\n         [innerHTML]=\"sanitizer.bypassSecurityTrustHtml(closeIcon)\"></i>\n    </gallery>\n  ",
                    host: {
                        'tabindex': '-1',
                        'aria-modal': 'true',
                        '[attr.id]': '"lightbox-" + id',
                        '[attr.role]': 'role',
                        '[attr.aria-labelledby]': 'ariaLabel ? null : ariaLabelledBy',
                        '[attr.aria-label]': 'ariaLabel',
                        '[attr.aria-describedby]': 'ariaDescribedBy || null',
                        '[@lightbox]': 'state',
                        '(@lightbox.done)': 'onAnimationDone($event)',
                    },
                    styles: ["::ng-deep lightbox{position:relative;display:block;width:1100px;height:800px;max-width:94vw;max-height:90vh;border-radius:4px;overflow:hidden;box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12)}::ng-deep lightbox:focus{outline:0}::ng-deep lightbox gallery{overflow:hidden;margin:0;display:block;width:100%;height:100%}::ng-deep .g-backdrop{background-color:rgba(0,0,0,.32)}::ng-deep .fullscreen{width:100%}::ng-deep .fullscreen ::ng-deep lightbox{max-width:unset;max-height:unset;position:fixed;top:0;left:0;bottom:0;right:0;height:100%;width:100%;border-radius:0}::ng-deep .g-overlay{margin:auto}@media only screen and (max-width:480px){::ng-deep .g-overlay{width:100%}::ng-deep .g-overlay ::ng-deep lightbox{max-width:unset;max-height:unset;position:fixed;top:0;left:0;bottom:0;right:0;height:100%;width:100%;border-radius:0}}::ng-deep .g-btn-close{position:absolute;right:.9em;top:.9em;z-index:60;cursor:pointer;width:20px;height:20px}@media only screen and (max-width:480px){::ng-deep .g-btn-close{right:.7em;top:.7em}}"]
                }] }
    ];
    /** @nocollapse */
    LightboxComponent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
        { type: FocusTrapFactory },
        { type: ElementRef },
        { type: DomSanitizer }
    ]; };
    return LightboxComponent;
}());
export { LightboxComponent };
if (false) {
    /**
     * Gallery ref id
     * @type {?}
     */
    LightboxComponent.prototype.id;
    /**
     * Overlay ref to close the lightbox
     * @type {?}
     */
    LightboxComponent.prototype.overlayRef;
    /**
     * Close button svg data
     * @type {?}
     */
    LightboxComponent.prototype.closeIcon;
    /**
     * State of the lightbox animation.
     * @type {?}
     */
    LightboxComponent.prototype.state;
    /**
     * The ARIA role of the lightbox element.
     * @type {?}
     */
    LightboxComponent.prototype.role;
    /**
     * Aria label to assign to the lightbox element
     * @type {?}
     */
    LightboxComponent.prototype.ariaLabel;
    /**
     * ID of the element that should be considered as the lightbox's label.
     * @type {?}
     */
    LightboxComponent.prototype.ariaLabelledBy;
    /**
     * ID of the element that describes the lightbox.
     * @type {?}
     */
    LightboxComponent.prototype.ariaDescribedBy;
    /**
     * The class that traps and manages focus within the lightbox.
     * @type {?}
     * @private
     */
    LightboxComponent.prototype._focusTrap;
    /**
     * Element that was focused before the lightbox was opened. Save this to restore upon close.
     * @type {?}
     * @private
     */
    LightboxComponent.prototype._elementFocusedBeforeDialogWasOpened;
    /**
     * @type {?}
     * @private
     */
    LightboxComponent.prototype._document;
    /**
     * @type {?}
     * @private
     */
    LightboxComponent.prototype._focusTrapFactory;
    /**
     * @type {?}
     * @private
     */
    LightboxComponent.prototype._elementRef;
    /** @type {?} */
    LightboxComponent.prototype.sanitizer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1nYWxsZXJ5L2xpZ2h0Ym94LyIsInNvdXJjZXMiOlsibGliL2xpZ2h0Ym94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsdUJBQXVCLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRzNDLE9BQU8sRUFBYSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXpEO0lBdURFLDJCQUFrRCxTQUFjLEVBQzVDLGlCQUFtQyxFQUNuQyxXQUF1QixFQUN4QixTQUF1QjtRQUhRLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDNUMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN4QixjQUFTLEdBQVQsU0FBUyxDQUFjOzs7O1FBdkIxQyxVQUFLLEdBQThCLE9BQU8sQ0FBQztRQXdCekMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELHFFQUFxRTs7Ozs7O0lBQ3JFLDJDQUFlOzs7OztJQUFmLFVBQWdCLEtBQXFCO1FBQ25DLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25CO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRCw2Q0FBNkM7Ozs7OztJQUNyQyxzQ0FBVTs7Ozs7SUFBbEI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNqRjtRQUNELDZGQUE2RjtRQUM3RiwyRkFBMkY7UUFDM0YsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsd0ZBQXdGOzs7Ozs7SUFDaEYseURBQTZCOzs7OztJQUFyQztRQUFBLGlCQVlDO1FBWEMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxvQ0FBb0MsR0FBRyxtQkFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBZSxDQUFDO1lBRXhGLG1FQUFtRTtZQUNuRSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRTtnQkFDeEMsMEZBQTBGO2dCQUMxRixvRkFBb0Y7Z0JBQ3BGLG9DQUFvQztnQkFDcEMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQXRDLENBQXNDLENBQUMsQ0FBQzthQUN0RTtTQUNGO0lBQ0gsQ0FBQztJQUVELGlGQUFpRjs7Ozs7O0lBQ3pFLHlDQUFhOzs7OztJQUFyQjs7WUFDUSxPQUFPLEdBQUcsSUFBSSxDQUFDLG9DQUFvQztRQUV6RCx5RkFBeUY7UUFDekYsSUFBSSxPQUFPLElBQUksT0FBTyxPQUFPLENBQUMsS0FBSyxLQUFLLFVBQVUsRUFBRTtZQUNsRCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDakI7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7O2dCQTlHRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztvQkFFL0IsUUFBUSxFQUFFLG1RQUtUO29CQUNELElBQUksRUFBRTt3QkFDSixVQUFVLEVBQUUsSUFBSTt3QkFDaEIsWUFBWSxFQUFFLE1BQU07d0JBQ3BCLFdBQVcsRUFBRSxrQkFBa0I7d0JBQy9CLGFBQWEsRUFBRSxNQUFNO3dCQUNyQix3QkFBd0IsRUFBRSxtQ0FBbUM7d0JBQzdELG1CQUFtQixFQUFFLFdBQVc7d0JBQ2hDLHlCQUF5QixFQUFFLHlCQUF5Qjt3QkFDcEQsYUFBYSxFQUFFLE9BQU87d0JBQ3RCLGtCQUFrQixFQUFFLHlCQUF5QjtxQkFDOUM7O2lCQUNGOzs7O2dEQWlDYyxRQUFRLFlBQUksTUFBTSxTQUFDLFFBQVE7Z0JBMUR0QixnQkFBZ0I7Z0JBTG1CLFVBQVU7Z0JBQ3hELFlBQVk7O0lBc0hyQix3QkFBQztDQUFBLEFBL0dELElBK0dDO1NBeEZZLGlCQUFpQjs7Ozs7O0lBRzVCLCtCQUFXOzs7OztJQUdYLHVDQUF1Qjs7Ozs7SUFHdkIsc0NBQWtCOzs7OztJQUdsQixrQ0FBMkM7Ozs7O0lBRzNDLGlDQUFhOzs7OztJQUdiLHNDQUFrQjs7Ozs7SUFHbEIsMkNBQXVCOzs7OztJQUd2Qiw0Q0FBd0I7Ozs7OztJQUd4Qix1Q0FBOEI7Ozs7OztJQUc5QixpRUFBMEQ7Ozs7O0lBRTlDLHNDQUFvRDs7Ozs7SUFDcEQsOENBQTJDOzs7OztJQUMzQyx3Q0FBK0I7O0lBQy9CLHNDQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT3B0aW9uYWwsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBFbGVtZW50UmVmLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBGb2N1c1RyYXAsIEZvY3VzVHJhcEZhY3RvcnkgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBsaWdodGJveEFuaW1hdGlvbiB9IGZyb20gJy4vbGlnaHRib3guYW5pbWF0aW9uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGlnaHRib3gnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgYW5pbWF0aW9uczogW2xpZ2h0Ym94QW5pbWF0aW9uXSxcbiAgc3R5bGVVcmxzOiBbJy4vbGlnaHRib3guY29tcG9uZW50LnNjc3MnXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8Z2FsbGVyeSBbaWRdPVwiaWRcIiBbZGVzdHJveVJlZl09XCJmYWxzZVwiIFtza2lwSW5pdENvbmZpZ109XCJ0cnVlXCI+XG4gICAgICA8aSBjbGFzcz1cImctYnRuLWNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgKGNsaWNrKT1cIm92ZXJsYXlSZWYuZGV0YWNoKClcIlxuICAgICAgICAgW2lubmVySFRNTF09XCJzYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoY2xvc2VJY29uKVwiPjwvaT5cbiAgICA8L2dhbGxlcnk+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdhcmlhLW1vZGFsJzogJ3RydWUnLFxuICAgICdbYXR0ci5pZF0nOiAnXCJsaWdodGJveC1cIiArIGlkJyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnYXJpYUxhYmVsID8gbnVsbCA6IGFyaWFMYWJlbGxlZEJ5JyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnYXJpYUxhYmVsJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnYXJpYURlc2NyaWJlZEJ5IHx8IG51bGwnLFxuICAgICdbQGxpZ2h0Ym94XSc6ICdzdGF0ZScsXG4gICAgJyhAbGlnaHRib3guZG9uZSknOiAnb25BbmltYXRpb25Eb25lKCRldmVudCknLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIExpZ2h0Ym94Q29tcG9uZW50IHtcblxuICAvKiogR2FsbGVyeSByZWYgaWQgKi9cbiAgaWQ6IHN0cmluZztcblxuICAvKiogT3ZlcmxheSByZWYgdG8gY2xvc2UgdGhlIGxpZ2h0Ym94ICovXG4gIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWY7XG5cbiAgLyoqIENsb3NlIGJ1dHRvbiBzdmcgZGF0YSAqL1xuICBjbG9zZUljb246IHN0cmluZztcblxuICAvKiogU3RhdGUgb2YgdGhlIGxpZ2h0Ym94IGFuaW1hdGlvbi4gKi9cbiAgc3RhdGU6ICd2b2lkJyB8ICdlbnRlcicgfCAnZXhpdCcgPSAnZW50ZXInO1xuXG4gIC8qKiBUaGUgQVJJQSByb2xlIG9mIHRoZSBsaWdodGJveCBlbGVtZW50LiAqL1xuICByb2xlOiBzdHJpbmc7XG5cbiAgLyoqIEFyaWEgbGFiZWwgdG8gYXNzaWduIHRvIHRoZSBsaWdodGJveCBlbGVtZW50ICovXG4gIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBJRCBvZiB0aGUgZWxlbWVudCB0aGF0IHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIHRoZSBsaWdodGJveCdzIGxhYmVsLiAqL1xuICBhcmlhTGFiZWxsZWRCeTogc3RyaW5nO1xuXG4gIC8qKiBJRCBvZiB0aGUgZWxlbWVudCB0aGF0IGRlc2NyaWJlcyB0aGUgbGlnaHRib3guICovXG4gIGFyaWFEZXNjcmliZWRCeTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgY2xhc3MgdGhhdCB0cmFwcyBhbmQgbWFuYWdlcyBmb2N1cyB3aXRoaW4gdGhlIGxpZ2h0Ym94LiAqL1xuICBwcml2YXRlIF9mb2N1c1RyYXA6IEZvY3VzVHJhcDtcblxuICAvKiogRWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgbGlnaHRib3ggd2FzIG9wZW5lZC4gU2F2ZSB0aGlzIHRvIHJlc3RvcmUgdXBvbiBjbG9zZS4gKi9cbiAgcHJpdmF0ZSBfZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQ6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgICAgICAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHB1YmxpYyBzYW5pdGl6ZXI6IERvbVNhbml0aXplcikge1xuICAgIHRoaXMuX3NhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKiBDYWxsYmFjaywgaW52b2tlZCB3aGVuZXZlciBhbiBhbmltYXRpb24gb24gdGhlIGhvc3QgY29tcGxldGVzLiAqL1xuICBvbkFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdlbnRlcicpIHtcbiAgICAgIHRoaXMuX3RyYXBGb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm92ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE1vdmVzIHRoZSBmb2N1cyBpbnNpZGUgdGhlIGZvY3VzIHRyYXAuICovXG4gIHByaXZhdGUgX3RyYXBGb2N1cygpIHtcbiAgICBpZiAoIXRoaXMuX2ZvY3VzVHJhcCkge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwID0gdGhpcy5fZm9jdXNUcmFwRmFjdG9yeS5jcmVhdGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gICAgLy8gSWYgd2VyZSB0byBhdHRlbXB0IHRvIGZvY3VzIGltbWVkaWF0ZWx5LCB0aGVuIHRoZSBjb250ZW50IG9mIHRoZSBsaWdodGJveCB3b3VsZCBub3QgeWV0IGJlXG4gICAgLy8gcmVhZHkgaW4gaW5zdGFuY2VzIHdoZXJlIGNoYW5nZSBkZXRlY3Rpb24gaGFzIHRvIHJ1biBmaXJzdC4gVG8gZGVhbCB3aXRoIHRoaXMsIHdlIHNpbXBseVxuICAgIC8vIHdhaXQgZm9yIHRoZSBtaWNyb3Rhc2sgcXVldWUgdG8gYmUgZW1wdHkuXG4gICAgdGhpcy5fZm9jdXNUcmFwLmZvY3VzSW5pdGlhbEVsZW1lbnRXaGVuUmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBTYXZlcyBhIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgbGlnaHRib3ggd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpIHtcbiAgICBpZiAodGhpcy5fZG9jdW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRGlhbG9nV2FzT3BlbmVkID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgLy8gTm90ZSB0aGF0IHRoZXJlIGlzIG5vIGZvY3VzIG1ldGhvZCB3aGVuIHJlbmRlcmluZyBvbiB0aGUgc2VydmVyLlxuICAgICAgaWYgKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cykge1xuICAgICAgICAvLyBNb3ZlIGZvY3VzIG9udG8gdGhlIGxpZ2h0Ym94IGltbWVkaWF0ZWx5IGluIG9yZGVyIHRvIHByZXZlbnQgdGhlIHVzZXIgZnJvbSBhY2NpZGVudGFsbHlcbiAgICAgICAgLy8gb3BlbmluZyBtdWx0aXBsZSBkaWFsb2dzIGF0IHRoZSBzYW1lIHRpbWUuIE5lZWRzIHRvIGJlIGFzeW5jLCBiZWNhdXNlIHRoZSBlbGVtZW50XG4gICAgICAgIC8vIG1heSBub3QgYmUgZm9jdXNhYmxlIGltbWVkaWF0ZWx5LlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogUmVzdG9yZXMgZm9jdXMgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGxpZ2h0Ym94IG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzKCkge1xuICAgIGNvbnN0IHRvRm9jdXMgPSB0aGlzLl9lbGVtZW50Rm9jdXNlZEJlZm9yZURpYWxvZ1dhc09wZW5lZDtcblxuICAgIC8vIFdlIG5lZWQgdGhlIGV4dHJhIGNoZWNrLCBiZWNhdXNlIElFIGNhbiBzZXQgdGhlIGBhY3RpdmVFbGVtZW50YCB0byBudWxsIGluIHNvbWUgY2FzZXMuXG4gICAgaWYgKHRvRm9jdXMgJiYgdHlwZW9mIHRvRm9jdXMuZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRvRm9jdXMuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxufVxuIl19
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Optional, ChangeDetectionStrategy, ElementRef, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { lightboxAnimation } from './lightbox.animation';
export class LightboxComponent {
    /**
     * @param {?} _document
     * @param {?} _focusTrapFactory
     * @param {?} _elementRef
     * @param {?} sanitizer
     */
    constructor(_document, _focusTrapFactory, _elementRef, sanitizer) {
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
    /**
     * Callback, invoked whenever an animation on the host completes.
     * @param {?} event
     * @return {?}
     */
    onAnimationDone(event) {
        if (event.toState === 'enter') {
            this._trapFocus();
        }
        else {
            this.overlayRef.dispose();
            this._restoreFocus();
        }
    }
    /**
     * Moves the focus inside the focus trap.
     * @private
     * @return {?}
     */
    _trapFocus() {
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        }
        // If were to attempt to focus immediately, then the content of the lightbox would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty.
        this._focusTrap.focusInitialElementWhenReady();
    }
    /**
     * Saves a reference to the element that was focused before the lightbox was opened.
     * @private
     * @return {?}
     */
    _savePreviouslyFocusedElement() {
        if (this._document) {
            this._elementFocusedBeforeDialogWasOpened = (/** @type {?} */ (this._document.activeElement));
            // Note that there is no focus method when rendering on the server.
            if (this._elementRef.nativeElement.focus) {
                // Move focus onto the lightbox immediately in order to prevent the user from accidentally
                // opening multiple dialogs at the same time. Needs to be async, because the element
                // may not be focusable immediately.
                Promise.resolve().then(() => this._elementRef.nativeElement.focus());
            }
        }
    }
    /**
     * Restores focus to the element that was focused before the lightbox opened.
     * @private
     * @return {?}
     */
    _restoreFocus() {
        /** @type {?} */
        const toFocus = this._elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    }
}
LightboxComponent.decorators = [
    { type: Component, args: [{
                selector: 'lightbox',
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [lightboxAnimation],
                template: `
    <gallery [id]="id" [destroyRef]="false" [skipInitConfig]="true">
      <i class="g-btn-close" aria-label="Close" (click)="overlayRef.detach()"
         [innerHTML]="sanitizer.bypassSecurityTrustHtml(closeIcon)"></i>
    </gallery>
  `,
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
LightboxComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: FocusTrapFactory },
    { type: ElementRef },
    { type: DomSanitizer }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1nYWxsZXJ5L2xpZ2h0Ym94LyIsInNvdXJjZXMiOlsibGliL2xpZ2h0Ym94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsdUJBQXVCLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRzNDLE9BQU8sRUFBYSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBeUJ6RCxNQUFNLE9BQU8saUJBQWlCOzs7Ozs7O0lBZ0M1QixZQUFrRCxTQUFjLEVBQzVDLGlCQUFtQyxFQUNuQyxXQUF1QixFQUN4QixTQUF1QjtRQUhRLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDNUMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUN4QixjQUFTLEdBQVQsU0FBUyxDQUFjOzs7O1FBdkIxQyxVQUFLLEdBQThCLE9BQU8sQ0FBQztRQXdCekMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7SUFDdkMsQ0FBQzs7Ozs7O0lBR0QsZUFBZSxDQUFDLEtBQXFCO1FBQ25DLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25CO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7Ozs7OztJQUdPLFVBQVU7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDakY7UUFDRCw2RkFBNkY7UUFDN0YsMkZBQTJGO1FBQzNGLDRDQUE0QztRQUM1QyxJQUFJLENBQUMsVUFBVSxDQUFDLDRCQUE0QixFQUFFLENBQUM7SUFDakQsQ0FBQzs7Ozs7O0lBR08sNkJBQTZCO1FBQ25DLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsb0NBQW9DLEdBQUcsbUJBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQWUsQ0FBQztZQUV4RixtRUFBbUU7WUFDbkUsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3hDLDBGQUEwRjtnQkFDMUYsb0ZBQW9GO2dCQUNwRixvQ0FBb0M7Z0JBQ3BDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzthQUN0RTtTQUNGO0lBQ0gsQ0FBQzs7Ozs7O0lBR08sYUFBYTs7Y0FDYixPQUFPLEdBQUcsSUFBSSxDQUFDLG9DQUFvQztRQUV6RCx5RkFBeUY7UUFDekYsSUFBSSxPQUFPLElBQUksT0FBTyxPQUFPLENBQUMsS0FBSyxLQUFLLFVBQVUsRUFBRTtZQUNsRCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDakI7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7OztZQTlHRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztnQkFFL0IsUUFBUSxFQUFFOzs7OztHQUtUO2dCQUNELElBQUksRUFBRTtvQkFDSixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsWUFBWSxFQUFFLE1BQU07b0JBQ3BCLFdBQVcsRUFBRSxrQkFBa0I7b0JBQy9CLGFBQWEsRUFBRSxNQUFNO29CQUNyQix3QkFBd0IsRUFBRSxtQ0FBbUM7b0JBQzdELG1CQUFtQixFQUFFLFdBQVc7b0JBQ2hDLHlCQUF5QixFQUFFLHlCQUF5QjtvQkFDcEQsYUFBYSxFQUFFLE9BQU87b0JBQ3RCLGtCQUFrQixFQUFFLHlCQUF5QjtpQkFDOUM7O2FBQ0Y7Ozs7NENBaUNjLFFBQVEsWUFBSSxNQUFNLFNBQUMsUUFBUTtZQTFEdEIsZ0JBQWdCO1lBTG1CLFVBQVU7WUFDeEQsWUFBWTs7Ozs7OztJQWlDbkIsK0JBQVc7Ozs7O0lBR1gsdUNBQXVCOzs7OztJQUd2QixzQ0FBa0I7Ozs7O0lBR2xCLGtDQUEyQzs7Ozs7SUFHM0MsaUNBQWE7Ozs7O0lBR2Isc0NBQWtCOzs7OztJQUdsQiwyQ0FBdUI7Ozs7O0lBR3ZCLDRDQUF3Qjs7Ozs7O0lBR3hCLHVDQUE4Qjs7Ozs7O0lBRzlCLGlFQUEwRDs7Ozs7SUFFOUMsc0NBQW9EOzs7OztJQUNwRCw4Q0FBMkM7Ozs7O0lBQzNDLHdDQUErQjs7SUFDL0Isc0NBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPcHRpb25hbCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIEVsZW1lbnRSZWYsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBbmltYXRpb25FdmVudCB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IEZvY3VzVHJhcCwgRm9jdXNUcmFwRmFjdG9yeSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IGxpZ2h0Ym94QW5pbWF0aW9uIH0gZnJvbSAnLi9saWdodGJveC5hbmltYXRpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWdodGJveCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBhbmltYXRpb25zOiBbbGlnaHRib3hBbmltYXRpb25dLFxuICBzdHlsZVVybHM6IFsnLi9saWdodGJveC5jb21wb25lbnQuc2NzcyddLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxnYWxsZXJ5IFtpZF09XCJpZFwiIFtkZXN0cm95UmVmXT1cImZhbHNlXCIgW3NraXBJbml0Q29uZmlnXT1cInRydWVcIj5cbiAgICAgIDxpIGNsYXNzPVwiZy1idG4tY2xvc2VcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiAoY2xpY2spPVwib3ZlcmxheVJlZi5kZXRhY2goKVwiXG4gICAgICAgICBbaW5uZXJIVE1MXT1cInNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbChjbG9zZUljb24pXCI+PC9pPlxuICAgIDwvZ2FsbGVyeT5cbiAgYCxcbiAgaG9zdDoge1xuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ2FyaWEtbW9kYWwnOiAndHJ1ZScsXG4gICAgJ1thdHRyLmlkXSc6ICdcImxpZ2h0Ym94LVwiICsgaWQnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdhcmlhTGFiZWwgPyBudWxsIDogYXJpYUxhYmVsbGVkQnknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdhcmlhTGFiZWwnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdhcmlhRGVzY3JpYmVkQnkgfHwgbnVsbCcsXG4gICAgJ1tAbGlnaHRib3hdJzogJ3N0YXRlJyxcbiAgICAnKEBsaWdodGJveC5kb25lKSc6ICdvbkFuaW1hdGlvbkRvbmUoJGV2ZW50KScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTGlnaHRib3hDb21wb25lbnQge1xuXG4gIC8qKiBHYWxsZXJ5IHJlZiBpZCAqL1xuICBpZDogc3RyaW5nO1xuXG4gIC8qKiBPdmVybGF5IHJlZiB0byBjbG9zZSB0aGUgbGlnaHRib3ggKi9cbiAgb3ZlcmxheVJlZjogT3ZlcmxheVJlZjtcblxuICAvKiogQ2xvc2UgYnV0dG9uIHN2ZyBkYXRhICovXG4gIGNsb3NlSWNvbjogc3RyaW5nO1xuXG4gIC8qKiBTdGF0ZSBvZiB0aGUgbGlnaHRib3ggYW5pbWF0aW9uLiAqL1xuICBzdGF0ZTogJ3ZvaWQnIHwgJ2VudGVyJyB8ICdleGl0JyA9ICdlbnRlcic7XG5cbiAgLyoqIFRoZSBBUklBIHJvbGUgb2YgdGhlIGxpZ2h0Ym94IGVsZW1lbnQuICovXG4gIHJvbGU6IHN0cmluZztcblxuICAvKiogQXJpYSBsYWJlbCB0byBhc3NpZ24gdG8gdGhlIGxpZ2h0Ym94IGVsZW1lbnQgKi9cbiAgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgdGhlIGxpZ2h0Ym94J3MgbGFiZWwuICovXG4gIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmc7XG5cbiAgLyoqIElEIG9mIHRoZSBlbGVtZW50IHRoYXQgZGVzY3JpYmVzIHRoZSBsaWdodGJveC4gKi9cbiAgYXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBjbGFzcyB0aGF0IHRyYXBzIGFuZCBtYW5hZ2VzIGZvY3VzIHdpdGhpbiB0aGUgbGlnaHRib3guICovXG4gIHByaXZhdGUgX2ZvY3VzVHJhcDogRm9jdXNUcmFwO1xuXG4gIC8qKiBFbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBsaWdodGJveCB3YXMgb3BlbmVkLiBTYXZlIHRoaXMgdG8gcmVzdG9yZSB1cG9uIGNsb3NlLiAqL1xuICBwcml2YXRlIF9lbGVtZW50Rm9jdXNlZEJlZm9yZURpYWxvZ1dhc09wZW5lZDogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHVibGljIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7XG4gICAgdGhpcy5fc2F2ZVByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCgpO1xuICB9XG5cbiAgLyoqIENhbGxiYWNrLCBpbnZva2VkIHdoZW5ldmVyIGFuIGFuaW1hdGlvbiBvbiB0aGUgaG9zdCBjb21wbGV0ZXMuICovXG4gIG9uQW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgdGhpcy5fdHJhcEZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogTW92ZXMgdGhlIGZvY3VzIGluc2lkZSB0aGUgZm9jdXMgdHJhcC4gKi9cbiAgcHJpdmF0ZSBfdHJhcEZvY3VzKCkge1xuICAgIGlmICghdGhpcy5fZm9jdXNUcmFwKSB7XG4gICAgICB0aGlzLl9mb2N1c1RyYXAgPSB0aGlzLl9mb2N1c1RyYXBGYWN0b3J5LmNyZWF0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgICAvLyBJZiB3ZXJlIHRvIGF0dGVtcHQgdG8gZm9jdXMgaW1tZWRpYXRlbHksIHRoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGxpZ2h0Ym94IHdvdWxkIG5vdCB5ZXQgYmVcbiAgICAvLyByZWFkeSBpbiBpbnN0YW5jZXMgd2hlcmUgY2hhbmdlIGRldGVjdGlvbiBoYXMgdG8gcnVuIGZpcnN0LiBUbyBkZWFsIHdpdGggdGhpcywgd2Ugc2ltcGx5XG4gICAgLy8gd2FpdCBmb3IgdGhlIG1pY3JvdGFzayBxdWV1ZSB0byBiZSBlbXB0eS5cbiAgICB0aGlzLl9mb2N1c1RyYXAuZm9jdXNJbml0aWFsRWxlbWVudFdoZW5SZWFkeSgpO1xuICB9XG5cbiAgLyoqIFNhdmVzIGEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBsaWdodGJveCB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9zYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCkge1xuICAgIGlmICh0aGlzLl9kb2N1bWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudEZvY3VzZWRCZWZvcmVEaWFsb2dXYXNPcGVuZWQgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAvLyBOb3RlIHRoYXQgdGhlcmUgaXMgbm8gZm9jdXMgbWV0aG9kIHdoZW4gcmVuZGVyaW5nIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICBpZiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKSB7XG4gICAgICAgIC8vIE1vdmUgZm9jdXMgb250byB0aGUgbGlnaHRib3ggaW1tZWRpYXRlbHkgaW4gb3JkZXIgdG8gcHJldmVudCB0aGUgdXNlciBmcm9tIGFjY2lkZW50YWxseVxuICAgICAgICAvLyBvcGVuaW5nIG11bHRpcGxlIGRpYWxvZ3MgYXQgdGhlIHNhbWUgdGltZS4gTmVlZHMgdG8gYmUgYXN5bmMsIGJlY2F1c2UgdGhlIGVsZW1lbnRcbiAgICAgICAgLy8gbWF5IG5vdCBiZSBmb2N1c2FibGUgaW1tZWRpYXRlbHkuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXN0b3JlcyBmb2N1cyB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgbGlnaHRib3ggb3BlbmVkLiAqL1xuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG4gICAgY29uc3QgdG9Gb2N1cyA9IHRoaXMuX2VsZW1lbnRGb2N1c2VkQmVmb3JlRGlhbG9nV2FzT3BlbmVkO1xuXG4gICAgLy8gV2UgbmVlZCB0aGUgZXh0cmEgY2hlY2ssIGJlY2F1c2UgSUUgY2FuIHNldCB0aGUgYGFjdGl2ZUVsZW1lbnRgIHRvIG51bGwgaW4gc29tZSBjYXNlcy5cbiAgICBpZiAodG9Gb2N1cyAmJiB0eXBlb2YgdG9Gb2N1cy5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdG9Gb2N1cy5mb2N1cygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcC5kZXN0cm95KCk7XG4gICAgfVxuICB9XG59XG4iXX0=
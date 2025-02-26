/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Lightbox } from './lightbox.service';
export class LightboxDirective {
    /**
     * @param {?} _lightbox
     * @param {?} _el
     * @param {?} _renderer
     */
    constructor(_lightbox, _el, _renderer) {
        this._lightbox = _lightbox;
        this._el = _el;
        this._renderer = _renderer;
        this.clickEvent = Subscription.EMPTY;
        this.index = 0;
        this.id = 'root';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._renderer.setStyle(this._el.nativeElement, 'cursor', 'pointer');
        this.clickEvent = fromEvent(this._el.nativeElement, 'click').pipe(tap(() => this._lightbox.open(this.index, this.id))).subscribe();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.clickEvent.unsubscribe();
    }
}
LightboxDirective.decorators = [
    { type: Directive, args: [{
                selector: '[lightbox]'
            },] }
];
/** @nocollapse */
LightboxDirective.ctorParameters = () => [
    { type: Lightbox },
    { type: ElementRef },
    { type: Renderer2 }
];
LightboxDirective.propDecorators = {
    index: [{ type: Input, args: ['lightbox',] }],
    id: [{ type: Input, args: ['gallery',] }]
};
if (false) {
    /** @type {?} */
    LightboxDirective.prototype.clickEvent;
    /** @type {?} */
    LightboxDirective.prototype.index;
    /** @type {?} */
    LightboxDirective.prototype.id;
    /**
     * @type {?}
     * @private
     */
    LightboxDirective.prototype._lightbox;
    /**
     * @type {?}
     * @private
     */
    LightboxDirective.prototype._el;
    /**
     * @type {?}
     * @private
     */
    LightboxDirective.prototype._renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3guZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1nYWxsZXJ5L2xpZ2h0Ym94LyIsInNvdXJjZXMiOlsibGliL2xpZ2h0Ym94LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQVUsS0FBSyxFQUFhLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRixPQUFPLEVBQUUsU0FBUyxFQUFvQixZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUs5QyxNQUFNLE9BQU8saUJBQWlCOzs7Ozs7SUFPNUIsWUFBb0IsU0FBbUIsRUFBVSxHQUFlLEVBQVUsU0FBb0I7UUFBMUUsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBTDlGLGVBQVUsR0FBcUIsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUUvQixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsT0FBRSxHQUFHLE1BQU0sQ0FBQztJQUc5QixDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQy9ELEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNwRCxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2hCLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNoQyxDQUFDOzs7WUF0QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2FBQ3ZCOzs7O1lBSlEsUUFBUTtZQUhHLFVBQVU7WUFBNEIsU0FBUzs7O29CQVloRSxLQUFLLFNBQUMsVUFBVTtpQkFDaEIsS0FBSyxTQUFDLFNBQVM7Ozs7SUFIaEIsdUNBQWtEOztJQUVsRCxrQ0FBNkI7O0lBQzdCLCtCQUE4Qjs7Ozs7SUFFbEIsc0NBQTJCOzs7OztJQUFFLGdDQUF1Qjs7Ozs7SUFBRSxzQ0FBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uSW5pdCwgSW5wdXQsIE9uRGVzdHJveSwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbkxpa2UsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgTGlnaHRib3ggfSBmcm9tICcuL2xpZ2h0Ym94LnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbGlnaHRib3hdJ1xufSlcbmV4cG9ydCBjbGFzcyBMaWdodGJveERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBjbGlja0V2ZW50OiBTdWJzY3JpcHRpb25MaWtlID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIEBJbnB1dCgnbGlnaHRib3gnKSBpbmRleCA9IDA7XG4gIEBJbnB1dCgnZ2FsbGVyeScpIGlkID0gJ3Jvb3QnO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2xpZ2h0Ym94OiBMaWdodGJveCwgcHJpdmF0ZSBfZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAncG9pbnRlcicpO1xuICAgIHRoaXMuY2xpY2tFdmVudCA9IGZyb21FdmVudCh0aGlzLl9lbC5uYXRpdmVFbGVtZW50LCAnY2xpY2snKS5waXBlKFxuICAgICAgdGFwKCgpID0+IHRoaXMuX2xpZ2h0Ym94Lm9wZW4odGhpcy5pbmRleCwgdGhpcy5pZCkpXG4gICAgKS5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2xpY2tFdmVudC51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=
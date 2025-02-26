/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { animate, state, style, transition, trigger } from '@angular/animations';
/** @type {?} */
export const lightboxAnimation = trigger('lightbox', [
    // Note: The `enter` animation transitions to `transform: none`, because for some reason
    // specifying the transform explicitly, causes IE both to blur the dialog content and
    // decimate the animation performance. Leaving it as `none` solves both issues.
    state('void, exit', style({ opacity: 0, transform: 'scale(0.7)' })),
    state('enter', style({ transform: 'none' })),
    transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({ transform: 'none', opacity: 1 }))),
    transition('* => void, * => exit', animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 }))),
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3guYW5pbWF0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1nYWxsZXJ5L2xpZ2h0Ym94LyIsInNvdXJjZXMiOlsibGliL2xpZ2h0Ym94LmFuaW1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7QUFFakYsTUFBTSxPQUFPLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUU7SUFDbkQsd0ZBQXdGO0lBQ3hGLHFGQUFxRjtJQUNyRiwrRUFBK0U7SUFDL0UsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO0lBQ2pFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDMUMsVUFBVSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsa0NBQWtDLEVBQ2pFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxVQUFVLENBQUMsc0JBQXNCLEVBQy9CLE9BQU8sQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3ZFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuZXhwb3J0IGNvbnN0IGxpZ2h0Ym94QW5pbWF0aW9uID0gdHJpZ2dlcignbGlnaHRib3gnLCBbXG4gIC8vIE5vdGU6IFRoZSBgZW50ZXJgIGFuaW1hdGlvbiB0cmFuc2l0aW9ucyB0byBgdHJhbnNmb3JtOiBub25lYCwgYmVjYXVzZSBmb3Igc29tZSByZWFzb25cbiAgLy8gc3BlY2lmeWluZyB0aGUgdHJhbnNmb3JtIGV4cGxpY2l0bHksIGNhdXNlcyBJRSBib3RoIHRvIGJsdXIgdGhlIGRpYWxvZyBjb250ZW50IGFuZFxuICAvLyBkZWNpbWF0ZSB0aGUgYW5pbWF0aW9uIHBlcmZvcm1hbmNlLiBMZWF2aW5nIGl0IGFzIGBub25lYCBzb2x2ZXMgYm90aCBpc3N1ZXMuXG4gIHN0YXRlKCd2b2lkLCBleGl0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDAuNyknfSkpLFxuICBzdGF0ZSgnZW50ZXInLCBzdHlsZSh7dHJhbnNmb3JtOiAnbm9uZSd9KSksXG4gIHRyYW5zaXRpb24oJyogPT4gZW50ZXInLCBhbmltYXRlKCcxNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScsXG4gICAgc3R5bGUoe3RyYW5zZm9ybTogJ25vbmUnLCBvcGFjaXR5OiAxfSkpKSxcbiAgdHJhbnNpdGlvbignKiA9PiB2b2lkLCAqID0+IGV4aXQnLFxuICAgIGFuaW1hdGUoJzc1bXMgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpJywgc3R5bGUoe29wYWNpdHk6IDB9KSkpLFxuXSk7XG5cbiJdfQ==
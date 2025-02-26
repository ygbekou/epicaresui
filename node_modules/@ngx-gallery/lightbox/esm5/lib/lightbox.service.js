/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { LEFT_ARROW, RIGHT_ARROW, ESCAPE } from '@angular/cdk/keycodes';
import { Gallery } from '@ngx-gallery/core';
import { Subject } from 'rxjs';
import { LIGHTBOX_CONFIG } from './lightbox.model';
import { defaultConfig } from './lightbox.default';
import { LightboxComponent } from './lightbox.component';
var Lightbox = /** @class */ (function () {
    function Lightbox(config, _gallery, _overlay) {
        this._gallery = _gallery;
        this._overlay = _overlay;
        /**
         * Stream that emits when lightbox is opened
         */
        this.opened = new Subject();
        /**
         * Stream that emits when lightbox is closed
         */
        this.closed = new Subject();
        this._config = config ? tslib_1.__assign({}, defaultConfig, config) : defaultConfig;
    }
    /**
     * Set Lightbox Config
     * @param config - LightboxConfig
     */
    /**
     * Set Lightbox Config
     * @param {?} config - LightboxConfig
     * @return {?}
     */
    Lightbox.prototype.setConfig = /**
     * Set Lightbox Config
     * @param {?} config - LightboxConfig
     * @return {?}
     */
    function (config) {
        this._config = tslib_1.__assign({}, this._config, config);
    };
    /**
     * Open Lightbox Overlay
     * @param i - Current Index
     * @param id - Gallery ID
     * @param config - Lightbox Config
     */
    /**
     * Open Lightbox Overlay
     * @param {?=} i - Current Index
     * @param {?=} id - Gallery ID
     * @param {?=} config - Lightbox Config
     * @return {?}
     */
    Lightbox.prototype.open = /**
     * Open Lightbox Overlay
     * @param {?=} i - Current Index
     * @param {?=} id - Gallery ID
     * @param {?=} config - Lightbox Config
     * @return {?}
     */
    function (i, id, config) {
        var _this = this;
        if (i === void 0) { i = 0; }
        if (id === void 0) { id = 'lightbox'; }
        /** @type {?} */
        var _config = config ? tslib_1.__assign({}, this._config, config) : this._config;
        /** @type {?} */
        var overlayConfig = {
            backdropClass: _config.backdropClass,
            panelClass: _config.panelClass,
            hasBackdrop: _config.hasBackdrop,
            positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
            scrollStrategy: this._overlay.scrollStrategies.block(),
            disposeOnNavigation: true
        };
        /** @type {?} */
        var galleryRef = this._gallery.ref(id);
        galleryRef.set(i);
        this._overlayRef = this._overlay.create(overlayConfig);
        // overlay opened event
        this._overlayRef.attachments().subscribe(function () { return _this.opened.next(id); });
        // overlay closed event
        this._overlayRef.detachments().subscribe(function () { return _this.closed.next(id); });
        // Attach gallery to the overlay
        /** @type {?} */
        var galleryPortal = new ComponentPortal(LightboxComponent);
        /** @type {?} */
        var lightboxRef = this._overlayRef.attach(galleryPortal);
        lightboxRef.instance.id = id;
        lightboxRef.instance.overlayRef = this._overlayRef;
        lightboxRef.instance.closeIcon = this._config.closeIcon;
        lightboxRef.instance.role = this._config.role;
        lightboxRef.instance.ariaLabel = this._config.ariaLabel;
        lightboxRef.instance.ariaLabelledBy = this._config.ariaLabelledBy;
        lightboxRef.instance.ariaDescribedBy = this._config.ariaDescribedBy;
        if (_config.hasBackdrop) {
            this._overlayRef.backdropClick().subscribe(function () { return _this.close(); });
        }
        // Add keyboard shortcuts
        if (_config.keyboardShortcuts) {
            this._overlayRef.keydownEvents().subscribe(function (event) {
                switch (event.keyCode) {
                    case LEFT_ARROW:
                        galleryRef.prev();
                        break;
                    case RIGHT_ARROW:
                        galleryRef.next();
                        break;
                    case ESCAPE:
                        _this.close();
                }
            });
        }
    };
    /**
     * Close Lightbox Overlay
     */
    /**
     * Close Lightbox Overlay
     * @return {?}
     */
    Lightbox.prototype.close = /**
     * Close Lightbox Overlay
     * @return {?}
     */
    function () {
        if (this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
        }
    };
    Lightbox.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    Lightbox.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [LIGHTBOX_CONFIG,] }] },
        { type: Gallery },
        { type: Overlay }
    ]; };
    return Lightbox;
}());
export { Lightbox };
if (false) {
    /**
     * Gallery overlay ref
     * @type {?}
     * @private
     */
    Lightbox.prototype._overlayRef;
    /**
     * Global config
     * @type {?}
     * @private
     */
    Lightbox.prototype._config;
    /**
     * Stream that emits when lightbox is opened
     * @type {?}
     */
    Lightbox.prototype.opened;
    /**
     * Stream that emits when lightbox is closed
     * @type {?}
     */
    Lightbox.prototype.closed;
    /**
     * @type {?}
     * @private
     */
    Lightbox.prototype._gallery;
    /**
     * @type {?}
     * @private
     */
    Lightbox.prototype._overlay;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3guc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZ2FsbGVyeS9saWdodGJveC8iLCJzb3VyY2VzIjpbImxpYi9saWdodGJveC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFnQixNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFFLE9BQU8sRUFBNkIsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDNUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQWtCLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV6RDtJQWVFLGtCQUFpRCxNQUFzQixFQUFVLFFBQWlCLEVBQVUsUUFBaUI7UUFBNUMsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUFVLGFBQVEsR0FBUixRQUFRLENBQVM7Ozs7UUFMN0gsV0FBTSxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7Ozs7UUFHL0IsV0FBTSxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7UUFHN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxzQkFBSyxhQUFhLEVBQUssTUFBTSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUM7SUFDeEUsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7O0lBQ0gsNEJBQVM7Ozs7O0lBQVQsVUFBVSxNQUFzQjtR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QUFDLEtBQVU7Z0JBQ3BELFFBQVEsS0FBSyxDQUFDLE9BQU8sRUFBRTtvQkFDckIsS0FBSyxVQUFVO3dCQUNiLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDbEIsTUFBTTtvQkFDUixLQUFLLFdBQVc7d0JBQ2QsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNsQixNQUFNO29CQUNSLEtBQUssTUFBTTt3QkFDVCxLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2hCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCx3QkFBSzs7OztJQUFMO1FBQ0UsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDM0I7SUFDSCxDQUFDOztnQkFqR0YsVUFBVTs7OztnREFlSSxRQUFRLFlBQUksTUFBTSxTQUFDLGVBQWU7Z0JBdEJ4QyxPQUFPO2dCQUZQLE9BQU87O0lBMkdoQixlQUFDO0NBQUEsQUFsR0QsSUFrR0M7U0FqR1ksUUFBUTs7Ozs7OztJQUduQiwrQkFBZ0M7Ozs7OztJQUdoQywyQkFBZ0M7Ozs7O0lBR2hDLDBCQUErQjs7Ozs7SUFHL0IsMEJBQStCOzs7OztJQUUwQyw0QkFBeUI7Ozs7O0lBQUUsNEJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50UmVmLCBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7IE92ZXJsYXksIE92ZXJsYXlSZWYsIE92ZXJsYXlDb25maWcgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBMRUZUX0FSUk9XLCBSSUdIVF9BUlJPVywgRVNDQVBFIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7IEdhbGxlcnkgfSBmcm9tICdAbmd4LWdhbGxlcnkvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IExpZ2h0Ym94Q29uZmlnLCBMSUdIVEJPWF9DT05GSUcgfSBmcm9tICcuL2xpZ2h0Ym94Lm1vZGVsJztcbmltcG9ydCB7IGRlZmF1bHRDb25maWcgfSBmcm9tICcuL2xpZ2h0Ym94LmRlZmF1bHQnO1xuaW1wb3J0IHsgTGlnaHRib3hDb21wb25lbnQgfSBmcm9tICcuL2xpZ2h0Ym94LmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMaWdodGJveCB7XG5cbiAgLyoqIEdhbGxlcnkgb3ZlcmxheSByZWYgKi9cbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZjtcblxuICAvKiogR2xvYmFsIGNvbmZpZyAqL1xuICBwcml2YXRlIF9jb25maWc6IExpZ2h0Ym94Q29uZmlnO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGxpZ2h0Ym94IGlzIG9wZW5lZCAqL1xuICBvcGVuZWQgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gbGlnaHRib3ggaXMgY2xvc2VkICovXG4gIGNsb3NlZCA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KExJR0hUQk9YX0NPTkZJRykgY29uZmlnOiBMaWdodGJveENvbmZpZywgcHJpdmF0ZSBfZ2FsbGVyeTogR2FsbGVyeSwgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSkge1xuICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZyA/IHsuLi5kZWZhdWx0Q29uZmlnLCAuLi5jb25maWd9IDogZGVmYXVsdENvbmZpZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgTGlnaHRib3ggQ29uZmlnXG4gICAqIEBwYXJhbSBjb25maWcgLSBMaWdodGJveENvbmZpZ1xuICAgKi9cbiAgc2V0Q29uZmlnKGNvbmZpZzogTGlnaHRib3hDb25maWcpIHtcbiAgICB0aGlzLl9jb25maWcgPSB7Li4udGhpcy5fY29uZmlnLCAuLi5jb25maWd9O1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW4gTGlnaHRib3ggT3ZlcmxheVxuICAgKiBAcGFyYW0gaSAtIEN1cnJlbnQgSW5kZXhcbiAgICogQHBhcmFtIGlkIC0gR2FsbGVyeSBJRFxuICAgKiBAcGFyYW0gY29uZmlnIC0gTGlnaHRib3ggQ29uZmlnXG4gICAqL1xuICBvcGVuKGkgPSAwLCBpZCA9ICdsaWdodGJveCcsIGNvbmZpZz86IExpZ2h0Ym94Q29uZmlnKSB7XG5cbiAgICBjb25zdCBfY29uZmlnID0gY29uZmlnID8gey4uLnRoaXMuX2NvbmZpZywgLi4uY29uZmlnfSA6IHRoaXMuX2NvbmZpZztcblxuICAgIGNvbnN0IG92ZXJsYXlDb25maWc6IE92ZXJsYXlDb25maWcgPSB7XG4gICAgICBiYWNrZHJvcENsYXNzOiBfY29uZmlnLmJhY2tkcm9wQ2xhc3MsXG4gICAgICBwYW5lbENsYXNzOiBfY29uZmlnLnBhbmVsQ2xhc3MsXG4gICAgICBoYXNCYWNrZHJvcDogX2NvbmZpZy5oYXNCYWNrZHJvcCxcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKS5nbG9iYWwoKS5jZW50ZXJIb3Jpem9udGFsbHkoKS5jZW50ZXJWZXJ0aWNhbGx5KCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmJsb2NrKCksXG4gICAgICBkaXNwb3NlT25OYXZpZ2F0aW9uOiB0cnVlXG4gICAgfTtcblxuICAgIGNvbnN0IGdhbGxlcnlSZWYgPSB0aGlzLl9nYWxsZXJ5LnJlZihpZCk7XG4gICAgZ2FsbGVyeVJlZi5zZXQoaSk7XG5cbiAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG5cbiAgICAvLyBvdmVybGF5IG9wZW5lZCBldmVudFxuICAgIHRoaXMuX292ZXJsYXlSZWYuYXR0YWNobWVudHMoKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vcGVuZWQubmV4dChpZCkpO1xuXG4gICAgLy8gb3ZlcmxheSBjbG9zZWQgZXZlbnRcbiAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaG1lbnRzKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2VkLm5leHQoaWQpKTtcblxuICAgIC8vIEF0dGFjaCBnYWxsZXJ5IHRvIHRoZSBvdmVybGF5XG4gICAgY29uc3QgZ2FsbGVyeVBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWwoTGlnaHRib3hDb21wb25lbnQpO1xuICAgIGNvbnN0IGxpZ2h0Ym94UmVmOiBDb21wb25lbnRSZWY8TGlnaHRib3hDb21wb25lbnQ+ID0gdGhpcy5fb3ZlcmxheVJlZi5hdHRhY2goZ2FsbGVyeVBvcnRhbCk7XG5cbiAgICBsaWdodGJveFJlZi5pbnN0YW5jZS5pZCA9IGlkO1xuICAgIGxpZ2h0Ym94UmVmLmluc3RhbmNlLm92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5UmVmO1xuICAgIGxpZ2h0Ym94UmVmLmluc3RhbmNlLmNsb3NlSWNvbiA9IHRoaXMuX2NvbmZpZy5jbG9zZUljb247XG4gICAgbGlnaHRib3hSZWYuaW5zdGFuY2Uucm9sZSA9IHRoaXMuX2NvbmZpZy5yb2xlO1xuICAgIGxpZ2h0Ym94UmVmLmluc3RhbmNlLmFyaWFMYWJlbCA9IHRoaXMuX2NvbmZpZy5hcmlhTGFiZWw7XG4gICAgbGlnaHRib3hSZWYuaW5zdGFuY2UuYXJpYUxhYmVsbGVkQnkgPSB0aGlzLl9jb25maWcuYXJpYUxhYmVsbGVkQnk7XG4gICAgbGlnaHRib3hSZWYuaW5zdGFuY2UuYXJpYURlc2NyaWJlZEJ5ID0gdGhpcy5fY29uZmlnLmFyaWFEZXNjcmliZWRCeTtcblxuICAgIGlmIChfY29uZmlnLmhhc0JhY2tkcm9wKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICB9XG5cbiAgICAvLyBBZGQga2V5Ym9hcmQgc2hvcnRjdXRzXG4gICAgaWYgKF9jb25maWcua2V5Ym9hcmRTaG9ydGN1dHMpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpLnN1YnNjcmliZSgoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICBjYXNlIExFRlRfQVJST1c6XG4gICAgICAgICAgICBnYWxsZXJ5UmVmLnByZXYoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgICAgICBnYWxsZXJ5UmVmLm5leHQoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRVNDQVBFOlxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgTGlnaHRib3ggT3ZlcmxheVxuICAgKi9cbiAgY2xvc2UoKSB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
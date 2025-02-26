/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { LEFT_ARROW, RIGHT_ARROW, ESCAPE } from '@angular/cdk/keycodes';
import { Gallery } from '@ngx-gallery/core';
import { Subject } from 'rxjs';
import { LIGHTBOX_CONFIG } from './lightbox.model';
import { defaultConfig } from './lightbox.default';
import { LightboxComponent } from './lightbox.component';
export class Lightbox {
    /**
     * @param {?} config
     * @param {?} _gallery
     * @param {?} _overlay
     */
    constructor(config, _gallery, _overlay) {
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
        this._config = config ? Object.assign({}, defaultConfig, config) : defaultConfig;
    }
    /**
     * Set Lightbox Config
     * @param {?} config - LightboxConfig
     * @return {?}
     */
    setConfig(config) {
        this._config = Object.assign({}, this._config, config);
    }
    /**
     * Open Lightbox Overlay
     * @param {?=} i - Current Index
     * @param {?=} id - Gallery ID
     * @param {?=} config - Lightbox Config
     * @return {?}
     */
    open(i = 0, id = 'lightbox', config) {
        /** @type {?} */
        const _config = config ? Object.assign({}, this._config, config) : this._config;
        /** @type {?} */
        const overlayConfig = {
            backdropClass: _config.backdropClass,
            panelClass: _config.panelClass,
            hasBackdrop: _config.hasBackdrop,
            positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
            scrollStrategy: this._overlay.scrollStrategies.block(),
            disposeOnNavigation: true
        };
        /** @type {?} */
        const galleryRef = this._gallery.ref(id);
        galleryRef.set(i);
        this._overlayRef = this._overlay.create(overlayConfig);
        // overlay opened event
        this._overlayRef.attachments().subscribe(() => this.opened.next(id));
        // overlay closed event
        this._overlayRef.detachments().subscribe(() => this.closed.next(id));
        // Attach gallery to the overlay
        /** @type {?} */
        const galleryPortal = new ComponentPortal(LightboxComponent);
        /** @type {?} */
        const lightboxRef = this._overlayRef.attach(galleryPortal);
        lightboxRef.instance.id = id;
        lightboxRef.instance.overlayRef = this._overlayRef;
        lightboxRef.instance.closeIcon = this._config.closeIcon;
        lightboxRef.instance.role = this._config.role;
        lightboxRef.instance.ariaLabel = this._config.ariaLabel;
        lightboxRef.instance.ariaLabelledBy = this._config.ariaLabelledBy;
        lightboxRef.instance.ariaDescribedBy = this._config.ariaDescribedBy;
        if (_config.hasBackdrop) {
            this._overlayRef.backdropClick().subscribe(() => this.close());
        }
        // Add keyboard shortcuts
        if (_config.keyboardShortcuts) {
            this._overlayRef.keydownEvents().subscribe((event) => {
                switch (event.keyCode) {
                    case LEFT_ARROW:
                        galleryRef.prev();
                        break;
                    case RIGHT_ARROW:
                        galleryRef.next();
                        break;
                    case ESCAPE:
                        this.close();
                }
            });
        }
    }
    /**
     * Close Lightbox Overlay
     * @return {?}
     */
    close() {
        if (this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
        }
    }
}
Lightbox.decorators = [
    { type: Injectable }
];
/** @nocollapse */
Lightbox.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [LIGHTBOX_CONFIG,] }] },
    { type: Gallery },
    { type: Overlay }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3guc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZ2FsbGVyeS9saWdodGJveC8iLCJzb3VyY2VzIjpbImxpYi9saWdodGJveC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQWdCLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsT0FBTyxFQUE2QixNQUFNLHNCQUFzQixDQUFDO0FBQzFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRS9CLE9BQU8sRUFBa0IsZUFBZSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbkUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBR3pELE1BQU0sT0FBTyxRQUFROzs7Ozs7SUFjbkIsWUFBaUQsTUFBc0IsRUFBVSxRQUFpQixFQUFVLFFBQWlCO1FBQTVDLGFBQVEsR0FBUixRQUFRLENBQVM7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFTOzs7O1FBTDdILFdBQU0sR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDOzs7O1FBRy9CLFdBQU0sR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBRzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsbUJBQUssYUFBYSxFQUFLLE1BQU0sRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDO0lBQ3hFLENBQUM7Ozs7OztJQU1ELFNBQVMsQ0FBQyxNQUFzQjtRQUM5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SUFBSSxFQUFFLENBQUM7d0JBQ2xCLE1BQU07b0JBQ1IsS0FBSyxXQUFXO3dCQUNkLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDbEIsTUFBTTtvQkFDUixLQUFLLE1BQU07d0JBQ1QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNoQjtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7OztJQUtELEtBQUs7UUFDSCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7OztZQWpHRixVQUFVOzs7OzRDQWVJLFFBQVEsWUFBSSxNQUFNLFNBQUMsZUFBZTtZQXRCeEMsT0FBTztZQUZQLE9BQU87Ozs7Ozs7O0lBYWQsK0JBQWdDOzs7Ozs7SUFHaEMsMkJBQWdDOzs7OztJQUdoQywwQkFBK0I7Ozs7O0lBRy9CLDBCQUErQjs7Ozs7SUFFMEMsNEJBQXlCOzs7OztJQUFFLDRCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudFJlZiwgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBPdmVybGF5LCBPdmVybGF5UmVmLCBPdmVybGF5Q29uZmlnIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgTEVGVF9BUlJPVywgUklHSFRfQVJST1csIEVTQ0FQRSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQgeyBHYWxsZXJ5IH0gZnJvbSAnQG5neC1nYWxsZXJ5L2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBMaWdodGJveENvbmZpZywgTElHSFRCT1hfQ09ORklHIH0gZnJvbSAnLi9saWdodGJveC5tb2RlbCc7XG5pbXBvcnQgeyBkZWZhdWx0Q29uZmlnIH0gZnJvbSAnLi9saWdodGJveC5kZWZhdWx0JztcbmltcG9ydCB7IExpZ2h0Ym94Q29tcG9uZW50IH0gZnJvbSAnLi9saWdodGJveC5jb21wb25lbnQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTGlnaHRib3gge1xuXG4gIC8qKiBHYWxsZXJ5IG92ZXJsYXkgcmVmICovXG4gIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWY7XG5cbiAgLyoqIEdsb2JhbCBjb25maWcgKi9cbiAgcHJpdmF0ZSBfY29uZmlnOiBMaWdodGJveENvbmZpZztcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiBsaWdodGJveCBpcyBvcGVuZWQgKi9cbiAgb3BlbmVkID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIGxpZ2h0Ym94IGlzIGNsb3NlZCAqL1xuICBjbG9zZWQgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChMSUdIVEJPWF9DT05GSUcpIGNvbmZpZzogTGlnaHRib3hDb25maWcsIHByaXZhdGUgX2dhbGxlcnk6IEdhbGxlcnksIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXkpIHtcbiAgICB0aGlzLl9jb25maWcgPSBjb25maWcgPyB7Li4uZGVmYXVsdENvbmZpZywgLi4uY29uZmlnfSA6IGRlZmF1bHRDb25maWc7XG4gIH1cblxuICAvKipcbiAgICogU2V0IExpZ2h0Ym94IENvbmZpZ1xuICAgKiBAcGFyYW0gY29uZmlnIC0gTGlnaHRib3hDb25maWdcbiAgICovXG4gIHNldENvbmZpZyhjb25maWc6IExpZ2h0Ym94Q29uZmlnKSB7XG4gICAgdGhpcy5fY29uZmlnID0gey4uLnRoaXMuX2NvbmZpZywgLi4uY29uZmlnfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVuIExpZ2h0Ym94IE92ZXJsYXlcbiAgICogQHBhcmFtIGkgLSBDdXJyZW50IEluZGV4XG4gICAqIEBwYXJhbSBpZCAtIEdhbGxlcnkgSURcbiAgICogQHBhcmFtIGNvbmZpZyAtIExpZ2h0Ym94IENvbmZpZ1xuICAgKi9cbiAgb3BlbihpID0gMCwgaWQgPSAnbGlnaHRib3gnLCBjb25maWc/OiBMaWdodGJveENvbmZpZykge1xuXG4gICAgY29uc3QgX2NvbmZpZyA9IGNvbmZpZyA/IHsuLi50aGlzLl9jb25maWcsIC4uLmNvbmZpZ30gOiB0aGlzLl9jb25maWc7XG5cbiAgICBjb25zdCBvdmVybGF5Q29uZmlnOiBPdmVybGF5Q29uZmlnID0ge1xuICAgICAgYmFja2Ryb3BDbGFzczogX2NvbmZpZy5iYWNrZHJvcENsYXNzLFxuICAgICAgcGFuZWxDbGFzczogX2NvbmZpZy5wYW5lbENsYXNzLFxuICAgICAgaGFzQmFja2Ryb3A6IF9jb25maWcuaGFzQmFja2Ryb3AsXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuY2VudGVyVmVydGljYWxseSgpLFxuICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMuX292ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5ibG9jaygpLFxuICAgICAgZGlzcG9zZU9uTmF2aWdhdGlvbjogdHJ1ZVxuICAgIH07XG5cbiAgICBjb25zdCBnYWxsZXJ5UmVmID0gdGhpcy5fZ2FsbGVyeS5yZWYoaWQpO1xuICAgIGdhbGxlcnlSZWYuc2V0KGkpO1xuXG4gICAgdGhpcy5fb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuXG4gICAgLy8gb3ZlcmxheSBvcGVuZWQgZXZlbnRcbiAgICB0aGlzLl9vdmVybGF5UmVmLmF0dGFjaG1lbnRzKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMub3BlbmVkLm5leHQoaWQpKTtcblxuICAgIC8vIG92ZXJsYXkgY2xvc2VkIGV2ZW50XG4gICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlZC5uZXh0KGlkKSk7XG5cbiAgICAvLyBBdHRhY2ggZ2FsbGVyeSB0byB0aGUgb3ZlcmxheVxuICAgIGNvbnN0IGdhbGxlcnlQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKExpZ2h0Ym94Q29tcG9uZW50KTtcbiAgICBjb25zdCBsaWdodGJveFJlZjogQ29tcG9uZW50UmVmPExpZ2h0Ym94Q29tcG9uZW50PiA9IHRoaXMuX292ZXJsYXlSZWYuYXR0YWNoKGdhbGxlcnlQb3J0YWwpO1xuXG4gICAgbGlnaHRib3hSZWYuaW5zdGFuY2UuaWQgPSBpZDtcbiAgICBsaWdodGJveFJlZi5pbnN0YW5jZS5vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheVJlZjtcbiAgICBsaWdodGJveFJlZi5pbnN0YW5jZS5jbG9zZUljb24gPSB0aGlzLl9jb25maWcuY2xvc2VJY29uO1xuICAgIGxpZ2h0Ym94UmVmLmluc3RhbmNlLnJvbGUgPSB0aGlzLl9jb25maWcucm9sZTtcbiAgICBsaWdodGJveFJlZi5pbnN0YW5jZS5hcmlhTGFiZWwgPSB0aGlzLl9jb25maWcuYXJpYUxhYmVsO1xuICAgIGxpZ2h0Ym94UmVmLmluc3RhbmNlLmFyaWFMYWJlbGxlZEJ5ID0gdGhpcy5fY29uZmlnLmFyaWFMYWJlbGxlZEJ5O1xuICAgIGxpZ2h0Ym94UmVmLmluc3RhbmNlLmFyaWFEZXNjcmliZWRCeSA9IHRoaXMuX2NvbmZpZy5hcmlhRGVzY3JpYmVkQnk7XG5cbiAgICBpZiAoX2NvbmZpZy5oYXNCYWNrZHJvcCkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5iYWNrZHJvcENsaWNrKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2UoKSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGtleWJvYXJkIHNob3J0Y3V0c1xuICAgIGlmIChfY29uZmlnLmtleWJvYXJkU2hvcnRjdXRzKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUoKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICAgICAgZ2FsbGVyeVJlZi5wcmV2KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICAgICAgZ2FsbGVyeVJlZi5uZXh0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEVTQ0FQRTpcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlIExpZ2h0Ym94IE92ZXJsYXlcbiAgICovXG4gIGNsb3NlKCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgfVxuICB9XG59XG4iXX0=
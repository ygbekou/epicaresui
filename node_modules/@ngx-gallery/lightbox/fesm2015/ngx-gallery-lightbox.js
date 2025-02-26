import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ComponentPortal } from '@angular/cdk/portal';
import { LEFT_ARROW, RIGHT_ARROW, ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { FocusTrapFactory, A11yModule } from '@angular/cdk/a11y';
import { Gallery, GalleryModule } from '@ngx-gallery/core';
import { InjectionToken, Component, Optional, ChangeDetectionStrategy, ElementRef, Inject, Injectable, Directive, Input, Renderer2, NgModule } from '@angular/core';
import { Subject, fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const LIGHTBOX_CONFIG = new InjectionToken('lightboxConfig');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const lightboxAnimation = trigger('lightbox', [
    // Note: The `enter` animation transitions to `transform: none`, because for some reason
    // specifying the transform explicitly, causes IE both to blur the dialog content and
    // decimate the animation performance. Leaving it as `none` solves both issues.
    state('void, exit', style({ opacity: 0, transform: 'scale(0.7)' })),
    state('enter', style({ transform: 'none' })),
    transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({ transform: 'none', opacity: 1 }))),
    transition('* => void, * => exit', animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 }))),
]);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LightboxComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const defaultConfig = {
    backdropClass: 'g-backdrop',
    panelClass: 'g-overlay',
    hasBackdrop: true,
    keyboardShortcuts: true,
    role: 'lightbox',
    closeIcon: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512px" height="512px" enable-background="new 0 0 47.971 47.971" version="1.1" viewBox="0 0 47.971 47.971" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
	<path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88   c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z" fill="#fff"/>
</svg>
`
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Lightbox {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LightboxDirective {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LightboxModule {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { LIGHTBOX_CONFIG, LightboxComponent, Lightbox, LightboxModule, lightboxAnimation as ɵa, LightboxDirective as ɵb };

//# sourceMappingURL=ngx-gallery-lightbox.js.map
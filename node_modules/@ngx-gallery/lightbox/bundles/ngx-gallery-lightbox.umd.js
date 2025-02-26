(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/platform-browser'), require('@angular/common'), require('@angular/animations'), require('@angular/cdk/portal'), require('@angular/cdk/keycodes'), require('@angular/cdk/overlay'), require('@angular/cdk/a11y'), require('@ngx-gallery/core'), require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ngx-gallery/lightbox', ['exports', '@angular/platform-browser', '@angular/common', '@angular/animations', '@angular/cdk/portal', '@angular/cdk/keycodes', '@angular/cdk/overlay', '@angular/cdk/a11y', '@ngx-gallery/core', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (factory((global['ngx-gallery'] = global['ngx-gallery'] || {}, global['ngx-gallery'].lightbox = {}),global.ng.platformBrowser,global.ng.common,global.ng.animations,global.ng.cdk.portal,global.ng.cdk.keycodes,global.ng.cdk.overlay,global.ng.cdk.a11y,global.core,global.ng.core,global.rxjs,global.rxjs.operators));
}(this, (function (exports,platformBrowser,common,animations,portal,keycodes,overlay,a11y,core,core$1,rxjs,operators) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var LIGHTBOX_CONFIG = new core$1.InjectionToken('lightboxConfig');

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var lightboxAnimation = animations.trigger('lightbox', [
        // Note: The `enter` animation transitions to `transform: none`, because for some reason
        // specifying the transform explicitly, causes IE both to blur the dialog content and
        // decimate the animation performance. Leaving it as `none` solves both issues.
        animations.state('void, exit', animations.style({ opacity: 0, transform: 'scale(0.7)' })),
        animations.state('enter', animations.style({ transform: 'none' })),
        animations.transition('* => enter', animations.animate('150ms cubic-bezier(0, 0, 0.2, 1)', animations.style({ transform: 'none', opacity: 1 }))),
        animations.transition('* => void, * => exit', animations.animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', animations.style({ opacity: 0 }))),
    ]);

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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
                    this._elementFocusedBeforeDialogWasOpened = ( /** @type {?} */(this._document.activeElement));
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
            { type: core$1.Component, args: [{
                        selector: 'lightbox',
                        changeDetection: core$1.ChangeDetectionStrategy.OnPush,
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
        LightboxComponent.ctorParameters = function () {
            return [
                { type: undefined, decorators: [{ type: core$1.Optional }, { type: core$1.Inject, args: [common.DOCUMENT,] }] },
                { type: a11y.FocusTrapFactory },
                { type: core$1.ElementRef },
                { type: platformBrowser.DomSanitizer }
            ];
        };
        return LightboxComponent;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var defaultConfig = {
        backdropClass: 'g-backdrop',
        panelClass: 'g-overlay',
        hasBackdrop: true,
        keyboardShortcuts: true,
        role: 'lightbox',
        closeIcon: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg width=\"512px\" height=\"512px\" enable-background=\"new 0 0 47.971 47.971\" version=\"1.1\" viewBox=\"0 0 47.971 47.971\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\">\n\t<path d=\"M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88   c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z\" fill=\"#fff\"/>\n</svg>\n"
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var Lightbox = /** @class */ (function () {
        function Lightbox(config, _gallery, _overlay) {
            this._gallery = _gallery;
            this._overlay = _overlay;
            /**
             * Stream that emits when lightbox is opened
             */
            this.opened = new rxjs.Subject();
            /**
             * Stream that emits when lightbox is closed
             */
            this.closed = new rxjs.Subject();
            this._config = config ? __assign({}, defaultConfig, config) : defaultConfig;
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
                this._config = __assign({}, this._config, config);
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
                if (i === void 0) {
                    i = 0;
                }
                if (id === void 0) {
                    id = 'lightbox';
                }
                /** @type {?} */
                var _config = config ? __assign({}, this._config, config) : this._config;
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
                var galleryPortal = new portal.ComponentPortal(LightboxComponent);
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
                            case keycodes.LEFT_ARROW:
                                galleryRef.prev();
                                break;
                            case keycodes.RIGHT_ARROW:
                                galleryRef.next();
                                break;
                            case keycodes.ESCAPE:
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
            { type: core$1.Injectable }
        ];
        /** @nocollapse */
        Lightbox.ctorParameters = function () {
            return [
                { type: undefined, decorators: [{ type: core$1.Optional }, { type: core$1.Inject, args: [LIGHTBOX_CONFIG,] }] },
                { type: core.Gallery },
                { type: overlay.Overlay }
            ];
        };
        return Lightbox;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var LightboxDirective = /** @class */ (function () {
        function LightboxDirective(_lightbox, _el, _renderer) {
            this._lightbox = _lightbox;
            this._el = _el;
            this._renderer = _renderer;
            this.clickEvent = rxjs.Subscription.EMPTY;
            this.index = 0;
            this.id = 'root';
        }
        /**
         * @return {?}
         */
        LightboxDirective.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this._renderer.setStyle(this._el.nativeElement, 'cursor', 'pointer');
                this.clickEvent = rxjs.fromEvent(this._el.nativeElement, 'click').pipe(operators.tap(function () { return _this._lightbox.open(_this.index, _this.id); })).subscribe();
            };
        /**
         * @return {?}
         */
        LightboxDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.clickEvent.unsubscribe();
            };
        LightboxDirective.decorators = [
            { type: core$1.Directive, args: [{
                        selector: '[lightbox]'
                    },] }
        ];
        /** @nocollapse */
        LightboxDirective.ctorParameters = function () {
            return [
                { type: Lightbox },
                { type: core$1.ElementRef },
                { type: core$1.Renderer2 }
            ];
        };
        LightboxDirective.propDecorators = {
            index: [{ type: core$1.Input, args: ['lightbox',] }],
            id: [{ type: core$1.Input, args: ['gallery',] }]
        };
        return LightboxDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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
            { type: core$1.NgModule, args: [{
                        imports: [
                            overlay.OverlayModule,
                            core.GalleryModule,
                            a11y.A11yModule
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.LIGHTBOX_CONFIG = LIGHTBOX_CONFIG;
    exports.LightboxComponent = LightboxComponent;
    exports.Lightbox = Lightbox;
    exports.LightboxModule = LightboxModule;
    exports.ɵa = lightboxAnimation;
    exports.ɵb = LightboxDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=ngx-gallery-lightbox.umd.js.map
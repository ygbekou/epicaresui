import { ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AnimationEvent } from '@angular/animations';
import { OverlayRef } from '@angular/cdk/overlay';
import { FocusTrapFactory } from '@angular/cdk/a11y';
export declare class LightboxComponent {
    private _document;
    private _focusTrapFactory;
    private _elementRef;
    sanitizer: DomSanitizer;
    /** Gallery ref id */
    id: string;
    /** Overlay ref to close the lightbox */
    overlayRef: OverlayRef;
    /** Close button svg data */
    closeIcon: string;
    /** State of the lightbox animation. */
    state: 'void' | 'enter' | 'exit';
    /** The ARIA role of the lightbox element. */
    role: string;
    /** Aria label to assign to the lightbox element */
    ariaLabel: string;
    /** ID of the element that should be considered as the lightbox's label. */
    ariaLabelledBy: string;
    /** ID of the element that describes the lightbox. */
    ariaDescribedBy: string;
    /** The class that traps and manages focus within the lightbox. */
    private _focusTrap;
    /** Element that was focused before the lightbox was opened. Save this to restore upon close. */
    private _elementFocusedBeforeDialogWasOpened;
    constructor(_document: any, _focusTrapFactory: FocusTrapFactory, _elementRef: ElementRef, sanitizer: DomSanitizer);
    /** Callback, invoked whenever an animation on the host completes. */
    onAnimationDone(event: AnimationEvent): void;
    /** Moves the focus inside the focus trap. */
    private _trapFocus;
    /** Saves a reference to the element that was focused before the lightbox was opened. */
    private _savePreviouslyFocusedElement;
    /** Restores focus to the element that was focused before the lightbox opened. */
    private _restoreFocus;
}

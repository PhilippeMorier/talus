import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentType } from '@angular/cdk/portal/portal';
import { Injectable, InjectionToken, Injector } from '@angular/core';

// Injection token that can be used to access the data that was passed in to an overlay.
export const UI_OVERLAY_DATA = new InjectionToken('UiOverlayData');

@Injectable()
export class UiFullscreenOverlayService {
  private readonly positionStrategy: GlobalPositionStrategy;
  private readonly overlayRef: OverlayRef;

  constructor(private readonly overlay: Overlay, private readonly injector: Injector) {
    this.positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.positionStrategy,
      disposeOnNavigation: true,
    });
  }

  // Inspired by: https://stackoverflow.com/a/51323813/3731530
  open<T>(component: ComponentType<T>, data: any): OverlayRef {
    const componentPortal = new ComponentPortal(component, undefined, this.createInjector(data));
    this.overlayRef.attach(componentPortal);

    return this.overlayRef;
  }

  private createInjector(data: any): PortalInjector {
    const injectorTokens = new WeakMap<any, any>([
      [UI_OVERLAY_DATA, data],
      [OverlayRef, this.overlayRef],
    ]);

    return new PortalInjector(this.injector, injectorTokens);
  }
}

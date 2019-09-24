import { MediaService } from './media.service';
import { InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

export const MEDIA_MODULE_FORROOT_GUARD = new InjectionToken<MediaModule>('MEDIA_MODULE_FORROOT_GUARD');

@NgModule()
export class MediaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MediaModule,
      providers: [
        {
          provide: MEDIA_MODULE_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[MediaModule, new Optional(), new SkipSelf()]]
        },
        MediaService
      ]
    };
  }
}

/**
 * Guard module from being initialized more than once
 * @param module - MediaModule instance
 */
export function provideForRootGuard(module: MediaModule): string {
  if (module) {
    throw new Error(
      `MediaModule.forRoot() called twice. This module should be initialized only once.`);
  }
  return 'guarded';
}

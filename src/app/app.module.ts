import{ NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { VRPlayer }  from './vr-player';

import { VgCore } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgSlidesModule } from 'videogular2/slides';

@NgModule({
    imports: [ BrowserModule, VgCore, VgControlsModule, VgOverlayPlayModule, VgSlidesModule ],
    declarations: [ VRPlayer ],
    bootstrap: [ VRPlayer ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

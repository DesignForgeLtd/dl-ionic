import { Injectable } from '@angular/core';

import { Viewport } from './map-scripts/viewport';

@Injectable({providedIn: 'root'})
export class MapGfxService {

    viewport: Viewport;
    context: CanvasRenderingContext2D;
    
    constructor(){}
}

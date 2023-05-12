import { Injectable } from '@angular/core';

import { Viewport } from './map-scripts/Viewport';

@Injectable({providedIn: 'root'})
export class MapGfxService {

    viewport: Viewport;
    context: CanvasRenderingContext2D;
    
    constructor(){}
}

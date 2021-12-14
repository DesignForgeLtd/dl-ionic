export class Viewport {

  /* The viewport (camera) is a rectangular region that defines the visible
  area of the map to be drawn. It's x, y coordinates are relative to the map
  itself, but you can easily draw its contents in a stationary location on screen,
  thus giving the effect of scrolling. */
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ){}

  scrollTo(x, y) {

    this.x = x - this.w * 0.5;// Rigid scrolling
    this.y = y - this.h * 0.5;

    // Smooth scrolling (forgot to put this in the video)
    //this.x += (x - this.x - this.w * 0.5) * 0.05;
    //this.y += (y - this.y - this.h * 0.5) * 0.05;
  }


}

export class Item{


  constructor(
    private id: number,
    private name: string
  ){}

  getName() {
    return this.name;
  }
}

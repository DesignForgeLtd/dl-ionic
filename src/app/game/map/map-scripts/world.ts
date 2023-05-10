import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})

export class World{

  public tiles: any;
  public columns: number;
  public rows: number;

  private level: number;

  constructor(level: number = 0, columns: number = 200, rows: number = 200) {
    this.tiles = new Array(columns * rows);
    this.level = level;
    this.columns = columns;
    this.rows = rows;
    //console.log('this.level: '+this.level);
  }

  setLevel(level){
    this.level = level;
  }

  populateMap(tiles){
    this.tiles = tiles.split('');
  }

  replaceTileInMap(position, tileString){
    this.tiles[position * 3] = tileString[0];
    this.tiles[position * 3 + 1] = tileString[1];
    this.tiles[position * 3 + 2] = tileString[2];
  }

  positionAccessible(position) {
// console.log('position: ' + position);
// console.log('this.tiles[position]: ' + this.tiles[position]);
    position *= 3; // because each tile map is described with 3 bytes (where 1st stands for the type of terrain)

    if (this.tiles[position] === 'w') { // water
      return 'the sea';
    }
    if (this.tiles[position] === 'g') { // mountains
      return 'the mountains';
    }
    if (this.tiles[position] === '8') { // city walls
      return 'city walls';
    }

    //|| this.world.tiles[position] === 'm' // city gate

    return true;
  }

	locationInfo(position)
	{
		if (this.level === 0)
		{
			switch(this.tiles[position*3])
			{


					case '0':

						return 'jesteś w miejscu zgonu monstrum';
						break;
					case '1':

						return 'jesteś w hucie stali';

						break;
					case '2':

						return 'jesteś w  chacie zielarza';
						break;
					case '3':
						switch(position)
						{
							case 26259:
								return 'jesteś przy hebanowcu';
								break;
							case 8478:
								return 'jesteś w kopalni węgla';
								break;
							case 32534:
								return 'jesteś w kopalni żelaza';
								break;
							case 30574:
								return 'jesteś w kopalni siarki';
								break;
							case 15970:
								return 'jesteś w kopalni złota';
								break;
							case 30083:
								return 'jesteś na polu kapusty';
								break;
							case 21526:
								return 'jesteś przy uprawach lnu';
								break;
							case 9138:
								return 'jesteś na plantacji kawy';
								break;
							case 8693:
								return 'jesteś w kamieniołomie';
								break;
							case 36251:
								return 'jesteś przy górskim potoku';
								break;
							case 8158:
								return 'jesteś przy litej skale';
								break;
							case 8955:
								return 'jesteś na plantacji tytoniu';
								break;
							case 12117:
								return 'jesteś przy osuwisku';
								break;
							case 12832:
								return 'jesteś na polu zboża';
								break;
							case 18780:
								return 'jesteś w olchowym zagajniku';
								break;
							case 27753:
								return 'jesteś w kryjówce goblinów';
								break;
							case 30743:
								return 'jesteś w arsenale krasnoludów';
								break;
							case 5457:
								return 'jesteś na zapomnianym łowisku';
								break;
							case 10766:
								return 'jesteś na morskim łowisku';
								break;
							case 25960:
								return 'jesteś na polu buraków';
								break;
							case 36078:
								return 'jesteś przy pasiece';
								break;
							default:
								return 'jesteś w ...';
								break;
						}
					case '4':

						return 'jesteś w banku';
						break;
					case '5':

						return 'jesteś przy portalu';
						break;
					case '6':

						return 'jesteś na pustyni';
						break;
					case 'r':

						return 'jesteś w rzece';
						break;
					case '8':
						return 'jesteś w krainie śniegu';
						break;
					case '9':
						return 'jesteś u szewca';
						break;
					case 'a':

						return 'jesteś w karczmie';
						break;
					case 'b':
						return 'jesteś na bagnach';
						 break;
					case 'c':
						 return 'jesteś na bazarze';
						 break;
					case 'd':
						return 'jesteś na drodze';
						break;
					case 'e': // lokacje produkcyjne
						switch(position)
						{
							case 28693:
								return 'jesteś w kuźni';     // kowal
								break;
							case 18840:
								return 'jesteś w starym młynie';     // młyn
								break;
							case 33219:
								return 'jesteś w zakładzie rzemieślniczym';     //
								break;
							case 13764:
								return 'jesteś w chacie zbrojmistrza';     //
								break;
							case 17666:
								return 'jesteś w chatcie myśliwego';     //
								break;
							case 21832:
								return 'jesteś u Zygmunta';     //
								break;
							case 32960:
								return 'jesteś w pracowni tarczmistrz';     //
								break;
							case 37441:
								return 'jesteś w laboratorium';     //
								break;
							case 5834:
								return 'jesteś w pracownia szłomnika';     //
								break;
							case 24766:
								return 'jesteś u tkacz';     //
								break;
							case 36773:
								return 'jesteś w chacie szewca';     //
								break;
							case 4023:
								return 'jesteś w chacie zielarza';     //
								break;
							case 14625:
								return 'jesteś u rybaka';     //
								break;
							case 22656:
								return 'jesteś w piekarni';     //
								break;
							case 23133:
								return 'jesteś w destylarni';     //
								break;
							case 3841:
								return 'jesteś u złotnika';     //
								break;
							case 35321:
								return 'jesteś w stolarni';     //
								break;
							case 24287:
								return 'jesteś w pracowni kołodzieja';     //
								break;
							case 13521:
								return 'jesteś u jubilera';     //
								break;
							case 11476:
								return 'jesteś w hucie stali';     //
								break;
							case 28271:
								return 'jesteś w pracowni łuczarza';     //
								break;
							case 31869:
								return 'jesteś w pracowni garbarza';     //
								break;
							case 37150:
								return 'jesteś w masarni';     //
								break;
							case 20772:
								return 'jesteś w gorzelni';     //
								break;
							default:
								return 'jesteś w...';     // default
								break;
						}
					 break;
					case 'f':
						return 'jesteś w stolarni';
						break;
					case 'g':
						return 'jesteś w górach';
						 break;
					case 'i':

						return 'jesteś w piekarni';
						break;
					case 'j':

						return 'jesteś w pracowni szlomnika';
						break;
					case 'k':

						return 'jesteś przy karawanie';		//karawana
						break;
					case 'l':

						return 'jesteś w lesie';
						break;
					case 'h':

						return 'jesteś w magazynie';
						 break;
					case 'm':

						return 'jesteś przybramie miasta';
						break;

					case 'n':
						return 'jesteś na wyżynie';
						 break;
					case 'o':
						return 'jesteś na kiermaszu';
						 break;
					case 'p':
						return 'jesteś na łące';
						 break;

					case '7':

						 return 'jesteś w rupieciarni';
						 break;
					case 's':
						switch(position)
						{
							case 5028:
							case 13559:
							case 19244:
							case 27487:
							case 34350:
								return 'jesteś przy ratuszu';
							break;
							case 28442:
								return 'jesteś przy Meltbudzie';
							break;
							case 37283:
								return 'jesteś przy Złomowisku';
							break;
							case 19442:
								return 'jesteś przy Giełdzie Monet Wartościowych';
							break;
							case 6831:
								return 'jesteś przy chowalni';
							break;
							case 15159:
								return 'jesteś przy Świątynii Ognia';
							break;
							case 19049:
								return 'jesteś przy Smoczym Koloseum';
							break;
							case 27083:
								return 'jesteś przy żerowisku';
							break;
							case 36153:
								return 'jesteś przy mordowni';
							break;
							case 6222:
								return 'jesteś w gildii magów';
							break;
							case 18250:
								return 'jesteś przy studni';
							break;
							case 30984:
								return 'jesteś w gildii wojowników';
							break;
							case 23876:
								return 'jesteś w gildii złodziei';
							break;
							case 14485:
								return 'jesteś w gildii kupców';
							break;
							case 33213:
								return 'jesteś w klasztorze';
							break;
							case 12171:
								return 'jesteś w chacie wiedźmy';
							break;
							case 13505:
								return 'jesteś w miejscu naprawy broni';
							break;
							case 38543:
								return 'jesteś w miejscu ulepszenia broni';
							break;
							case 13550:
								return 'jesteś w Diamentowym Domu Hazardu';
							break;
							case 6821:
								return 'jesteś przy Potwornej Otchłani';
							break;
							case 29472:
								return 'jesteś w mennicy';
							break;
							case 3634:
								return 'jesteś przy transformatorze';
							break;
							case 36481:
								return 'jesteś przy Deformatorze Formy';
								break;
							default:
								return 'jesteś w...';
							break;
						}
						break;
					case 't':
																	// port!
						return 'jesteś w porcie';
						break;
					case 'q':
																	// zbrojmistrz
						return 'jesteś w siedzibie klanu';
						break;

					case 'w':
						return 'jesteś w wodzie(!?)';
						 break;
					case 'u':
						return 'jesteś przy zejściu do podziemi';
						break;
					case 'v':

						 return 'jesteś w sklepie';
						 break;
					case 'x':

						return 'jesteś przy drogowskazie';
						break;
					case 'y':									// lokacja naukowa ogolna !!!
						return '';
						break;

					case 'z':

						return 'jesteś na polu zboża';
						break;

					default:      //this.tiles
						return '';
						 break;
			}
		}
		else if (this.level > 0)
		{
			switch(this.tiles[position*3])
			{
				case '0':
					return 'jesteś w miejscu zgonu monstrum';
				break;
				case 'u':
					return 'jesteś przy wyjściu z podziemi';
                                    break;
                                case 'd':
                                    return 'jesteś przy zejściu na kolejny poziom';
                                    break;
				case 'w':
					return 'jesteś w ścianie(!?)';
				break;
				default:      //chodnik
					return 'jesteś w katakumbach';
				 break;
			}
		}
		return '';
	}


drawTile(i, world = null)
{
	const szerokoscPola = 76;


	//var szerokoscPola = 76;
	//var szerokoscPola = 49;

  let link = '';

	if (this.level === 0)
	{
		switch(this.tiles[i])
		{
			default:
			case 'p':                                        //this.tiles

				link = (2 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

				link += '|||łąka';
			 break;
			case 'd':                                     // droga

				if (this.tiles[i+1] === 'a')
				{
          // taki zabieg bo nie zmieściły się drogi w tym samym rzędzie.
					link = (szerokoscPola)+'|'+(80+Number(this.tiles[i+2])) * szerokoscPola;
				}
				else
				{
					link = '0|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;
				}

				link += '|||droga';
			 break;
			case 'w':
				link = (10 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

				link += '|1'; // info ze nie mozna wejsc na to this.tiles

				link += '|||woda';
			 break;
			case 'l':

				link = (7 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

				link += '|||las';
			 break;
			case 'g':

				link = (6 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

				link += '|1'; // info ze nie mozna wejsc na to this.tiles

				link += '|||góry';
			break;

			case 'b':

				link = (5 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

				link += '|||bagno';
			break;

			case 'n':

				link = (3 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

				link += '|||wyżyna';
			 break;
			 case 'r':                                     // rzeka

				 link = (szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

					link += '|||rzeka';
			break;
			 case '6':                                     // pustynia

				 link = (4 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

					link += '|||pustynia';
				break;
			 case 'm':										// brama miasta
			 case '8':                                     // mury

				 link = (3 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

				 link += '|1'; // info ze nie mozna wejsc na to this.tiles

				 if (this.tiles[i] === '8'.toString())
					{link += '|||mury miejskie';}
				else
					{link += '|||brama miasta';}
			 break;
			case '0': // monstrum
				link = (11 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola + '|||monster';
				// console.log('i: ' + i);
				// console.log(link);

			 break;
			/*

			 case '1':
			 link = "./graphics/terrain/common.jpg|||huta stali";    // metalurg
			 break;
			case '2':
			 link = "./graphics/terrain/common.jpg|||chata zielarza";    // zielarz
			 break;
			*/
			case '3': // lokacje wydobywcze
				switch(i/3)
					{
						case 26259:
							link = (9 * szerokoscPola)+'|'+(48 * szerokoscPola);  // hebanowiec

							link += '|||hebanowiec';
							break;
						case 8478:
							link = (9 * szerokoscPola)+'|'+(45 * szerokoscPola) + '|||kopalnia węgla';
							break;
						case 32534:
							link = (9 * szerokoscPola)+'|'+(46 * szerokoscPola) + '|||kopalnia żelaza';
							break;
						case 30574:
							link = (9 * szerokoscPola)+'|'+(9 * szerokoscPola) + '|||kopalnia siarki';
							break;
						case 15970:
							link = (9 * szerokoscPola)+'|'+(27 * szerokoscPola) + '|||kopalnia złota';
							break;
						case 30083:
							link = (9 * szerokoscPola)+'|'+(78 * szerokoscPola) + '|||this.tiles kapusty';
							break;
						case 25960:
							link = (9 * szerokoscPola)+'|'+(79 * szerokoscPola) + '|||this.tiles buraków';
							break;
						case 21526:
							link = (9 * szerokoscPola)+'|'+(24 * szerokoscPola) + '|||uprawy lnu';
							break;
						case 9138:
							link = (9 * szerokoscPola)+'|'+(80 * szerokoscPola) + '|||plantacja kawy';
							break;
						case 8693:
							link = (9 * szerokoscPola)+'|'+(23 * szerokoscPola) + '|||kamieniołom';
							break;
						case 36251:
							link = (9 * szerokoscPola)+'|'+(66 * szerokoscPola) + '|||górski potok';
							break;
						case 8158:
							link = (9 * szerokoscPola)+'|'+(44 * szerokoscPola) + '|||lita skała';
							break;
						case 8955:
							link = (9 * szerokoscPola)+'|'+(26 * szerokoscPola) + '|||plantacja tytoniu';
							break;
						case 12117:
							link = (9 * szerokoscPola)+'|'+(42 * szerokoscPola) + '|||osuwisko';
							break;
						case 12832:
							link = (9 * szerokoscPola)+'|'+(41 * szerokoscPola) + '|||this.tiles zboża';
							break;
						case 18780:
							link = (9 * szerokoscPola)+'|'+(77 * szerokoscPola) + '|||olchowy zagajnik';
							break;
						case 27753:
							link = (9 * szerokoscPola)+'|'+(81 * szerokoscPola) + '|||kryjówka goblinów';
							break;
						case 30743:
							link = (9 * szerokoscPola)+'|'+(84 * szerokoscPola) + '|||arsenał krasnoludów';
							break;
						case 5457:
							link = (9 * szerokoscPola)+'|'+(86 * szerokoscPola) + '|||zapomniane łowisko';
							break;
						case 10766:
							link = (9 * szerokoscPola)+'|'+(87 * szerokoscPola) + '|||morskie łowisko';
							break;
						case 36078:
							link = (9 * szerokoscPola)+'|'+(76 * szerokoscPola) + '|||pasieka';
							break;
						default:
							link = (9 * szerokoscPola)+'|'+(14 * szerokoscPola) + '|||...';
							break;
					}
			 break;
			case '4':
			 link = (9 * szerokoscPola)+'|'+(20 * szerokoscPola) +'|||bank';    // bank
			 break;
			case '5':
			 link = (9 * szerokoscPola)+'|'+(63 * szerokoscPola) +'|||portal';    // portal
			 break;
			case 'q':
				link = (2 * szerokoscPola)+'|'+(79 * szerokoscPola) +'|||siedziba klanu';    // klan
			 break;

			case 'e': // lokacje produkcyjne
				switch(i/3)
				{
					case 28693:
						link = (9 * szerokoscPola)+'|'+(29 * szerokoscPola) +'|||kuźnia';     // kowal
						break;
					case 18840:
						link = (9 * szerokoscPola)+'|'+(50 * szerokoscPola) +'|||stary młyn';     // młyn
						break;
					case 33219:
						link = (9 * szerokoscPola)+'|'+(1 * szerokoscPola) +'|||zakład rzemieślniczy';     //
						break;
					case 13764:
						link = (9 * szerokoscPola)+'|'+(2 * szerokoscPola) +'|||chata zbrojmistrza';     //
						break;
					case 17666:
						link = (9 * szerokoscPola)+'|'+(3 * szerokoscPola) +'|||chata myśliwego';     //
						break;
					case 21832:
						link = (9 * szerokoscPola)+'|'+(12 * szerokoscPola) +'|||oberża u Zygmunta';     //
						break;
					case 32960:
						link = (9 * szerokoscPola)+'|'+(14 * szerokoscPola) +'|||tarczmistrz';     //
						break;
					case 37441:
						link = (9 * szerokoscPola)+'|'+(15 * szerokoscPola) +'|||laboratorium alchemiczne';     //
						break;
					case 5834:
						link = (9 * szerokoscPola)+'|'+(19 * szerokoscPola) +'|||pracownia szłomnika';     //
						break;
					case 24766:
						link = (9 * szerokoscPola)+'|'+(32 * szerokoscPola) +'|||tkacz';     //
						break;
					case 36773:
						link = (9 * szerokoscPola)+'|'+(36 * szerokoscPola) +'|||chata szewca';     //
						break;
					case 4023:
						link = (9 * szerokoscPola)+'|'+(40 * szerokoscPola) +'|||chata zielarza';     //
						break;
					case 14625:
						link = (9 * szerokoscPola)+'|'+(59 * szerokoscPola) +'|||rybak';     //
						break;
					case 22656:
						link = (9 * szerokoscPola)+'|'+(60 * szerokoscPola) +'|||piekarnia';     //
						break;
					case 23133:
						link = (9 * szerokoscPola)+'|'+(61 * szerokoscPola) +'|||destylarnia';     //
						break;
					case 3841:
						link = (9 * szerokoscPola)+'|'+(62 * szerokoscPola) +'|||złotnik';     //
						break;
					case 35321:
						link = (9 * szerokoscPola)+'|'+(64 * szerokoscPola) +'|||stolarnia';     //
						break;
					case 24287:
						link = (9 * szerokoscPola)+'|'+(65 * szerokoscPola) +'|||pracownia kołodzieja';     //
						break;
					case 13521:
						link = (9 * szerokoscPola)+'|'+(68 * szerokoscPola) +'|||jubiler';     //
						break;
					case 11476:
						link = (9 * szerokoscPola)+'|'+(70 * szerokoscPola) +'|||huta stali';     //
						break;
					case 28271:
						link = (9 * szerokoscPola)+'|'+(71 * szerokoscPola) +'|||pracownia łuczarza';     //
						break;
					case 31869:
						link = (9 * szerokoscPola)+'|'+(72 * szerokoscPola) +'|||pracownia garbarza';     //
						break;
					case 37150:
						link = (9 * szerokoscPola)+'|'+(73 * szerokoscPola) +'|||masarnia';     //
						break;
					case 20772:
						link = (9 * szerokoscPola)+'|'+(74 * szerokoscPola) +'|||gorzelnia';     //
						break;
					default:
						link = (9 * szerokoscPola)+'|'+(1 * szerokoscPola) +'|||...';     // default
						break;
				}
			 break;
			case 'o':
			 link = (9 * szerokoscPola)+'|'+(31 * szerokoscPola) +'|||kiermasz uzbrojenia';     // osada
			 break;
			 case 'v':
			 link = (9 * szerokoscPola)+'|'+(0 * szerokoscPola) +'|||sklep';     // sklep
			 break;
			case '7':
			 link = (9 * szerokoscPola)+'|'+(17 * szerokoscPola) +'|||zbrojownia';     // rupieciarnia
			 break;
			case 's':
				switch(i/3)
				{
					case 5028:
					case 13559:
					case 19244:
					case 27487:
					case 34350:
						link = (9 * szerokoscPola)+'|'+(38 * szerokoscPola) +'|||ratusz';     // ratusz
					break;
					case 28442:
						link = (9 * szerokoscPola)+'|'+(70 * szerokoscPola) +'|||Meltbuda';     // meltbuda
					break;
					case 37283:
						link = (9 * szerokoscPola)+'|'+(52 * szerokoscPola) +'|||Złomowisko';     // zlomowisko
					break;
					case 19442:
						link = (9 * szerokoscPola)+'|'+(39 * szerokoscPola) +'|||Giełda Monet Wartościowych';     // kiermasz monet
					break;
					case 6831:
						link = (9 * szerokoscPola)+'|'+(21 * szerokoscPola) +'|||chowalnia';     // chowalnia
					break;
					case 15159:
						link = (9 * szerokoscPola)+'|'+(21 * szerokoscPola) +'|||Świątynia Ognia';     // flaminarium
					break;
					case 19049:
						link = (9 * szerokoscPola)+'|'+(18 * szerokoscPola) +'|||Smocze Koloseum';     // koloseum
					break;
					case 27083:
						link = (9 * szerokoscPola)+'|'+(11 * szerokoscPola) +'|||żerowisko';     // zerowisko
					break;
					case 36153:
						link = (9 * szerokoscPola)+'|'+(82 * szerokoscPola) +'|||mordownia';     // mordownia
					break;
					case 18250:
						link = (9 * szerokoscPola)+'|'+(53 * szerokoscPola) +'|||studnia';     // studnia
					break;
					case 30984:
						link = (9 * szerokoscPola)+'|'+(52 * szerokoscPola) +'|||gildia wojowników';     // gildia wojowników
					break;
					case 23876:
						link = (9 * szerokoscPola)+'|'+(33 * szerokoscPola) +'|||gildia złodziei';     // gildia złodziei
					break;
					case 14485:
						link = (9 * szerokoscPola)+'|'+(39 * szerokoscPola) +'|||gildia kupców';     // gildia kupców
					break;
					case 12171:
						link = (9 * szerokoscPola)+'|'+(6 * szerokoscPola) +'|||chata wiedźmy';     // chata wiedźmy
					break;


					case 6222:
						link = (9 * szerokoscPola)+'|'+(16 * szerokoscPola) +'|||gildia magów';
					break;

					case 33213:
						link = (9 * szerokoscPola)+'|'+(85 * szerokoscPola) +'|||klasztorze';
					break;

					case 13505:
						link = (9 * szerokoscPola)+'|'+(37 * szerokoscPola) +'|||miejsce naprawy broni';
					break;
					case 38543:
						link = (9 * szerokoscPola)+'|'+(34 * szerokoscPola) +'|||miejsce ulepszenia broni';
					break;
					case 13550:
						link = (9 * szerokoscPola)+'|'+(68 * szerokoscPola) +'|||Diamentowy Domu Hazardu';
					break;
					case 6821:
						link = (9 * szerokoscPola)+'|'+(10 * szerokoscPola) +'|||Potworna Otchłań';
					break;
					case 29472:
						link = (9 * szerokoscPola)+'|'+(83 * szerokoscPola) +'|||mennica';
					break;
					case 3634:
						link = (9 * szerokoscPola)+'|'+(22 * szerokoscPola) +'|||transformator';
					break;
					case 36481:
						link = (9 * szerokoscPola)+'|'+(34 * szerokoscPola) +'|||Deformator Formy'; // 36481 - Deformator formy
						break;

					default:
						link = (9 * szerokoscPola)+'|'+(6 * szerokoscPola) +'|||';     // inne
					break;
				}
			 break;
			case 't':
        let nrpolaportu;
				if ((this.tiles[i-3])==='p' || (this.tiles[i-3])==='d')       //  port prawy
					{nrpolaportu = 56;}
				  else
				if ((this.tiles[i+3])==='p' || (this.tiles[i+3])==='d')       //  port lewy
					{nrpolaportu = 54;}
				  else
				if ((this.tiles[i-300])==='p' || (this.tiles[i-300])==='d')       //  port dolny
					{nrpolaportu = 55;}
				  else
				if ((this.tiles[i+300])==='p' || (this.tiles[i+300])==='d')       //  port górny
					{nrpolaportu = 57;}
					else
						{nrpolaportu = 57;}
				link = (9 * szerokoscPola)+'|'+(nrpolaportu * szerokoscPola) +'|||port';   // port
			 break;
			case 'a':
				link = (9 * szerokoscPola)+'|'+(67 * szerokoscPola) +'|||karczma';     // karczma
			 break;
			case 'h':
				link = (9 * szerokoscPola)+'|'+(49 * szerokoscPola) +'|||magazyn';      // magazyn
			 break;
			case 'i':

			 break;
			case 'c':
				link = (9 * szerokoscPola)+'|'+(30 * szerokoscPola) +'|||bazar';     // bazar
			 break;

			case 'k':

					link = (9 * szerokoscPola)+'|'+(75 * szerokoscPola) +'|||karawana';     // karawana
				break;

			break;
			case 'x':
			 link = (9 * szerokoscPola)+'|'+(69 * szerokoscPola) +'|||drogowskaz';     // drogowskaz
			 break;
			case 'y':
				 switch (i/3)
				 {
					case 16451:
						link = (9 * szerokoscPola)+'|'+(13 * szerokoscPola) +'|||chata drwala';     //drwal
						break;
					case 14625:
						link = (9 * szerokoscPola)+'|'+(15 * szerokoscPola) +'|||chata rybaka';     //rybak
						break;
					case 27042:
						link = (9 * szerokoscPola)+'|'+(3 * szerokoscPola) +'|||chata rolnika';     // rolnik
						break;
					case 17666:
						link = (9 * szerokoscPola)+'|'+(3 * szerokoscPola) +'|||chata myśliwego';     // mysliwy
						break;
					case 6275:
						link = (9 * szerokoscPola)+'|'+(3 * szerokoscPola) +'|||chata starego Bagasa';     // nauka wegla
						break;
					case 4490:
						link = (9 * szerokoscPola)+'|'+(3 * szerokoscPola) +'|||chata wuja Sama';     // nauka zelaza
						break;
					case 28767:
						link = (9 * szerokoscPola)+'|'+(3 * szerokoscPola) +'|||chata Gbura';     // nauka gornika siarki
						break;
					case 3445:
						link = (9 * szerokoscPola)+'|'+(3 * szerokoscPola) +'|||pałacyk Medasa';     // nauka gornika zlota
						break;
					case 21753:
						link = (9 * szerokoscPola)+'|'+(3 * szerokoscPola) +'|||chatka bartnika';     // nauka pszczelarstwa
						break;
				}
			break;
			case 'u':
			 link = (9 * szerokoscPola)+'|'+(58 * szerokoscPola) +'|||zejscie do podziemi';     // zejscie do podziemi

			 break;
			case 'z':
        link = (9 * szerokoscPola)+'|'+(48 * szerokoscPola);  // hebanowiec

							link += '|||hebanowiec';
			 break;

		}

	}
	else if (this.level > 0)
	{
		switch(this.tiles[i])
		{

			case 'w': // ściana

				link = (8 * szerokoscPola)+'|'+(4*szerokoscPola)+'|||ściana'; // ściana

			 break;
			case 'p':                                        //chodnik

				link = (8 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;

				link += '|||chodnik';
			 break;
			case '0': // monstrum

				link = (11 * szerokoscPola)+'|' + 'monster';

			 break;
 			case 'u':// wyjście z  podziemi

				link = (8 * szerokoscPola)+'|'+Number(this.tiles[i+2]) * szerokoscPola;
				link += '|||wyjście z podziemi';

				break;
 			case 'd':// zejscie na kolejny poziom  podziemi

				link = (8 * szerokoscPola)+'|'+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola;
				link += '|||zejście na kolejny poziom podziemi';

				break;
		}
	}

	return link;
}




drawMonster(position)
{
	return '';
	// var i = position * 3;
	//  return (4 * szerokoscPola)+"|"+(Number(this.tiles[i+1])*10+Number(this.tiles[i+2])) * szerokoscPola += "|||pustynia";
	// //console.log(position);
	//console.log(monsters);

	// switch ($row[6])
	// {
	// 	case 19253: $locationPicture = '';$txt_num=0; break;	// Rzeźnik Szuwarek
	// 	case 9483: $locationPicture = '';$txt_num=1; break;	// Gnom Drapher
	// 	case 7845: $locationPicture = '';$txt_num=2; break;	// Magus Surivus
	// 	case 4637: $locationPicture = '';$txt_num=3; break;	// Skurczybyk
	// 	case 37044: $locationPicture = '';$txt_num=6; break; //	Cyklop
	// 	case 25734: $locationPicture = '';$txt_num=7; break; //	Wipper
	// 	case 36233: $locationPicture = '';$txt_num=8; break; //	Karaczan
	// 	case 31429: $locationPicture = '';$txt_num=9; break; //	Midas
	// 	case 8270: $locationPicture = '';$txt_num=11; break; //	Zielony Smok
	// 	case 22382: $locationPicture = '';$txt_num=12; break; //	Bagienny Smok
	// 	case 35764: $locationPicture = '';$txt_num=13; break; //	Kościany Smok
	// 	case 30572: $locationPicture = '';$txt_num=17; break; //	Gryf
	// 	case 14114: $locationPicture = '';$txt_num=19; break; //	Behemot
	// 	case 36892: $locationPicture = '';$txt_num=20; break; //	Kamienny Strażnik
	// 	case 37673: $locationPicture = '';$txt_num=21; break; //	Olbrzymi Szkielet
	// 	case 35686: $locationPicture = '';$txt_num=23; break; //	Zły Baboch
	// 	case 16171: $locationPicture = '';$txt_num=24; break; //	Wywerna Królewska
	// 	case 50072: $locationPicture = '';$txt_num=25; break; //	Smoczyca
	// 	case 4929: $locationPicture = '';$txt_num=27; break; //	Syrena
	// 	case 7957: $locationPicture = '';$txt_num=28; break; //	Golem
	// 	case 7540: $locationPicture = '';$txt_num=27; break; //	Feniks
	// 	case 31055:	$locationPicture = '';$txt_num=30; break; //Cementar
	// 	case 3625: $locationPicture = '';$txt_num=31; break; //Hekate
	// 	case 11908:	$locationPicture = '';$txt_num=32; break; //Czarny Smok
	// 	default: $locationPicture = '';$txt_num=100; break;
	// }
}


}

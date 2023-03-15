
export interface PlayerData{
    energy: number;
    health: number;
    id: number;
    level: number;
    race_id: number;
    hero_level: number;
    name: string;
    occupied_with: string;
    occupation_start: string;
    occupation_finish: string;
    position: number;
    stamina: number;
    positionInMine: number;
  }
  
  export interface HeroFullData{
    energy: number;
    health: number;
    id: number;
    level: number;
    name: string;
    occupied_with: string;
    position: number;
    stamina: number;
  }
  
  export interface FoundLocationData{
    coords: string;
    description: string;
    id: number;
    name: string;
    position: number;
    type: number;
  }
  
  export interface FoundMonsterData{
    aktywny: string;
    opis: string;
    ostatnioZabil: string;
    alive: boolean;
  }
  
  export interface StrollEventData{
    type: string;
    data: JSON;//json
  }
  
  export interface MapResponseData{
    'success': boolean;
    'errorMessage': string;
    'playerData': PlayerData;
    'foundLocation': FoundLocationData;
    'foundMonster': FoundMonsterData;
    'foundQuest': boolean;
    'strollEvent': StrollEventData;
  }
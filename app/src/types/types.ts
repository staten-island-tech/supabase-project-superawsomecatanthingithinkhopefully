
export interface RoomInfo {
  id: string;
  number_player: number;
  turn_number:number

}
export interface profileType {
  id: string;
  username: string;
  wins:number;
  losses:number
  

}
export interface AuthForm {
  username: string
  email: string
  password: string
}
export interface Hosttype {
  user_id: string,
  id: string,
}
export interface Name_TagType{
  username: string,
  id: string}
export interface Tiles{
  resource:string
  quantity?:number
  number:number|null
  position?:{row:number,column:number}
  settlements?:string[]
  vertex?:{row:number,column:number}[]
}

export interface Vertices{
  position:{
    row:number
    column:number
  }
  vertex:{
    row:number
    column:number
  }[]
}

export interface roomPlayers{
  game_id:string,
  player_id_game:string,
  turn_order:number,
  vp:number,
  wood:number,
  brick:number,
  sheep:number,
  ore:number,
  wheat:number,

}


export interface RoomInfo {
  id: string;
  number_player: number;
  round:number;
  turn_index:number


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
export interface Vertex{
  row:number,
  column:number
}
export interface road{
  game_id:string,
  player_id:string,
  from:Vertex,
  to:Vertex,
}
export interface Settlement{
  player_id:string,
  position:{row:number,column:number},
  isCity:boolean
}
export interface Trade {
  id: string            
  game_id: string        
  init_id: string        
  init_type: string      
  init_quant: number     
  recieve_type: string   
  recieve_quant: number  
}
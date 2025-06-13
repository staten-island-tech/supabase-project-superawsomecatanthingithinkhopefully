
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
  losses:number;
  profile_pic: string;
  

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
  id: string
}

export interface Tiles{
  resource:string
  quantity?:number
  number:number|null
  position?:{row:number,column:number}
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
  color: string,
  username: string,

}
export interface Vertex{
  row:number,
  column:number
}
export interface road{
  
  from:Vertex,
  to:Vertex,
}
export interface Settlement{
  player_id:string,
  row:number
  column:number
  is_city:boolean,
  color:string,
  id?:string
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

export interface player_card{
  username: string,
  color: string,
}

export interface GamePlayer{
  game_id: string
  player_id_game: string
  color: string | null
}
export interface playerRoad {
  position:string
  from:Vertex
  to:Vertex
  player_id:string
  color:string
}



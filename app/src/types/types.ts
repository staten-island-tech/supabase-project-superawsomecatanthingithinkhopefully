
export interface RoomInfo {
  id: string;
  number_player: number;

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
}

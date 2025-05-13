export interface ClientDto {
  Id: number;
  Name: string;
  Code?: string;
}

export interface SaveClientDto{
  Id: number;
  Name: string;
  Code?: string;
  ApplicationIds : number[];
}
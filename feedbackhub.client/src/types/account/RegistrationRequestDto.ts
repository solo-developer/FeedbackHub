import { ClientDto } from "../client/ClientDto";

export interface RegistrationRequestDto {
    Id: number;
    Name: string;
    Email: object;
    IsUser: boolean;
    RequestedAt : Date;
    Client : ClientDto
  }
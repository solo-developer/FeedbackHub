import { ClientDto } from "../client/ClientDto";

export interface RegistrationRequestDto {
    Id: number;
    Name: string;
    Email: string;
    IsUser: boolean;
    RequestedAt : Date;
    Client : ClientDto
  }
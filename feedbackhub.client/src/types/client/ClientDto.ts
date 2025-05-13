import { ApplicationDto } from "../application/ApplicationDto";

export interface ClientDto {
  Id: number;
  Name: string;
  Code?: string;
  SubscribedApplications : ApplicationDto[]
}
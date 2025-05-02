import { ApplicationDto } from '../types/application/ApplicationDto';

let selectedApp: ApplicationDto | undefined = undefined;

export const setGlobalSelectedApp = (app: ApplicationDto) => {
  selectedApp = app;
};

export const getApplicationId = (): string | undefined => {
  return selectedApp?.Id?.toString(); 
};

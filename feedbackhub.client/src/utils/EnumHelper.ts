export interface DropdownOption {
    value: number;
    label: string;
  }
  
  export function EnumToDropdownOptions<T extends object>(enumObj: T): DropdownOption[] {
    return Object.keys(enumObj)
      .filter(key => !isNaN(Number(enumObj[key as keyof T]))) // filter only numeric values
      .map(key => ({
        value: enumObj[key as keyof T] as unknown as number,
        label: key,
      }));
  }
  
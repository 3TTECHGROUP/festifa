import { TEMP_CONST_WEDDING, TEMP_CONST_BIRTHDAY } from './temp.const';


export const TEMPLATE_REGISTRY = {
  wedding: TEMP_CONST_WEDDING,
  birthday: TEMP_CONST_BIRTHDAY,
} as const;

export type Category = keyof typeof TEMPLATE_REGISTRY;
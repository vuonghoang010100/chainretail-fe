import { normalizeString } from "@/utils";

export const filterOption = (input, option) =>
  normalizeString(option.label).includes(normalizeString(input));

export { SelectProvince, SelectDistrict } from "./SelectLocation";
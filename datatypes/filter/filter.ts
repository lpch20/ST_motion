import { FilterStep } from "./filter-step";

export interface Filter extends FilterStep {
  group: number;
  order: number;
}
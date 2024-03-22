import { Filter } from "./filter";
import { FilterProgress } from "./filter-progress";

export interface Filters {
  group: number;
  filters: Filter[];
  userIds: number[];
}
export interface FiltersProgress {
  group: number;
  filters: FilterProgress[];
  userIds: number[];
}
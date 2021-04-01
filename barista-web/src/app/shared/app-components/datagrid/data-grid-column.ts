import { SelectItem, SelectItemGroup } from 'primeng/api';
import { TemplateRef } from '@angular/core';

export class DataGridColumn {
  // The backing field / data.
  field: string;

  // Header will be displayed in the column header.
  header: string;

  // Whether or not this entity can be sorted/filtered.
  sortable?: boolean;

  filter?: boolean;

  // One of { 'contains', 'startsWith', 'endsWith', 'equals', 'notEquals', 'in', 'lt', 'gt' }
  filterMatchMode?: string;

  // Static width of the column.
  width?: string;

  // Any styles to be applied outside of a .scss file.
  style?: string;

  // Apply a style class to the column.
  styleClass?: string;

  // The data type of the field. Could be 'numeric', 'currency', 'date', 'dropdown' etc.
  columnType?: string;

  dateFormat? = 'MM-dd-yyyy';

  // Boolean value for denoting a column is from an uploaded file
  uploadedColumn?: boolean;

  // Use this array as a mechanism to override default value within a grid display
  multiSelectOptions?: SelectItem[];

  defaultValue?: any;

  multiSelectOptionsGroup?: SelectItemGroup[];

  //Use this when you want to show dropdwons at row level as well
  enableAtRow?: boolean;

  cellTemplate?: TemplateRef<any>;

  constructor(dc: DataGridColumn) {
    Object.assign(this, dc);
  }
}

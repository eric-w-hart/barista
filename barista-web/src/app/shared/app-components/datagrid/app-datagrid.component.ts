import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
  HostListener,
  ViewEncapsulation,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { SelectItem, SortEvent } from 'primeng/api';
import { DataGridColumn } from './data-grid-column';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-datagrid',
  templateUrl: './app-datagrid.component.html',
  styleUrls: ['./app-datagrid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppDataGridComponent implements OnInit, OnChanges, AfterViewInit {
  // tslint:enable:no-output-native

  constructor() {}
  @Input() records: any[];
  @Input() columns: DataGridColumn[] = [];
  @Input() numColumnsShown?: number;
  @Input() tableLoading = true;
  @Input() hideTable? = false;
  @Input() sortMode? = 'single';
  @Input() enableCustomSort? = 'true';
  @Input() multiSortMeta?: any[] = [];
  @Input() defaultSortField?: string;
  @Input() defaultSortOrder?: number;
  @Input() rowsPerPageOptions?: number[] = [10, 25, 50, 75, 100, 500];
  @Input() rowsPerPageInitialValue? = 50;
  @Input() aggregateTitle?: string;
  @Input() aggregateValue? = 0;
  @Input() selectionEnabled? = false;
  @Input() exportEnabled? = true;
  @Input() clearfilterEnabled? = true;
  @Input() initialFilter?: string;
  @Input() columnOptionsEnabled? = true;
  @Input() totalRecorsDisplayEnabled? = true;
  @Input() paginatorEnabled? = true;
  @Input() showfilterOnHeaderRow? = true;
  @Input() hideRefresh? = true;
  @Input() hideExpandCollapse? = true;
  @Input() scrollable? = true;
  @Input() scrollHeightScale? = 0.7;
  @Input() selectedItems: any[] = [];
  @Input() lazyLoad?: boolean = false;
  @Input() totalRecords? = 0;
  @Input() rowDataColumnOptions?: SelectItem[] = [];
  @Input() showMultipleSelectionBox?: boolean = false;
  @Input() enableGlobalSearch: boolean = false;
  @Input() enableCaptionHeader: boolean = false;

  @Output() selectedItemsChange = new EventEmitter<any[]>();
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFiltersCleared: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRefreshClicked: EventEmitter<any> = new EventEmitter<any>();

  @Output() onCollapse: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowUnselected = new EventEmitter();
  @Output() onAddRecord = new EventEmitter();

  @Output() onLoadData: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();
  @Input() headerTemplate: TemplateRef<any>;

  @ViewChild('dt') dt: Table;
  @ViewChild('dropdownCol') dropdownCol: any;
  @ViewChild('groupDropdownCol') groupDropdownCol: any;
  @ViewChild('globalSearchBox') globalSearchBox: ElementRef;
  @ViewChild('tristatedropdown') tristatedropdown: any;
  @ViewChild('cellTemplate', { read: ViewContainerRef, static: true })
  selectedColumns: DataGridColumn[];

  ngOnDestroy(): void {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.initialFilter) {
      const filter = this.initialFilter.split('||');
      if (filter.length > 2) {
        this.dt.filter(filter[2], filter[0], filter[1]);
      }
      this.tableLoading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {}

  rowSelected(event) {
    this.onRowSelected.emit(event);
  }

  public refresh() {}

  clear(table: Table) {
    table.clear();
  }
}

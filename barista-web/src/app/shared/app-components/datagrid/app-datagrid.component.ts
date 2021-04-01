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
} from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { SelectItem, SortEvent } from 'primeng/api';
import { DataGridColumn } from './data-grid-column';

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
  @Input() attestationEnabled? = false;
  @Input() rowsPerPageOptions?: number[] = [10, 25, 50, 75, 100, 500];
  @Input() rowsPerPageInitialValue? = 50;
  @Input() aggregateTitle?: string;
  @Input() aggregateValue? = 0;
  @Input() actions?: SelectItem[] = [];
  @Input() rowActions?: string[] = [];
  @Input() selectionEnabled? = false;
  @Input() exportEnabled? = true;
  @Input() addRecordEnabled? = true;
  @Input() clearfilterEnabled? = true;
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

  @Output() selectedItemsChange = new EventEmitter<any[]>();
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFiltersCleared: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRefreshClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAttested: EventEmitter<any> = new EventEmitter<any>();
  @Output() onActionSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShowWorkflowDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCollapse: EventEmitter<any> = new EventEmitter<any>();
  @Output() onActionDeleteRow: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowUnselected = new EventEmitter();
  @Output() onAddRecord = new EventEmitter();
  @Output() onShowCobProgramsPickList: EventEmitter<any> = new EventEmitter<any>();

  @Output() onLoadData: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();
  @Input() headerTemplate: TemplateRef<any>;

  @ViewChild('dt') dt: any;
  @ViewChild('dropdownCol') dropdownCol: any;
  @ViewChild('groupDropdownCol') groupDropdownCol: any;
  @ViewChild('globalSearchBox') globalSearchBox: ElementRef;
  @ViewChild('tristatedropdown') tristatedropdown: any;

  selectedColumns: DataGridColumn[];

  ngOnDestroy(): void {}

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  rowSelected(event) {
    this.onRowSelected.emit(event);
  }
  public refresh() {}
}

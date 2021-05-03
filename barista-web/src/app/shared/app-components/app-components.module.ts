import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { AppDialogComponent } from '@app/shared/app-components/app-dialog/app-dialog.component';
import { BreadcrumbsComponent } from '@app/shared/app-components/breadcrumbs/breadcrumbs.component';
import { PieChartComponent } from '@app/shared/app-components/charts/pie-chart/pie-chart.component';
import { HorizontalBarChartComponent } from '@app/shared/app-components/charts/horizontal-bar-chart/horizontal-bar-chart.component';
import { BarChartComponent } from '@app/shared/app-components/charts/bar-chart/bar-chart.component';
import { GaugeChartComponent } from '@app/shared/app-components/charts/gauge-chart/gauge-chart.component';
import { AppDatatableComponent } from '@app/shared/app-components/datatable/app-datatable.component';
import { AppDataGridComponent } from '@app/shared/app-components/datagrid/app-datagrid.component';
import { DynamicMenuComponent } from '@app/shared/app-components/dynamic-menu/dynamic-menu.component';
import { GlobalInjectorModule } from '@app/shared/app-components/global-injector.module';
import { HelpMenuComponent } from '@app/shared/app-components/help-menu/help-menu.component';
import { LicenseScanResultItemDatatableComponent } from '@app/shared/app-components/license-scan-result-item-datatable/license-scan-result-item-datatable.component';
import { ProjectScanStatusTypeComponent } from '@app/shared/app-components/project-scan-status-type/project-scan-status-type.component';
import { AppMaterialModule } from '@app/shared/app-material.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LineChartComponent } from '@app/shared/app-components/charts/line-chart/line-chart.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

const expose = [
  AppDatatableComponent,
  AppDataGridComponent,
  AppDialogComponent,
  BreadcrumbsComponent,
  LicenseScanResultItemDatatableComponent,
  HorizontalBarChartComponent,
  BarChartComponent,
  PieChartComponent,
  GaugeChartComponent,
  LineChartComponent,
  ProjectScanStatusTypeComponent,
  HelpMenuComponent,
  DynamicMenuComponent,
];

@NgModule({
  declarations: expose,
  exports: expose,
  imports: [
    CommonModule,
    AppMaterialModule,
    NgxDatatableModule,
    NgxChartsModule,
    RouterModule,
    FlexLayoutModule,
    GlobalInjectorModule,
    TableModule,
    MultiSelectModule,
    ButtonModule,
    InputTextModule,
  ],
  providers: [],
})
export class AppComponentsModule {}

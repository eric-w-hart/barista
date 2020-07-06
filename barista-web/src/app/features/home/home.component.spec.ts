import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from '@app/shared/app-components/charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '@app/shared/app-components/charts/bar-chart/bar-chart.component'
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ModuleSearchComponent } from '@app/features/module-search/module-search.component';
import { ProjectStatusNormalComponent } from '@app/features/projects/project-details/project-status/project-status-normal/project-status-normal.component';
import { ProjectsComponent } from '@app/features/projects/projects.component';
import { entityConfig } from '@app/shared/+state/entity-metadata';
import { EntityStoreModule } from '@app/shared/+state/entity-store.module';
import { AppComponentsModule } from '@app/shared/app-components/app-components.module';
import { AppMaterialModule } from '@app/shared/app-material.module';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent, ProjectsComponent, ProjectStatusNormalComponent, ModuleSearchComponent],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        EntityDataModule.forRoot(entityConfig),
        EntityStoreModule,
        HttpClientTestingModule,
        LayoutModule,
        NgxDatatableModule,
        AppMaterialModule,
        AppComponentsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

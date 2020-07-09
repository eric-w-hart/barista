import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent } from '@app/shared/app-components/charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '@app/shared/app-components/charts/bar-chart/bar-chart.component'
import { GaugeChartComponent } from '@app/shared/app-components/charts/gauge-chart/gauge-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ProjectStatsComponent } from './project-stats.component';

describe('ProjectStatsComponent', () => {
  let component: ProjectStatsComponent;
  let fixture: ComponentFixture<ProjectStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxChartsModule],
      declarations: [
        ProjectStatsComponent,
        PieChartComponent,
        BarChartComponent,
        GaugeChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

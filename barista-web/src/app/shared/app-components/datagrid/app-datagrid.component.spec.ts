import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppDataGridComponent } from './app-datagrid.component';

describe('AppDatatableComponent', () => {
  let component: AppDataGridComponent;
  let fixture: ComponentFixture<AppDataGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxDatatableModule],
      declarations: [AppDataGridComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

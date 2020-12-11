import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanLogsComponent } from './scan-logs.component';

describe('ScanLogsComponent', () => {
  let component: ScanLogsComponent;
  let fixture: ComponentFixture<ScanLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

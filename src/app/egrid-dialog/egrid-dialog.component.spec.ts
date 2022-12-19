import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgridDialogComponent } from './egrid-dialog.component';

describe('EgridDialogComponent', () => {
  let component: EgridDialogComponent;
  let fixture: ComponentFixture<EgridDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EgridDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EgridDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

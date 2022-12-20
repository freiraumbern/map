import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquatDialogComponent } from './squat-dialog.component';

describe('SquatDialogComponent', () => {
  let component: SquatDialogComponent;
  let fixture: ComponentFixture<SquatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SquatDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SquatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

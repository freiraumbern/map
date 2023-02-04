import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColonialDialogComponent } from './colonial-dialog.component';

describe('ColonialDialogComponent', () => {
  let component: ColonialDialogComponent;
  let fixture: ComponentFixture<ColonialDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColonialDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColonialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

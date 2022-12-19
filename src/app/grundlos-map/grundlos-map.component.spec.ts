import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrundlosMapComponent } from './grundlos-map.component';

describe('GrundlosMapComponent', () => {
  let component: GrundlosMapComponent;
  let fixture: ComponentFixture<GrundlosMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrundlosMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrundlosMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

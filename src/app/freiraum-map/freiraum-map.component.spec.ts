import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreiraumMapComponent } from './freiraum-map.component';

describe('FreiraumMapComponent', () => {
  let component: FreiraumMapComponent;
  let fixture: ComponentFixture<FreiraumMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreiraumMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FreiraumMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

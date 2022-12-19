import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCaptionAreaComponent } from './map-caption-area.component';

describe('MapCaptionAreaComponent', () => {
  let component: MapCaptionAreaComponent;
  let fixture: ComponentFixture<MapCaptionAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapCaptionAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapCaptionAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, Input } from '@angular/core';
import { ByOwnerDataAggregation } from '../model/api';
import * as tinycolor from 'tinycolor2';

@Component({
  selector: 'app-map-caption-area',
  templateUrl: './map-caption-area.component.html',
  styleUrls: ['./map-caption-area.component.scss'],
})
export class MapCaptionAreaComponent {
  @Input() selection: ByOwnerDataAggregation[] = [];
  @Input() colors: string[] = [];

  getBackGroundColor(color: string): boolean {
    const tColor = tinycolor(color);
    return tColor.getBrightness() > 128;
  }
}

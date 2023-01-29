import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import {
  Map,
  LeafletEvent,
  Layer,
  LayerGroup,
  MapOptions,
  tileLayer,
  latLng,
  marker,
  Marker,
  LatLngTuple,
  DivIcon,
} from 'leaflet';
import { forkJoin } from 'rxjs';
import {
  ByOwnerDataAggregation,
  DataResponse,
  Femicide,
  Squat,
} from '../model/api';
import { HttpService } from '../http.service';
import { MatDialog } from '@angular/material/dialog';
import { EgridDialogComponent } from '../egrid-dialog/egrid-dialog.component';
import { SquatDialogComponent } from '../squat-dialog/squat-dialog.component';
import { interpolateRainbow } from 'd3-scale-chromatic';
import { Chance } from 'chance';

@Component({
  selector: 'app-freiraum-map',
  templateUrl: './freiraum-map.component.html',
  styleUrls: ['./freiraum-map.component.scss'],
})
export class FreiraumMapComponent implements OnDestroy, OnInit {
  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        opacity: 0.7,
        maxZoom: 19,
        detectRetina: true,
        attribution: '',
      }),
    ],
    zoom: 14,
    // center RS
    center: latLng(46.952899502247114, 7.440898726295784),
  };

  map: Map | undefined;

  zoom: number | undefined;

  /**
   * the full data organized in a mapy per egrid as key
   */
  egridData: DataResponse = {};

  /**
   * array of egrids per owner
   */
  byOwnerData: ByOwnerDataAggregation[] = [];

  /**
   * squats data
   */
  squatsData: Squat[] = [];

  /**
   * femicides data
   */
  femicides: Femicide[] = [];

  /**
   * selected entries
   */
  byOwnerSelection: ByOwnerDataAggregation[] = [];

  /**
   * a layer group per owner
   */
  byOwnerLayerGroups: LayerGroup<Marker>[] | null = null;

  /**
   * Squats data in one layer
   */
  squatsLayerGroup: LayerGroup<Marker> | null = null;

  /**
   * show the squats layer on the map
   */
  showSquats = true;

  /**
   * Femicides data in one layer
   */
  femicidesLayerGroup: LayerGroup<Marker> | null = null;

  /**
   * show the femicides layer on the map
   */
  showFemicides = true;

  /**
   * base layer
   */
  layers: Layer[] = [];

  dataIsReady = false;

  colors: string[] = [];

  constructor(
    private httpService: HttpService,
    private zone: NgZone,
    private dialog: MatDialog
  ) {
    for (let i = 0; i < 50; i++) {
      const value = (1 / 50) * i;
      this.colors.push(interpolateRainbow(value));
    }
    const chance = new Chance(19);
    this.colors = chance.shuffle(this.colors);
  }

  ngOnInit() {
    forkJoin(
      this.httpService.getData(),
      this.httpService.getDataByOwner(),
      this.httpService.getSquats(),
      this.httpService.getFemicides()
    ).subscribe(([egridData, byOwnerData, squats, femicides]) => {
      this.egridData = egridData;
      this.byOwnerData = byOwnerData;
      this.squatsData = squats;
      this.femicides = femicides;
      this.createSquatLayerGroup();
      this.createFemicideLayerGroup();
    });
  }

  createSquatLayerGroup() {
    const markers: Marker[] = [];
    this.squatsData.forEach(squat => {
      markers.push(
        marker([parseFloat(squat.lat), parseFloat(squat.long)], {
          icon: this.getSquatIcon(),
          title: squat.address + ', ' + squat.date,
        }).on('click', () => {
          this.zone.run(() => {
            this.dialog.open(SquatDialogComponent, {
              data: squat,
              width: '95vw',
              maxWidth: '100vw',
            });
          });
        })
      );
    });
    this.squatsLayerGroup = new LayerGroup(markers);
  }

  createFemicideLayerGroup() {
    const markers: Marker[] = [];
    this.femicides.forEach(femicide => {
      markers.push(
        marker([parseFloat(femicide.lat), parseFloat(femicide.long)], {
          icon: this.getFemicideIcon(),
          title: femicide.date,
        }).on('click', () => {
          this.zone.run(() => {
            this.dialog.open(SquatDialogComponent, {
              data: { ...femicide, address: 'Ungenaue Ortsangabe' },
              width: '95vw',
              maxWidth: '100vw',
            });
          });
        })
      );
    });
    this.femicidesLayerGroup = new LayerGroup(markers);
  }

  createOwnerLayerGroups(data: ByOwnerDataAggregation[]) {
    const ownerLayerGroups: LayerGroup<Marker>[] = [];
    data.forEach((ownerSet, i) => {
      const markers: Marker[] = [];
      ownerSet.egrids.forEach(egrid => {
        markers.push(
          marker(this.getEgridMarkerCoordinates(egrid), {
            icon: this.getDivIcon(this.colors[i]),
            title: ownerSet.owner,
          }).on('click', () => {
            this.zone.run(() => {
              this.dialog.open(EgridDialogComponent, {
                data: this.egridData[egrid],
                width: '95vw',
                maxWidth: '100vw',
              });
            });
          })
        );
      });
      ownerLayerGroups.push(new LayerGroup(markers));
    });
    this.byOwnerLayerGroups = ownerLayerGroups;
  }

  getEgridMarkerCoordinates(egrid: string): LatLngTuple {
    const entry = this.egridData[egrid];
    if (entry?.location?.centroid) {
      return [entry.location.centroid.x, entry.location.centroid.y];
    } else {
      return [0, 0];
    }
  }

  getDivIcon(color: string): DivIcon {
    const svg = `
    <svg viewBox="432.39 228.382 18.686 24.026" width="18.686" height="24.026">
      <path d="M 441.733 228.382 C 446.893 228.382 451.076 232.147 451.076 236.791 C 451.076 244.375 441.733 252.408 441.733 252.408 C 441.733 252.408 432.39 244.442 432.39 236.791 C 432.39 232.147 436.573 228.382 441.733 228.382 Z" fill="" style=""></path>
      <path d="M 441.642 229.484 C 446.226 229.484 449.943 232.829 449.943 236.955 C 449.943 243.693 441.642 250.83 441.642 250.83 C 441.642 250.83 433.341 243.752 433.341 236.955 C 433.341 232.829 437.057 229.484 441.642 229.484 Z" style="fill: ${color};"></path>
    </svg>`;
    return new DivIcon({ html: svg });
  }

  getSquatIcon(): DivIcon {
    const svg = `
    <svg viewBox="391.103 146.55 19.539 28.441" width="19.539" height="28.441">
      <g transform="matrix(0.002469, 0, 0, -0.002469, 391.001862, 175.089874)" fill="#000000" stroke="none" style="">
        <path d="M6785 11536 c-27 -13 -64 -39 -81 -57 -71 -76 -1611 -2088 -1636 -2138 -62 -120 -11 -257 117 -317 93 -44 202 -20 275 62 19 22 210 268 425 546 214 279 390 506 391 505 2 -2 -496 -1691 -511 -1734 -3 -9 -27 -2 -82 23 -397 183 -797 296 -1243 350 -178 22 -666 25 -835 6 -182 -21 -402 -59 -551 -96 -1511 -373 -2666 -1599 -2948 -3126 -47 -256 -60 -405 -60 -705 -1 -298 9 -433 50 -675 103 -614 352 -1198 723 -1698 33 -45 61 -87 61 -93 0 -6 -187 -469 -417 -1028 -281 -686 -418 -1031 -421 -1064 -13 -128 107 -257 238 -257 60 0 139 38 180 87 24 29 129 273 404 945 204 499 374 910 378 914 4 3 49 -32 100 -79 534 -491 1247 -842 1968 -966 255 -44 394 -55 690 -55 297 0 439 11 690 55 655 116 1257 389 1790 813 161 128 422 385 558 549 505 607 806 1312 898 2102 25 210 25 662 1 870 -82 688 -318 1308 -710 1859 -254 358 -603 705 -954 950 -46 32 -83 59 -83 61 0 10 501 1693 509 1710 8 16 10 13 10 -20 1 -22 12 -290 26 -595 28 -602 29 -609 89 -678 40 -45 118 -82 176 -82 93 0 189 70 225 163 16 43 15 94 -44 1378 -50 1087 -64 1342 -77 1378 -22 59 -69 110 -129 137 -65 31 -126 31 -190 0z m-2367 -3241 c311 -39 591 -111 878 -225 163 -65 327 -148 322 -163 -3 -7 -351 -1181 -774 -2609 -423 -1428 -770 -2594 -771 -2590 -4 10 -183 5452 -183 5543 l0 72 203 -6 c111 -3 257 -13 325 -22z m-1141 -67 c-82 -208 -2171 -5295 -2176 -5300 -4 -4 -41 50 -83 120 -264 442 -417 895 -480 1427 -17 145 -17 596 1 740 117 982 603 1832 1376 2410 170 127 301 209 491 307 241 125 453 206 719 277 123 33 160 37 152 19z m2909 -682 c652 -522 1103 -1291 1243 -2116 36 -214 46 -332 46 -590 0 -258 -10 -376 -46 -590 -97 -573 -344 -1123 -710 -1580 -78 -98 -235 -272 -294 -325 -331 -303 -549 -457 -883 -624 -378 -189 -861 -323 -1255 -347 -90 -6 -107 -5 -103 7 3 8 107 358 231 779 125 421 534 1802 910 3070 376 1268 691 2331 700 2363 9 31 20 57 24 57 4 0 66 -47 137 -104z m-2651 -3158 c52 -1587 95 -2914 95 -2948 l0 -62 -47 6 c-138 19 -306 50 -413 76 -618 151 -1201 483 -1647 938 l-81 83 25 62 c48 120 1944 4746 1962 4787 3 9 7 1 9 -20 1 -19 45 -1334 97 -2922z"></path>
      </g>
    </svg>
    `;
    return new DivIcon({ html: svg });
  }

  getFemicideIcon(): DivIcon {
    const svg = `
    <svg viewBox="0 0 500 500" width="40" height="80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g transform="matrix(0.046849, 0, 0, -0.046849, -261.937622, 654.270325)" fill="#6A4A94" stroke="none" style="">
        <path d="M 10462.96 13398.728 C 10264.455 13370.621 9791.907 13226.573 9656.642 13154.549 C 9565.295 13105.362 9396.653 12639.841 9228.012 11968.788 C 9108.557 11489.213 9092.747 11383.812 9082.207 11046.529 C 9062.883 10442.23 9175.311 9778.204 9354.493 9421.598 C 9377.33 9374.167 9484.487 9203.769 9591.645 9045.667 L 9784.88 8757.571 L 9735.693 8667.981 C 9661.912 8536.229 8730.87 6918.324 8470.881 6470.37 C 8072.114 5781.75 7601.323 4913.949 7601.323 4864.762 C 7601.323 4822.601 7731.318 4805.035 7924.553 4820.845 C 8191.569 4841.925 8414.667 4836.655 8472.638 4806.791 C 8532.365 4778.684 8604.389 4648.69 8734.384 4343.027 C 8887.215 3982.907 8953.969 3951.287 9066.397 4188.439 C 9147.204 4358.837 9419.49 4843.682 9714.613 5346.093 C 9839.337 5558.652 10132.703 6061.063 10362.829 6461.587 C 10594.711 6862.11 10791.459 7197.637 10798.486 7204.664 C 10805.513 7213.447 10854.7 7150.206 10905.644 7065.886 C 11070.772 6795.356 11820.876 5590.272 12119.512 5119.481 C 12275.857 4870.032 12469.092 4557.342 12546.386 4425.591 C 12757.188 4065.471 12788.808 4018.041 12818.672 4023.311 C 12871.372 4033.851 13040.014 4420.321 13126.091 4725.984 C 13141.901 4783.954 13166.495 4834.898 13185.818 4843.682 C 13203.385 4854.222 13382.567 4873.545 13584.585 4887.599 C 13955.246 4913.949 14041.323 4929.759 14058.89 4975.433 C 14064.16 4989.486 13978.082 5144.074 13858.628 5332.04 C 13382.567 6085.657 12939.883 6779.546 12827.455 6953.458 C 12762.458 7053.589 12599.086 7315.335 12467.335 7533.163 C 12182.752 8003.954 12059.785 8197.189 11847.226 8516.906 C 11759.392 8646.9 11689.124 8761.085 11689.124 8771.625 C 11689.124 8780.408 11764.662 8919.186 11856.009 9079.044 C 11947.357 9238.903 12128.295 9567.402 12260.046 9808.068 C 12479.632 10210.348 12502.469 10261.292 12537.602 10422.907 C 12592.06 10670.599 12604.356 11009.639 12563.953 11204.631 C 12518.279 11427.73 12467.335 11555.967 12230.183 12039.055 C 12112.485 12281.477 11968.437 12588.897 11912.223 12722.405 C 11808.579 12966.584 11808.579 12966.584 11694.395 13052.661 C 11451.972 13231.843 11126.986 13360.081 10807.27 13398.728 C 10631.601 13419.808 10605.251 13419.808 10462.96 13398.728 Z M 10970.641 13302.11 C 11137.526 13268.733 11360.625 13186.169 11481.836 13114.145 C 11596.02 13047.391 11608.317 13022.798 11815.606 12460.659 C 11894.656 12248.1 11970.194 12049.595 11984.247 12017.975 C 12008.841 11961.761 12008.841 11961.761 11966.68 11977.571 C 11943.843 11986.355 11894.656 12009.192 11857.766 12026.758 C 11747.095 12082.972 11415.082 12202.427 11264.007 12241.074 C 10837.133 12349.988 10378.639 12311.341 10009.736 12135.673 C 9804.204 12037.299 9447.597 11822.983 9301.792 11708.799 C 9264.902 11680.692 9235.038 11664.882 9235.038 11671.908 C 9235.038 11678.935 9266.659 11812.443 9305.306 11967.031 C 9403.68 12357.015 9560.025 12841.859 9632.049 12978.881 L 9691.776 13093.065 L 9890.281 13166.846 C 10361.072 13340.757 10619.305 13372.378 10970.641 13302.11 Z M 11228.874 12163.78 C 11325.491 12139.186 11460.756 12097.026 11531.023 12068.919 L 11655.747 12021.488 L 11562.643 11863.387 C 11513.456 11777.309 11293.871 11401.379 11079.555 11028.962 C 10863.483 10656.546 10677.275 10342.099 10666.735 10329.803 C 10621.061 10278.859 9837.581 11489.213 9725.153 11784.336 L 9693.533 11866.9 L 9837.581 11947.708 C 10043.112 12060.135 10143.243 12109.323 10253.914 12144.456 C 10526.2 12234.047 10923.211 12241.074 11228.874 12163.78 Z" style="fill: #6A4A94;"></path>
      </g>
    </svg>
    `;
    return new DivIcon({ html: svg });
  }

  onByOwnerSelected(selection: ByOwnerDataAggregation[]) {
    this.byOwnerSelection = selection;
    this.createOwnerLayerGroups(selection);
  }

  toggleSquats(show: boolean) {
    this.showSquats = show;
  }

  toggleFemicides(show: boolean) {
    this.showFemicides = show;
  }

  ngOnDestroy() {
    this.map?.clearAllEventListeners;
  }

  onMapReady(map: Map) {
    this.map = map as Map;
    this.zoom = (map as Map).getZoom();
  }

  onMapZoomEnd(e: LeafletEvent) {
    this.zoom = e.target.getZoom();
  }
}

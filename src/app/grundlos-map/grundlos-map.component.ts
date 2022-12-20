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
import { ByOwnerDataAggregation, DataResponse, Squat } from '../model/api';
import { HttpService } from '../http.service';
import { MatDialog } from '@angular/material/dialog';
import { EgridDialogComponent } from '../egrid-dialog/egrid-dialog.component';
import { SquatDialogComponent } from '../squat-dialog/squat-dialog.component';

@Component({
  selector: 'app-grundlos-map',
  templateUrl: './grundlos-map.component.html',
  styleUrls: ['./grundlos-map.component.scss'],
})
export class GrundlosMapComponent implements OnDestroy, OnInit {
  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        opacity: 0.7,
        maxZoom: 19,
        minZoom: 12,
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
   * base layer
   */
  layers: Layer[] = [];

  dataIsReady = false;

  colors = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'];

  constructor(
    private httpService: HttpService,
    private zone: NgZone,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    forkJoin(
      this.httpService.getData(),
      this.httpService.getDataByOwner(),
      this.httpService.getSquats()
    ).subscribe(([egridData, byOwnerData, squats]) => {
      this.egridData = egridData;
      this.byOwnerData = byOwnerData;
      this.squatsData = squats;
      this.createSquatLayerGroup();
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

  onByOwnerSelected(selection: ByOwnerDataAggregation[]) {
    this.byOwnerSelection = selection;
    this.createOwnerLayerGroups(selection);
  }

  toggleSquats(show: boolean) {
    this.showSquats = show;
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

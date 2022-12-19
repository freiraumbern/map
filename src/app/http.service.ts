import { Inject, Injectable } from '@angular/core';
import { ByOwnerDataAggregation, DataResponse, Squat } from './model/api';
import { HttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseHref = '';

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get<DataResponse>(
      this.getBaseUrl() + '/aggregated-results.json'
    );
  }

  getDataByOwner() {
    return this.http.get<ByOwnerDataAggregation[]>(
      this.getBaseUrl() + '/by-owners.json'
    );
  }

  getSquats() {
    return this.http.get<Squat[]>(this.getBaseUrl() + '/squats.json');
  }

  getBaseUrl(): string {
    console.log(this.baseHref);
    if (!isDevMode()) {
      return window.location.origin + '/map/assets/';
    }

    return window.location.origin + '/assets';
  }
}

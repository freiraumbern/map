import { Injectable } from '@angular/core';
import {
  ByOwnerDataAggregation,
  DataResponse,
  Femicide,
  Squat,
} from './model/api';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
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

  getFemicides() {
    return this.http.get<Femicide[]>(this.getBaseUrl() + '/femicide_bern.json');
  }

  getBaseUrl(): string {
    return '/assets';
  }
}

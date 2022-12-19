import { Injectable } from '@angular/core';
import { ByOwnerDataAggregation, DataResponse, Squat } from './model/api';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  /**
   * load prepared data from same host as frontend is served from
   */
  baseUrl = window.location.origin + '/assets';

  getData() {
    return this.http.get<DataResponse>(
      this.baseUrl + '/aggregated-results.json'
    );
  }

  getDataByOwner() {
    return this.http.get<ByOwnerDataAggregation[]>(
      this.baseUrl + '/by-owners.json'
    );
  }

  getSquats() {
    return this.http.get<Squat[]>(this.baseUrl + '/squats.json');
  }
}

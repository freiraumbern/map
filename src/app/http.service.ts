import { Inject, Injectable } from '@angular/core';
import { ByOwnerDataAggregation, DataResponse, Squat } from './model/api';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseHref = '';

  constructor(
    private http: HttpClient,
    @Inject(APP_BASE_HREF) baseHref: string
  ) {
    this.baseHref = baseHref;
  }

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
    if ((this.baseHref = '/')) {
      return window.location.origin + this.baseHref + 'assets/';
    }

    return window.location.origin + '/assets';
  }
}

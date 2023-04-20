import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Slider } from '../tables/slider';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private baseUrl = `${environment.foodOrderingBaseApiUrl}/sliders`

  constructor(private httpClient: HttpClient) { }

  getAllSliders() {
    return this.httpClient.get<Slider[]>(this.baseUrl);
  }

  createNewSlider(slider: Slider) {
    return this.httpClient.post<Slider>(this.baseUrl, slider);
  }

  deleteSlider(id: number): Observable<string> {
    return this.httpClient.delete<string>(this.baseUrl + `?id=${id}`)
  }
}

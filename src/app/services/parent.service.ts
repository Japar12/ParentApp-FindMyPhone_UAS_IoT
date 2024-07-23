import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private apiUrl = 'https://798d3f60-5f0d-4ac4-86ef-1e70e93dd969-00-2d2hykzs9a0zg.worf.replit.dev/public';

  constructor(private http: HttpClient) {}

  getLocation(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-location.php`, { params: { user_id: userId } });
  }
}

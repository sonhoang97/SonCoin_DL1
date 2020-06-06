import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
  
  getBlockChain(): Observable<any> {
    return this.http
      .get(this.apiUrl + '/getBlockChain')
      .pipe(map((res: any) => res));
  }

  miningBlockChain(name): Observable<any> {
    return this.http
      .get(this.apiUrl + '/mining/',{params: {name: name}})
      .pipe(map((res: any) => res));
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private api: ApiService) {}

  getMasterDetails(): Observable<any> {
    return this.api.get('master');
  }

  addMasterData(data: any): Observable<any> {
    return this.api.post('master', data);
  }

  deleteMaster(id: any): Observable<any> {
    return this.api.delete('master/' + id);
  }

  updateMasterData(data: any): Observable<any> {
    return this.api.post('master', data);
  }
}

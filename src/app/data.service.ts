import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private staffTable :any;
  private isEdit!:boolean;

  constructor(private http: HttpClient) { 
  }
  changeMessage(staffs: any) {
    this.staffTable = staffs;
  }
  getStaffs ():any{
    return this.staffTable;
  }
  changeEdit(isEdit:boolean){
    return this.isEdit = isEdit;
  }
  getEdit():boolean{
    return this.isEdit;
  }


  getDataAll(): Observable<any>{
    return this.http.get('http://127.0.0.1:8080');
  }
  Delete(id:string):Observable<any>{
    return this.http.delete(`http://localhost:8080/delete/${id}`,{});
  };

  Edit(data:any): Observable<any>{
    return this.http.put(`http://localhost:8080/edit`,data);
  }
  Add(data:any): Observable<any>{
    return this.http.post(`http://localhost:8080/add`,data);
  }

   Search(input_search:string): Observable<any>{
   
    return  this.http.get(`http://localhost:8080/search/${input_search}`);
  }
}

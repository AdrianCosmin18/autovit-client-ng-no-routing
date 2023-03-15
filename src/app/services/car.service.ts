import { Injectable } from '@angular/core';
import {catchError, Observable, of, throwError} from "rxjs";
import {Car} from "../home/car/models/car-model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private url = "http://localhost:8080/crudJS/car";

  constructor(private http: HttpClient) { }

  getCars(): Observable<Car[]>{

    return this.http.get<Car[]>(this.url).pipe(
      catchError(err => of(err)));
  }

  addCar(car: Car): Observable<void>{
    return  this.http.post<void>(this.url, car).pipe(catchError(this.handleError));
  }

  getCarById(id: number): Observable<Car>{
    let url2 = `${this.url}/${id}`;
    return this.http.get<Car>(url2).pipe(catchError(this.handleError));
  }

  updateCar(id: number, car: Car): Observable<void>{
    let url2 = `${this.url}/${id}`;
    return this.http.put<void>(url2, car).pipe(catchError(this.handleError));
  }

  deleteCar(id: number): Observable<void>{
    let url2 = `${this.url}/${id}`;
    return this.http.delete<void>(url2).pipe(catchError(this.handleError));
  }



  private handleError(error: HttpErrorResponse): Observable<never>{
    console.log(error);
    let errorMessage:string;

    errorMessage = error.error.message;
    return throwError(errorMessage);
  }
}

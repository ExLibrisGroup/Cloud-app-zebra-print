import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  constructor(private http:HttpClient) { }

  toPrinter(zplCode:string){} //TODO
}

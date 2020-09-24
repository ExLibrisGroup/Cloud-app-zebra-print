import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PreviewService {
  baseURL = "https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/";
  imageToShow: any;
  constructor(private http: HttpClient) {}

  getImage(tempaleZpl: string): string {
    return new URL(this.baseURL + tempaleZpl).href;
  }
}

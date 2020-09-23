import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: "root",
})
export class PreviewService {
  baseURL = "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/";
  imageToShow: any;
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {}

  getImage(tempaleZpl: string) {
    this.http
      .get(new URL(this.baseURL + tempaleZpl).href, { responseType: "blob" })
      .subscribe((result) => {
        let objectURL = URL.createObjectURL(result);       
        this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        console.log(this.imageToShow);
      });
  }

}

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PreviewService {
  private baseUrl = "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/";
  imageToShow: any=null;
  loadingPreview = false;
  constructor(private http: HttpClient) {}

  /**
   * The method takes a ZPL code and generate a url of preview in this.imageToShow
   * You can notice when the loading of photo is finished by this.loadingPreviw
   * @param zplString string of valid ZPL code for template to get value for
   */
  getPreview(zplString: string): void {
    this.loadingPreview = true;
    const headers = new HttpHeaders({
      Accept: "image/png",
      "Content-Type": "application/x-www-form-urlencoded",
    });
    this.http.post(this.baseUrl, zplString, { headers, responseType: "blob" }).subscribe((res) => {
      this.createImageFromBlob(res);
    },(err)=>console.log(err));
  }

  /**
   * Method for setting the settings of the preview
   * @param dpmm 
   * @param width 
   * @param height 
   * @param index 
   */
  setPreviewSettings(dpmm = "8", width = "4", height = "6", index = "0") {
    this.baseUrl =
      "https://api.labelary.com/v1/printers/" +
      dpmm +
      "dpmm/labels/" +
      width +
      "x" +
      height +
      "/" +
      index +
      "/";
  }
  /**
   * The method generated local URL of the image in the Blob
   * @param image image in Blob
   */
  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        this.imageToShow = reader.result;
        this.loadingPreview = false;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}

import { Device } from "./device.model";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PrinterService {
  private baseUrl = "http://127.0.0.1:9100/";
  constructor(private http: HttpClient) {}

  /**
   * Getting an object with all the local devices recognized by Zebra Browser Print software
   */
  getLocalDevices(): Observable<{ printer: Device[] }> {
    return this.http.get<{ printer: Device[] }>(this.baseUrl + "available");
  }

  /**
   * Getting the default device as recognized by Zebra Browser Print software
   */
  getDefaultDevice(): Observable<Device> {
    return this.http.get<Device>(this.baseUrl + "default?type=printer");
  }

  /**
   * method to write data to zpl device
   * @param device device to send data to 
   * @param data the data to send to device ::ZPL code
   */
  writeToDevice(device: Device, data: string): Observable<Object> {
    const headers = new HttpHeaders({
      Accept: "*/*",
      "Content-Type": "text/plain;charset=UTF-8",
    });
    return this.http.post(this.baseUrl + "write", { device, data }, { headers });
  }

  //We can check for statuses ,but i think the emulator is not working well with it 
}

import { PrinterService } from "./../printer.service";
import { Device } from "./../device.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

//TODO change github link
// template: `
// <div class="title">
//   <a [routerLink]="['']" style="float: right;">
//     <button mat-raised-button><mat-icon>arrow_back</mat-icon>Back</button>
//   </a>
//   <h1>Help</h1>
// </div>
// <div>
//   <p>
//     For more help with this app, or to report a problem, please open an issue by clicking on the
//     link below.
//   </p>
//   <p>
//     <a translate href="https://github.com/ori229/print-bib-record/issues" target="_blank"
//       >Open an issue</a
//     >
//   </p>
// </div>
// `
@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
})
export class HelpComponent implements OnInit {
  baseUrl = "http://api.labelary.com/v1/printers/8dpmm/labels/4x4/0/";
  imageToShow;
  zplString = "^xa^cfa,50^fo100,100^fdExlibris^fs^xz";
  devices: Device[] = [];
  selectedDevice: Device;
  writeError = "";
  loading = false;
  constructor(private http: HttpClient, private printer: PrinterService) {}

  ngOnInit(): void {
    this.setup();
  }

  setup() {
    this.loading = true;
    // Get the default device from the application as a first step. Discovery takes longer to complete.
    this.printer.getDefaultDevice().subscribe(
      (device) => {
        // Add device to list of devices and to html select element
        this.selectedDevice = device;
        this.devices.push(device);
        // Discover any other devices available to the application
        this.printer.getLocalDevices().subscribe(
          (deviceList) => {
            // tslint:disable-next-line: no-shadowed-variable
            if ("printer" in deviceList) {
              for (const device of deviceList["printer"]) {
                if (!this.selectedDevice || device.uid !== this.selectedDevice.uid) {
                  this.devices.push(device);
                }
              }
              console.log("finished setup");
              return true;
            }
            throw new Error("No Printers");
          },
          () => {
            throw new Error("Error getting local devices");
          }
        );
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        throw new Error(error);
      }
    );
  }

  onGet() {
    this.http.get(this.baseUrl + this.zplString, { responseType: "blob" }).subscribe((response) => {
      this.createImageFromBlob(response);
    });
  }
  onPost() {
    const headers = new HttpHeaders({
      Accept: "image/png",
      "Content-Type": "application/x-www-form-urlencoded",
    });
    this.http
      .post(this.baseUrl, this.zplString, { headers, responseType: "blob" })
      .subscribe((res) => {
        this.createImageFromBlob(res);
      });
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        this.imageToShow = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  onDeviceSelected(event) {
    this.selectedDevice = this.devices[event.target.options.selectedIndex];
  }
  onWrite() {
    if (this.selectedDevice) {
      this.printer.writeToDevice(this.selectedDevice, this.zplString).subscribe(
        (res) => console.log("write good", res),
        (err) => {
          console.log("failed", err);
          this.writeError = err.statusText;
          setTimeout(() => (this.writeError = ""), 4000); 
        }
      );
    } else {
      //TODO Error please select device
    }
  }
}

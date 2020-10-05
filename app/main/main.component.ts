import { Device } from "./../device.model";
import { SettingsModel } from "./../settings.model";
import { PrinterService } from "./../printer.service";
import { Subscription } from "rxjs";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  CloudAppRestService,
  CloudAppEventsService,
  Entity,
  PageInfo,
  CloudAppSettingsService,
  CloudAppConfigService,
} from "@exlibris/exl-cloudapp-angular-lib";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, OnDestroy {
  private _pageLoad$: Subscription;
  private _pageMeta: Subscription;
  loadingSettings = false;
  loadingPrinters = false;
  settings: SettingsModel;
  selectedPrinter: Device;
  printers: Device[]=[];

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private settingsService: CloudAppSettingsService,
    private printerService: PrinterService
  ) {}

  private PrintersSetup() {
    this.loadingPrinters = true;
    // Get the default device from the application as a first step. Discovery takes longer to complete.
    this.printerService.getDefaultDevice().subscribe(
      (device) => {
        // Add device to list of devices and to html select element
        this.selectedPrinter = device;
        this.printers.push(device);
        // Discover any other devices available to the application
        this.printerService.getLocalDevices().subscribe(
          (deviceList) => {
            // tslint:disable-next-line: no-shadowed-variable
            if ("printer" in deviceList) {
              for (const device of deviceList["printer"]) {
                if (!this.selectedPrinter || device.uid !== this.selectedPrinter.uid) {
                  this.printers.push(device);
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
        this.loadingPrinters = false;
      },
      (error) => {
        this.loadingPrinters = false;
        throw new Error(error);
      }
    );
  }
  ngOnInit() {
    //Loading the settings from server.
    this.loadingSettings = true;
    this.settingsService.get().subscribe({
      next: (res) => (this.settings = res),
      error: (err) => {
        console.log(err);
        alert(err);
      },
      complete: () => (this.loadingSettings = false),
    });

    //Loading printers connect with zbl browser print
    this.PrintersSetup();

    this._pageMeta = this.eventsService
      .getPageMetadata()
      .subscribe((pageInfo) => console.log("MetaData", pageInfo));
    this._pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);
    this.eventsService.getInitData().subscribe((data) => {
      console.log("Init Data ", data);
    });
  }

  ngOnDestroy() {
    this._pageMeta.unsubscribe();
  }

  /**
   *
   * @param onPageLoad
   */
  onPageLoad(pageInfo: PageInfo) {
    console.log("This is pageInfo", pageInfo); // TODO
  }

  onSubmit(f) {}
}

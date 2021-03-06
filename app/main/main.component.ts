import { Device } from "./../device.model";
import { SettingsModel } from "./../settings.model";
import { PrinterService } from "./../printer.service";
import {  Subscription} from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  CloudAppRestService,
  CloudAppEventsService,
  Entity,
  PageInfo,
  CloudAppSettingsService,
  AlertService,
} from "@exlibris/exl-cloudapp-angular-lib";
import { Constants } from "../constants";
interface LogData extends Entity {
  barcode: string;
}
@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, OnDestroy {
  private _pageMeta: Subscription;
  private templateSettings = Constants.placeHolders;
  loadingSettings = false;
  loadingPrinters = false;
  loadingPrint =false;
  settings: SettingsModel = Constants.getDefForm();
  selectedPrinter: Device;
  printers: Device[] = [];
  entities: Entity[] = [];
  uidHash: Set<string> = new Set<string>();
  uidLoanHash: Set<string> = new Set<string>();
  uidReturnHash: Set<string> = new Set<string>();
  printedList: LogData[] = [];
  printingError: LogData[] = [];

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private settingsService: CloudAppSettingsService,
    private printerService: PrinterService,
    private alert: AlertService
  ) {}

  ngOnInit() {
    //Loading the settings from server.
    this.loadingSettings = true;
    this.settingsService.get().subscribe({
      next: (settings) => {
        if (settings && Object.keys(settings).length != 0) {
          this.settings = settings;
        }
      },
      error: (err) => {
        console.log(err);
        alert(err);
      },
      complete: () => (this.loadingSettings = false),
    });

    //Loading printers connect with zbl browser print
    this.PrintersSetup();
  }

  ngAfterViewInit() {
    //Interval of checking the meta data of the page
    setInterval(() => {
      this._pageMeta = this.eventsService.getPageMetadata().subscribe({
        next: (pageInfo: PageInfo) => {
          this.onMetaReload(pageInfo?.entities);
        },
      });
    }, 3000);
  }
  ngOnDestroy() {
    this?._pageMeta?.unsubscribe();
  }

  /**
   *
   * @param
   */
  onMetaReload(newEntities: Entity[]) {
    //Assumption: you cant add/remove more than one entity in 1 sec + There is another operation when the page changes
    // console.log(newEntities, "This is on MetaLoad");
    //Find what to print
    if (!newEntities) {
      return;
    }
    if (newEntities.length > this.entities.length) {
      for (let entity of newEntities) {
        // Checks that the entities are only Loan entities
        if (!this.uidHash.has(entity.id) && entity.type && entity.type === "LOAN") {
          this.uidHash.add(entity.id);
          this.sendToPrint(entity);
          this.entities.push(entity);
        }
      }
    } else if (newEntities.length < this.entities.length) {
      //find what to remove
      let uidNew = new Set<string>();

      newEntities.forEach((element) => {
        element.type && element.type === "LOAN" ? uidNew.add(element.id) : null;
      });
      for (let i = 0; i < this.entities.length; ++i) {
        if (!uidNew.has(this.entities[i].id)) {
          this.uidHash.delete(this.entities[i].id);
          this.entities.splice(i, 1);
        }
      }
    }
  }

  onSubmit(f) {}

  sendToPrint(entity: Entity) {
    this.loadingPrint = true;
    if (entity.link) {
      this.restService.call(entity.link).subscribe({
        next: (data) => {
          if (this.uidLoanHash.has(entity.id) || this.uidReturnHash.has(entity.id)) {
            return;
          }
          data.loan_status === "ACTIVE"
            ? this.uidLoanHash.add(entity.id)
            : this.uidReturnHash.add(entity.id);
          this.renderToTemplate(data, entity);
        },
      });
    } else {
      console.error("Error : Entity have no link");
    }
  }
 
  renderToTemplate(data, entity) {
    let kind = data.loan_status === "ACTIVE" ? "loan" : "return";
    this.templateSettings._kindOfOperation_ = kind;
    //nice format for date
    data.due_date = new Date(data.due_date).toLocaleString();
    data.loan_date = new Date(data.loan_date).toLocaleString();
    Object.keys(data).forEach((e) => {
      let val = data[e];
      typeof val === "string" ? (val = (val as string).substring(0, 40)) : null;
      this.templateSettings["_" + e + "_"] = val;
    });
    let str = this.settings[kind][this.settings.defTemplateSelctedInd[kind === "loan" ? 0 : 1]]
      .zplString;
    let re = new RegExp(Object.keys(this.templateSettings).join("|"), "gi");
    str = str.replace(re, (match) => {
      return this.templateSettings[match];
    });
    this.callToPrint(data,entity,kind,str);
  }

  private callToPrint(data,entity,kind,str)
  {
    
    this.printerService.writeToDevice(this.selectedPrinter, str).subscribe({
      error: (err) => {
        console.error(err);
        this.alert.error(`Error with printing ${data.item_barcode}`);
        kind === "loan" ? this.uidLoanHash.delete(entity.id) : this.uidReturnHash.delete(entity.id);
        const idxError = this.deepIndexOf(this.printingError, {
          ...entity,
          barcode: data.item_barcode,
        });
        idxError > -1 ? this.printingError.splice(idxError, 1) : null;
        this.printingError.unshift({ ...entity, barcode: data.item_barcode });
        this.loadingPrint = false;
      },
      complete: () => {
        this.alert.success(`Successfully printed :  ${data.item_barcode}`);
        this.printedList.unshift({ ...entity, barcode: data.item_barcode });
        const idxError = this.deepIndexOf(this.printingError, {
          ...entity,
          barcode: data.item_barcode,
        });
        idxError > -1 ? this.printingError.splice(idxError, 1) : null;
        this.loadingPrint = false;
      },
    });
  }


  /**
   * Method for setting app the printers with zebra browser print
   */
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

  private deepIndexOf(arr, obj) {
    return arr.findIndex(function (cur) {
      return Object.keys(obj).every(function (key) {
        return obj[key] === cur[key];
      });
    });
  }

  // debug() {
  //   console.log("printedList", this.printedList);
  //   console.log("errorPrinting", this.printingError);
  //   console.log("uidHash", this.uidHash);
  //   console.log("entities", this.entities);
  // }
}

import { PreviewService } from "../preview.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { CloudAppSettingsService } from "@exlibris/exl-cloudapp-angular-lib";
import { SettingsModel } from "../settings.model";
import { Constants } from "../constants";
import { catchError, timeout } from "rxjs/operators";
var hello = function(){console.log('hello');};

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {}
//   printersList: string[] = ["Example1", "Example2"];
//   settings: SettingsModel;
//   printerSelected: string;
//   kindOfTemplate: string;
//   templatesToShow: { name: string; zplString: string }[];
//   templateToShow: { name: string; zplString: string };
//   saving: boolean = false;
//   loading: boolean = false;
//   loadingPhoto: boolean = false;
//   photoURL: any; //TODO replace with real photo

//   constructor(
//     private previewService: PreviewService,
//     private settingsService: CloudAppSettingsService,
//   ) {}

//   ngOnInit(): void {
//     console.log("On init");
//     this.onRefreshBtnClicked();
//   }
//   ngOnDestroy() {}
//   /**
//    *
//    */
//   private initDefSettings() {
//     this.settings.selectedPrinter = this.printersList.find((x) => x !== undefined);
//     this.settings.feeTemplates = [Constants.getdefZplFee()];
//     this.settings.returnTemplates = [Constants.getdefZplReturn()];
//     this.settings.loanTemplates = [Constants.getdefZplLoan()];
//     this.settings.defTemplateSelctedInd = [0, 0, 0];
//     if (!this.printersList.includes(this.settings.selectedPrinter)) {
//       this.settings.selectedPrinter = this.printersList.find((x) => x !== undefined);
//     }
//     this.printerSelected = this.settings.selectedPrinter;
//   }
//   private loadPrinters() {
//     console.log("loading printers..");
//   } //TODO load printers to printer list
//   /**
//    *
//    */
//   onSaveBtnClicked() {
//     this.saving = true;
//     this.settingsService.set(this.settings).subscribe(
//       (response) => {
//         console.log("Settings successfully saved.");
//       },
//       (err) => console.log(err.message),
//       () => (this.saving = false)
//     );
//   }

//   onRefreshBtnClicked() {
//     this.loadPrinters();
//     this.settingsService
//       .get()
//       .pipe(
//         timeout(5000),
//         catchError((e) => {
//           console.log("in timeout");
//           this.settings = new SettingsModel();
//           throw e;
//         })
//       )
//       .subscribe(
//         (settings) => {
//           console.log("Loading Settings");
//           this.settings = settings as SettingsModel;
//           console.log("got those settings", settings);
//           if (!this.settings.loanTemplates) {
//             this.initDefSettings();
//           }
//         },
//         (err) => {
//           console.log(err);
//           this.initDefSettings();
//         }
//       );
//     this.templateToShow = undefined;
//     this.templatesToShow = undefined;
//     this.kindOfTemplate = undefined;
//   }

//   onKindChange() {
//     console.log(this.kindOfTemplate);
//     switch (this.kindOfTemplate) {
//       case "loan":
//         this.templatesToShow = this.settings.loanTemplates;
//         this.templateToShow = this.templatesToShow[this.settings.defTemplateSelctedInd[0]];
//       case "return":
//         this.templatesToShow = this.settings.returnTemplates;
//         console.log(this.templatesToShow[this.settings.defTemplateSelctedInd[1]]);

//         this.templateToShow = this.templatesToShow[this.settings.defTemplateSelctedInd[1]];
//       case "fee":
//         this.templatesToShow = this.settings.feeTemplates;
//         this.templateToShow = this.templatesToShow[this.settings.defTemplateSelctedInd[2]];
//     }
//   } //TODO Load the templates for this kind

//   onPreviewClicked() {
//     this.loadingPhoto = true;
//     this.previewService.getImage(this.templateToShow.zplString).subscribe(
//       (response) => console.log("good",response),
//       (response) => {
//         console.log("err", response);
//         // const reader = new FileReader();
//         // reader.onload = (e) => this.photoURL = e.target.result;
//         // reader.readAsDataURL(new Blob([response.error.text]));

//         // this.loadingPhoto = false
//       },
//     );
//   }
//   test()
//   {
//     hello();
//   }
// }

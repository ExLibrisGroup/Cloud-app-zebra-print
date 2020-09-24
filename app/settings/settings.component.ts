import { PreviewService } from "../preview.service";
import { Component,OnDestroy, OnInit} from "@angular/core";
import { CloudAppSettingsService } from "@exlibris/exl-cloudapp-angular-lib";
import { SettingsModel } from "./settings.model";
import { Constants } from "../constants";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit ,OnDestroy{
  printersList: string[] = ["Example1", "Example2"];
  settings: SettingsModel;
  printerSelected: string;
  kindOfTemplate: string;
  templatesToShow: { name: string; zplString: string }[];
  templateToShow: { name: string; zplString: string };
  saving: boolean = false;
  loading: boolean = false;
  loadingPhoto: boolean = false;
  photoURL: string; //TODO replace with real photo

  constructor(
    private previewService: PreviewService,
    private settingsService: CloudAppSettingsService
  ) {}

  ngOnInit(): void {
    console.log("On init");
    this.onRefreshBtnClicked();
  }
  ngOnDestroy(){}
  /**
   *
   */
  private initDefSettings() {
    this.settings.selectedPrinter = this.printersList.find((x) => x !== undefined);
    this.settings.feeTemplates = [Constants.getdefZplFee()];
    this.settings.returnTemplates = [Constants.getdefZplReturn()];
    this.settings.loanTemplates = [Constants.getdefZplLoan()];
  }
  private loadPrinters() {
    console.log("loading printers..");
  } //TODO load printers to printer list
  /**
   *
   */
  onSaveBtnClicked() {
    this.saving = true;
    this.settingsService.set(this.settings).subscribe(
      (response) => {
        console.log("Settings successfully saved.");
      },
      (err) => console.log(err.message),
      () => (this.saving = false)
    );
  }

  onRefreshBtnClicked() {
    this.loadPrinters();
    this.settingsService.get().subscribe(
      (settings) => {
        console.log("Loading Settings");
        this.settings = settings as SettingsModel;
        if (!this.printersList.includes(this.printerSelected)) {
          this.settings.selectedPrinter = this.printersList.find((x) => x !== undefined);
        }
      },
      (err) => {
        console.log(err);
        this.initDefSettings();
      }
    );
  }

  onKindChange() {
    switch (this.kindOfTemplate){
      case "loan":
        this.templatesToShow = this.settings.loanTemplates;
        this.templateToShow = this.templatesToShow[this.settings.defTemplateSelctedInd[0]];
      case "return":
        this.templatesToShow = this.settings.returnTemplates;
        this.templateToShow = this.templatesToShow[this.settings.defTemplateSelctedInd[1]];
      case "fee":
        this.templatesToShow = this.settings.feeTemplates;
        this.templateToShow = this.templatesToShow[this.settings.defTemplateSelctedInd[2]];
    }
  } //TODO Load the templates for this kind

  onPreviewClicked(){}
  // {
  //   this.loadingPhoto= true;
  //   this.photoURL = this.preview.showPreview(this.templateToShow.zpl).href;
  //   console.log(this.photoURL);
  //   this.loadingPhoto=false;
  // }
}

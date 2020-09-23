import { PreviewService } from '../preview.service';
import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  printersList: string[] = ["Example1", "Example2"];
  printerSelected: string;
  kindOfTemplate: string;
  templatesToShow: { name: string; zpl: string }[];
  templateToShow: { name: string; zpl: string };
  saving: boolean = false;
  loading: boolean = false;
  loadingPhoto : boolean = false;
  photoURL : string ; //TODO replace with real photo 


  constructor(private preview:PreviewService) {}

  ngOnInit(): void {}
  /**
   *
   */
  onSaveBtnClicked() {} //TODO Save the setting of printer

  onRefreshBtnClicked() {} //TODO Load the setting of printer

  onKindChange() {
    //Test
    this.templatesToShow = [
      { name: "testname", zpl: "^XA^PW400^LL200^FO20,20^A0N,30,30^FDThis is a TEST^FS^XZ" },
      { name: "testname2", zpl: "^XA^PW400^LL200^FO20,20^A0N,30,30^FDThis is a TEST2^FS^XZ" },
    ];
  } //TODO Load the templates for this kind

  // onPreviewClicked()
  // {
  //   this.loadingPhoto= true;
  //   this.photoURL = this.preview.showPreview(this.templateToShow.zpl).href;
  //   console.log(this.photoURL);
  //   this.loadingPhoto=false;
  // }
}

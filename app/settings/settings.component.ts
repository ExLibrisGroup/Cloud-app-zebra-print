import { NgForm } from "@angular/forms";
import { PreviewService } from "../preview.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { CloudAppSettingsService } from "@exlibris/exl-cloudapp-angular-lib";
import { SettingsModel } from "../settings.model";
import { Constants } from "../constants";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  loadingSettings: boolean = false;
  settings: SettingsModel= Constants.getDefForm();
  error: string;
  kindToPreview:string

  constructor(
    public previewService: PreviewService,
    private settingsService: CloudAppSettingsService
  ) {}

  ngOnInit(): void {
    this.loadingSettings = true;
    this.settingsService.get().subscribe(
      (settings) => {
        if (settings && Object.keys(settings).length != 0) {
          this.settings = settings;
        }
      },
      (err) => {
        console.log(err);
        this.error = "Error in loading settings";
      },
      () => (this.loadingSettings = false)
    );
  }
  onChangeSelection(f:NgForm)
  {
    const vals = ["loan", "return", "fee"];
    for (let i = 0; i < 3; i++) {
      const idx = this.settings[vals[i]].indexOf(f.value[vals[i]]);
      this.settings.defTemplateSelctedInd[i] = idx > -1 ? idx : 0;
    }
    this.previewService.getPreview(this.settings[this.kindToPreview][this.settings.defTemplateSelctedInd[vals.indexOf(this.kindToPreview)]])
  }
  onSubmit() {
    this.loadingSettings = true;
    this.settingsService.set(this.settings).subscribe({
      next: null,
      error: (err) => {
        this.error = "Could not save defaults";
        console.log(err);
      },
      complete: () => (this.loadingSettings = false),
    });
  }
}

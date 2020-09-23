import { PreviewService } from "./../preview.service";
import { Component, OnInit } from "@angular/core";
import { CloudAppConfigService } from "@exlibris/exl-cloudapp-angular-lib";

//TODO remove test

@Component({
  selector: "app-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
})
export class ConfigComponent implements OnInit {
  zplString: string = "^xa^cfa,50^fo100,100^fdHello World^fs^xz";
  kindOfTemplate: string = "loan";
  nameOfZPLTemplate: string = "";
  saving: boolean = false;
  isImageLoading: boolean;
  imgToShow: any;

  constructor(
    private configService: CloudAppConfigService,
    public previewService: PreviewService
  ) {}

  ngOnInit(): void {}

  //TODO Complete the functions , Make depednecy between the kind of template
  /**
   *
   */
  onLoadOrReset() {
    console.log("loading config.");

    this.configService.get().subscribe(
      (response) => {
        console.log("Got the config:");
        console.log("get response", response);
        if (response.customZPLs) {
          console.log(response.customZPLs[0].name);
          this.nameOfZPLTemplate = response.customZPLs[0].name;
          this.zplString = response.customZPLs[0].zpl;
        }
      },
      (err) => console.log(err.message)
    );
  }

  /**
   *
   */
  onSaveBtnClicked() {
    console.log("Saving config: " + this.nameOfZPLTemplate);
    this.saving = true;
    this.nameOfZPLTemplate = this.nameOfZPLTemplate.replace(".zpl", ""); // the .zpl suffix is used to mark that it's an OTB ZPL
    var toSave = {
      customZPLs: [
        {
          name: this.nameOfZPLTemplate,
          zpl: this.zplString,
        },
      ],
    };
    this.configService.set(toSave).subscribe(
      (response) => {
        console.log("Saved", response);
        this.saving = false;
      },
      (err) => console.log(err.message)
    );
  }

  onPreviewClicked() {
    //TODO find out what making this request to not pass CSP
    console.log("started");
    this.previewService.getImage(this.zplString);
  }
}

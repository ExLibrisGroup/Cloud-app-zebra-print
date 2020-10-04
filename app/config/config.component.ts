import { Constants } from "./../constants";
import { SettingsModel } from "./../settings.model";
import { PreviewService } from "./../preview.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { CloudAppSettingsService } from "@exlibris/exl-cloudapp-angular-lib";
import { NgForm } from "@angular/forms";

//TODO remove test

@Component({
  selector: "app-config",
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
})
export class ConfigComponent implements OnInit {
  loadingSettings = false;
  settings : SettingsModel = Constants.getDefForm();
  kindOfTemplate = "loan";
  selectedTemplate={name:'',zplString:''};
  constructor(
    private settingsService: CloudAppSettingsService,
    public previewService: PreviewService
  ) {}

  ngOnInit(): void {
    //Loading form from Server
    this.loadingSettings = true;
    this.settingsService.get().subscribe(
      (settings) => {
        console.log("in subscribe");
        if (settings && Object.keys(settings).length != 0) {
          this.settings = settings;
        }
      },
      (err) => {
        alert("Could not load settings from server,Using defaults");
        console.log(err);
      },
      () => (this.loadingSettings = false)
    );
  }

  onSelectTemplate(template:{name:string,zplString:string})
  {
    this.selectedTemplate= template;
  }
  /**
   * 
   */
  onSubmit(form: NgForm)
  {
    this.loadingSettings=true;
    this.settingsService.set(this.settings).subscribe({next:null,error:(err)=>console.log(err),complete:()=>this.loadingSettings=false})
  } 

  onAdd(templateName:string)
  {
    const temp = { name: templateName, zplString: ''}
    let flag = true;
    for (let t of this.settings[this.kindOfTemplate])
    {
      if (t.name=== temp.name)
      {
        flag=false;
        break;
      }
    }
    flag?this.settings[this.kindOfTemplate].push(temp):null;
  }

  onLoad(){
    this.loadingSettings=true
    this.settingsService.get().subscribe({next:(res)=>{console.log(res);this.settings=res},error:(err)=>console.log(err),complete:()=>this.loadingSettings=false})

  }
  onRestoreDef(){
    this.settings=Constants.getDefForm();
  }
  
  debug() {
    console.log()
  }
}

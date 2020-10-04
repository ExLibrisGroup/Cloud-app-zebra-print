import { SettingsModel } from "./settings.model";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

export class Constants {
  private static defZplTemplate = `^XA

    ^FX Top section with logo, name and address.
    ^CF0,60
    ^FO50,50^GB100,100,100^FS
    ^FO75,75^FR^GB100,100,100^FS
    ^FO93,93^GB40,40,40^FS
    ^FO220,50^FD_instName_^FS
    ^CF0,30
    ^FO220,115^FD_address_^FS
    ^FO220,155^FD_state_^FS
    ^FO220,195^FD_country_^FS
    ^FO50,250^GB700,1,3^FS
    
    ^FX Second section with recipient address and permit information.
    ^FO250,260^FD_kindOfOperation_^FS
    ^CFA,30
    ^FO50,300^FDJohn Doe^FS
    ^FO50,340^FD100 Main Street^FS
    ^FO50,380^FDSpringfield TN 39021^FS
    ^FO50,420^FDUnited States (USA)^FS
    ^CFA,15
    ^FO600,300^GB150,150,3^FS
    ^FO638,340^FDPermit^FS
    ^FO638,390^FD123456^FS
    ^FO50,500^GB700,1,3^FS
    
    ^FX Third section with barcode.
    ^BY8,2,270
    ^FO100,550^BC^FD_id_^FS
    
    
    ^XZ`;

  private static getdefZplLoan() {
    return {
      name: "Default Template",
      zplString: this.defZplTemplate.replace("_kindOfOperation_", "Loan"),
    };
  }
  private static getdefZplReturn() {
    return {
      name: "Default Template",
      zplString: this.defZplTemplate.replace("_kindOfOperation_", "Return"),
    };
  }
  private static getdefZplFee() {
    return {
      name: "Default Template",
      zplString: this.defZplTemplate.replace("_kindOfOperation_", "Fee"),
    };
  }
  private static defForm = {
    loan: [Constants.getdefZplLoan()],
    return: [Constants.getdefZplReturn()],
    fee: [Constants.getdefZplFee()],
  };

  public static getDefForm(): SettingsModel {
    return Constants.defForm as SettingsModel;
  }
}

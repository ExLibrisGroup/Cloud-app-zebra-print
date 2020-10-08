import { SettingsModel } from "./settings.model";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

export class Constants {
  public static placeHolders = {
    _author_: "",
    _call_number_: "",
    _circ_desk_: "",
    _description_: "",
    _due_date_: "",
    _holding_id_: "",
    _item_barcode_: "",
    _item_id_: "",
    _item_policy_: "",
    _last_renew_status_: "",
    _library_: "",
    _loan_date_: "",
    _loan_id_: "",
    _loan_status_: "",
    _location_code_: "",
    _mms_id_: "",
    _process_status_: "",
    _publication_year_: "",
    _renewable_: "",
    _title_: "",
    _user_id_: "",
    _kindOfOperation_:""
  };
  private static defZplTemplate = ` ^XA

  ^FX Top section with logo, name and address.
  ^CF0,60

  ^FO50,50^FDDefault institution^FS
  ^CF0,30
  ^FO50,115^FDAddress^FS
  ^FO50,155^FDState^FS
  ^FO50,195^FDCountry^FS
  ^FO50,250^GB700,1,3^FS
  
  ^FX Second section with recipient address and permit information.
  ^FO250,260^FD_kindOfOperation_^FS
  ^CFA,30
  ^FO50,300^FD_user_id_^FS
  ^FO50,340^FDDue:_due_date_^FS
  ^FO50,380^FDDate:_loan_date_^FS
  ^FO50,420^FDLoan ID:_loan_id_^FS
  ^CFA,15

  ^FO50,500^GB700,1,3^FS
  
  ^FX Third section with barcode.
^CFA,30
 ^FO50,550^FDBarcode:_item_barcode_^FS
 ^FO50,620^FD_author_^FS
 ^FO50,690^FD_title_^FS



  
  
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
    defTemplateSelctedInd :[0,0,0]
  };

  public static getDefForm(): SettingsModel {
    return Constants.defForm as SettingsModel;
  }
}

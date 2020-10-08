import { PrinterService } from "./../printer.service";
import { Device } from "./../device.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-help",
  templateUrl:"./help.component.html" 
})
export class HelpComponent {
  dict = {
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
  }
}

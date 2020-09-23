import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  CloudAppRestService,
  CloudAppEventsService,
  Request,
  HttpMethod,
  Entity,
  PageInfo,
  RestErrorResponse,
  CloudAppSettingsService,
  CloudAppConfigService,
} from "@exlibris/exl-cloudapp-angular-lib";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, OnDestroy {
  private _pageLoad$: Subscription;
  private _pageEntities: Entity[];
  bibHash: { [index: string]: any; } = {};
  bibEntities: Entity[]=[];

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private settingsService: CloudAppSettingsService,
    private configService: CloudAppConfigService,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    this.eventsService.getPageMetadata().subscribe(this.onPageLoad);
    this._pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);
    this.eventsService.getInitData().subscribe((data) => {
      console.log("Init Data ",data);
    });
  }

  ngOnDestroy() {
    this._pageLoad$.unsubscribe();
  }

  /**
   *
   * @param onPageLoad
   */
  onPageLoad=(pageInfo: PageInfo) =>{
    console.log("This is pageInfo", pageInfo); // TODO
    this._pageEntities = pageInfo.entities;

    this.bibEntities = (pageInfo.entities || []).filter((e) =>
      ["BIB_MMS", "IEP", "BIB"].includes(e.type)
    );
    console.log(this.bibEntities); //TODO
  }

  /**
   * Removes duplicated from bibentities based on id
   */
  dedupByMmsId() {
    var bibEntitiesUniq: Entity[] = [];
    this.bibEntities.forEach((bibEntity) => {
      var alreadyThere: boolean = false;
      bibEntitiesUniq.forEach((bibEntityUniq) => {
        if (bibEntity.id === bibEntityUniq.id) {
          alreadyThere = true;
        }
      });
      if (!alreadyThere) {
        // console.log("adding to deduped list: "+bibEntity.description);
        bibEntitiesUniq.push(bibEntity);
      }
    });
    this.bibEntities = bibEntitiesUniq;
  }

  /**
   * TODO
   * @param itemEntities
   */
  getListOfBibsFromListOfItemsOrPortfolios(itemEntities: Entity[]) {
    itemEntities.forEach((itemEntity) => {
      if (itemEntity.link) {
        var mmsId: string = itemEntity.link
          .replace("/bibs/", "")
          .replace(/\/holdings\/.*/, "")
          .replace(/\/portfolios\/.*/, "");
        this.restService.call(`/bibs/${mmsId}?view=brief`).subscribe(
          (response) => {
            let title: string = response.title ? response.title : "";
            let author: string = response.author ? response.author : "";
            this.bibEntities.push({ id: mmsId, description: title + " " + author });
            this.dedupByMmsId();
          },
          (err) => console.log(err.message)
        );
      }
    });
  }

  /**
   *  TODO
   * @param itemEntities
   */
  getListOfBibsFromListOfPOLs(itemEntities: Entity[]) {
    itemEntities.forEach((itemEntity) => {
      if (itemEntity.link) {
        this.restService.call(itemEntity.link).subscribe(
          (response) => {
            var getBibLink =
              response.resource_metadata.mms_id.link.replace("/almaws/v1", "") + "?view=brief";
            this.restService.call(getBibLink).subscribe(
              (response) => {
                let title: string = response.title ? response.title : "";
                let author: string = response.author ? response.author : "";
                this.bibEntities.push({ id: response.mms_id, description: title + " " + author });
                this.dedupByMmsId();
              },
              (err) => console.log(err.message)
            );
          },
          (err) => console.log(err.message)
        );
      }
    });
  }

  onListChanged(e: MatCheckboxChange) {}
  /**
   * Questions:
   * 1. Why there is a pageEntities?
   * 2. why onpageload worked only like this and not as decleration?
   * 3. 
   */
}

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, getTranslateModule, AlertModule } from '@exlibris/exl-cloudapp-angular-lib';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { HelpComponent } from './help/help.component';
import { SettingsComponent } from './settings/settings.component';
import { ConfigComponent } from './config/config.component';
import { FormsModule } from '@angular/forms';

export function getToastrModule() {
  return ToastrModule.forRoot({
    positionClass: 'toast-top-right',
    timeOut: 2000
  });
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HelpComponent,
    SettingsComponent,
    ConfigComponent,
  ],
  imports: [AlertModule,
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    getTranslateModule(),
    getToastrModule()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

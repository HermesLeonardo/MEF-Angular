import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ConfigPageModule } from './modules/home/page/config-page/config-page.module';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';
import { ProfilePageModule } from './modules/home/page/profile-page/profile.module';


@NgModule({

  declarations: [AppComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    ConfigPageModule,
    HomeModule,
    SharedModule,
    ProfilePageModule

  ],
  bootstrap: [AppComponent]
})


export class AppModule {}


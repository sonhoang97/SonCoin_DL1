import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlockChainComponent } from './block-chain/block-chain.component';

import { ConfigService } from '../services/config.service';

@NgModule({
  declarations: [AppComponent, BlockChainComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [ConfigService],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { BlockChain } from '../model/block-chain';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-end';
  blockChain = new BlockChain();
  constructor(private configService: ConfigService) {}
  ngOnInit() {
    this.configService.getBlockChain().subscribe((res: any) => {
      this.blockChain = res;
      console.log(this.blockChain.blockChain);
    });

    this.configService.miningBlockChain("mining").subscribe((res: any) => {
      this.blockChain = res;
      console.log(this.blockChain.blockChain);
    });
  }
}

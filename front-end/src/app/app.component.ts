import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { BlockChain } from '../model/block-chain';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-end';
  blockChain = new BlockChain();
  userName: string;

  selectUser = 'Son';
  receiveTA: string;
  amountTrans: number;

  funds = 0;

  noResultTA = false;
  balanceUser = 0;
  lsUser: string[] = ['Son'];
  isEnough = true;
  notFunds = false;
  constructor(private configService: ConfigService) {}
  ngOnInit() {
    this.configService.getBlockChain().subscribe((res: any) => {
      this.blockChain = res;
      this.funds = 0;
    });
  }

  miningBlock() {
    this.configService
      .miningBlockChain(this.blockChain, this.selectUser)
      .subscribe((res: any) => {
        this.blockChain = res;
        this.configService
          .getBalance(this.blockChain.blockChain, this.selectUser)
          .subscribe((res: any) => {
            this.balanceUser = res;
            this.funds = 0;
          });
      });
  }

  createUser() {
    if (this.userName == null || this.userName == '') {
      return;
    }
    this.lsUser.push(this.userName);
    console.log(this.lsUser);
    this.userName = '';
  }
  selectUserButton(user) {
    this.selectUser = user;
    this.receiveTA = '';
    this.amountTrans = null;
    this.configService
      .getBalance(this.blockChain.blockChain, this.selectUser)
      .subscribe((res: any) => {
        this.balanceUser = res;
        this.funds = 0;
        this.blockChain.pendingTransactions.forEach((element) => {
          if (element.sender == this.selectUser) {
            this.funds += element.amount;
          } else if (element.recipient == this.selectUser) {
            this.funds -= element.amount;
            if (this.funds <= 0) {
              this.funds = 0;
            }
          }
        });
      });
  }

  typeaheadNoResults(event: boolean): void {
    this.noResultTA = event;
  }

  checkRest() {
    if (this.amountTrans == null) {
      this.isEnough = true;
      return;
    }
    this.configService
      .getBalance(this.blockChain.blockChain, this.selectUser)
      .subscribe((res: any) => {
        if (Number(this.amountTrans) > res) {
          this.isEnough = false;
        } else this.isEnough = true;
      });
  }

  onSelectReceiver(event: TypeaheadMatch) {
    if (event.item == this.selectUser) {
      this.receiveTA = '';
      this.noResultTA = true;
    }
  }

  addTransaction() {
    if (this.noResultTA && !this.isEnough) {
      return;
    }
    if (this.amountTrans + this.funds > this.balanceUser) {
      this.notFunds = true;
      return;
    } else {
      this.notFunds = false;
    }
    this.configService
      .addTransaction(
        this.blockChain.blockChain,
        this.blockChain.pendingTransactions,
        this.selectUser,
        this.receiveTA,
        this.amountTrans
      )
      .subscribe((res: any) => {
        this.blockChain = res;
        this.funds = 0;
        this.blockChain.pendingTransactions.forEach((element) => {
          if (element.sender == this.selectUser) {
            this.funds += element.amount;
          } else if (element.recipient == this.selectUser) {
            this.funds -= element.amount;
            if (this.funds <= 0) {
              this.funds = 0;
            }
          }
        });
      });
  }
}

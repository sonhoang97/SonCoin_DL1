import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BlockChain } from 'src/model/block-chain';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getBlockChain(): Observable<any> {
    return this.http
      .get(this.apiUrl + '/getBlockChain')
      .pipe(map((res: any) => res));
  }

  miningBlockChain(blockChain : BlockChain, receiver): Observable<any> {
    const body = {
      blockChain: blockChain.blockChain,
      pendingTransactions: blockChain.pendingTransactions,
      receiver: receiver,
    };
    return this.http
      .post(this.apiUrl + '/mining', body)
      .pipe(map((res: any) => res));
  }

  getBalance(blockChain, receiver) {
    const body = {
      blockChain: blockChain,
      receiver: receiver,
    };
    return this.http
      .post(this.apiUrl + '/balance', body)
      .pipe(map((res: any) => res));
  }

  addTransaction(blockChain, pendingTransactions, sender, recipient, amount) {
    const body = {
      blockChain: blockChain,
      pendingTransactions: pendingTransactions,
      sender: sender,
      recipient: recipient,
      amount: amount,
    };
    return this.http
      .post(this.apiUrl + '/addTransaction', body)
      .pipe(map((res: any) => res));
  }
}

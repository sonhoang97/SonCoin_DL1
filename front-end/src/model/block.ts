import { Transaction } from './transaction';
export class Block {
  timeStamp: string;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

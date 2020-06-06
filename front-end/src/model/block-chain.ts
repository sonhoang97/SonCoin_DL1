import { Block } from './block';
import { Transaction } from './transaction';

export class BlockChain {
  blockChain: Block[];
  difficulty = 4;
  pendingTransactions: Transaction[];
  miningReward = 100;
}

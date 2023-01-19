import { Component, Input, OnInit } from '@angular/core';
import { GameUIService } from '../../game-ui.service';
import { BankService } from './bank.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],
})
export class BankComponent implements OnInit {

  @Input() passedLocationData = null;

  locationData = null;
  gold = null;
  bank = null;
  message = null;

  public isLoading = true;

  constructor(
    private gameUIService: GameUIService,
    private bankService: BankService
  ) { }

  ngOnInit() {
    console.log('initialised bank; locationData: ');
    this.locationData = this.passedLocationData;
    console.log(this.passedLocationData);

    this.initialize();
  }

  closeModal(){
    this.gameUIService.openedModal.emit(null);
  }

  initialize(){
    this.bankService.loadBankData()
      .subscribe(data => {
        this.isLoading = false;

        this.gold = data.gold;
        this.bank = data.bank;
        this.message = data.errorMessage;

        console.log('loadBankData: ');
        console.log(data);

      });
  }

  removeGoldFromBank(amount: string | number){
    this.isLoading = true;
    this.bankService.removeGoldFromBank(amount)
      .subscribe(data => {
        this.isLoading = false;

        this.gold = data.gold;
        this.bank = data.bank;

        if(data.success){
          this.message = 'You removed ' + amount + ' gold from Bank.';
        }
        else
        {
          this.message = data.errorMessage;
        }

        this.gameUIService.heroInfoUpdate(data);

        console.log('loadBankData: ');
        console.log(data);

      });
  }

  insertGoldToBank(amount: string | number){
    this.isLoading = true;
    this.bankService.insertGoldToBank(amount)
      .subscribe(data => {
        this.isLoading = false;

        this.gold = data.gold;
        this.bank = data.bank;

        if(data.success){
          this.message = 'You inserted ' + amount + ' gold to Bank.';
        }
        else
        {
          this.message = data.errorMessage;
        }

        this.gameUIService.heroInfoUpdate(data);

        console.log('loadBankData: ');
        console.log(data);

      });
  }

}

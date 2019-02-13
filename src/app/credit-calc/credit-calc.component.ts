import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDatePickerConfig } from 'ng2-date-picker';
import {DatePickerDirective} from 'ng2-date-picker';
import { CreditService, BankData } from '../services/credit.service';
import { CreditData } from '../services/credit.service';


@Component({
  selector: 'app-credit-calc',
  templateUrl: './credit-calc.component.html',
  styleUrls: ['./credit-calc.component.scss']
})
export class CreditCalcComponent implements OnInit {

  creditForm: FormGroup;
  @ViewChild('dateDirectivePicker') datePickerDirective: DatePickerDirective;
  config: IDatePickerConfig = {
    format: 'DD.MM.YYYY',
    disableKeypress: true,
    showMultipleYearsNavigation: true,
    enableMonthSelector: true
  };

  creditMas: CreditData[];
  creditRes: Response;
  done: boolean = false;
  bankMas: BankData[];

  constructor(private _creditService: CreditService) {
    this.creditForm = new FormGroup({
      amountOfCredit: new FormControl(0, [Validators.required, Validators.min(0)]),
      timeOfCredit: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(360)]),
      percentOfCredit: new FormControl(10, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[-+]?[0-9]*[.,]?[0-9]+(?:[eE][-+]?[0-9]+)?$')]),
      startingDate: new FormControl(null, Validators.required),
      bankId: new FormControl(Validators.required)
    });
   }

  calculateCredit(creditForm: FormGroup){
    if(creditForm.valid){
      let date = this.creditForm.controls['startingDate'].value.split('.');
      let day = parseInt(date[0]);
      let month = parseInt(date[1]);
      let year = parseInt(date[2]);
      let modifiedDate = new Date(year,month-1,day);

    return this.creditMas = this._creditService.calculateCredit(this.creditForm.controls['amountOfCredit'].value, this.creditForm.controls['timeOfCredit'].value, this.creditForm.controls['percentOfCredit'].value,modifiedDate);
    }
  }

  clearForm(creditForm: FormGroup){
    this.creditForm.reset();
    this.creditMas = [];
  }




  putAll(creditForm: FormGroup){
  let dateOfCredit = this.creditForm.controls['startingDate'].value.split('.');
  let day = dateOfCredit[0];
  let month = dateOfCredit[1];
  let year = dateOfCredit[2];
  let modifiedDate = year + '-' + month + '-' + day;
    this._creditService.putCredit(this.creditForm.controls['bankId'].value, this.creditForm.controls['amountOfCredit'].value, this.creditForm.controls['timeOfCredit'].value, this.creditForm.controls['percentOfCredit'].value, modifiedDate, this.creditMas)
    .subscribe((data: Response)=>{this.creditRes = data; this.done=true;}),
     error => console.log(error);
  }

  getBanks(){
    this._creditService.getBank().subscribe((result: BankData[])=>
    {this.bankMas = result;})
  }

  ngOnInit() {
    this.getBanks();
  }

}

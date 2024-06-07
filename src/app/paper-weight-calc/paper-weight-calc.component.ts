import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paper-weight-calc',
  templateUrl: './paper-weight-calc.component.html',
  styleUrls: ['./paper-weight-calc.component.scss'],
})
export class PaperWeightCalcComponent implements OnInit {

  length: any;
  width: any;
  qty: any;
  gsm: any;
  kgs: any;

  wgt: any;
  rateSheets: any;
  ratePerSheet: any;
  searchSizeBy = "Inch";

  constructor() { }

  ngOnInit() {}

  calc() {
    const len = this.searchSizeBy == "Inch" ? this.length : this.length / 2.54;
    const wed = this.searchSizeBy == "Inch" ? this.width : this.width / 2.54;
    const gsm = this.gsm;
    const qty = this.qty;
    const kgs = this.kgs;

    if (len != null && wed != null && gsm != null) {
      const wgt = len * wed * gsm / 8.2 / 1307.25 / 144 * 100;
      this.wgt = wgt.toFixed(1);
    }
    let wgtsheet = 0;
    if (qty != null) {
      const multiplesheet = qty / 100;
      wgtsheet = this.wgt * multiplesheet;
      this.wgt = wgtsheet.toFixed(1);
    }
    let rateqty = 0;
    if (kgs != null) {
      rateqty = wgtsheet * kgs;
      this.rateSheets = rateqty.toFixed(2);
    }
    if (len != null && wed != null && gsm != null && qty != null && kgs != null) {
      const total = rateqty / qty;
      this.ratePerSheet = total.toFixed(2);
    }
  }
}

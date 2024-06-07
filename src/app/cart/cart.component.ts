import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { UtilitiesService } from '../services/utilities.services';
import { APIService } from '../services/api.services';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  companyList = [];
  companyName = '';
  stock_id;
  delivery = '';
  searchedWidth = '';
  confirmDetails = false;
  visibleContent = 'details';
  searchSizeBy = "Inch";

  cart = [];

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService, private cdr: ChangeDetectorRef,
    private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (this.utilitiesService.isInternatConnectionAvailable()) {
        if (this.utilitiesService.cart.length) {
          this.cart = this.utilitiesService.cart;
          this.cart.forEach(cartItem => {
            if (!cartItem.selectedSize) {
              if (cartItem.isReel == 'Yes') {
                cartItem.selectedSize = cartItem.searchedWith.qty;
              } else {
                if (cartItem.searchedResult.qty_as_per_size.length == 1) {
                  cartItem.selectedSize = cartItem.searchedResult.qty_as_per_size[0];
                } else {
                  cartItem.selectedSize = null;
                }
              }
            }
            this.searchSizeBy = cartItem.searchSizeBy;
          })
          this.utilitiesService.showLoading();
          this.getCompanyList();
        } else {
          this.router.navigate([`/nearest-sizes`]);
        }
      }
    });
  }

  getCompanyList() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.companyList = [];
      const mobileNumber = this.authService.getMobileNumber;
      this.apiService.get('API_addorder/find_company_list?mobile=' + mobileNumber).subscribe((response: any) => {
        this.utilitiesService.dismissLoading();
        if (response && response.data) {
          this.companyList = response.data;
        } else {
          this.utilitiesService.presentErrorAlert();
        }
        this.cdr.detectChanges();
      }, () => {
        this.utilitiesService.dismissLoading();
        this.utilitiesService.presentErrorAlert();
      });
    }
  }

  goToOrder() {
    let isAnySizeSelectionMissing = '';
    this.cart.forEach(res => {
      if (!res.selectedSize) {
        isAnySizeSelectionMissing += '<br/> - ' + res.quality
      }
    });

    if (isAnySizeSelectionMissing) {
      this.utilitiesService.presentErrorAlert('Qty is missing', `Qty is missing for quality ${isAnySizeSelectionMissing}`);
      return;
    }
    this.confirmDetails = true;
    this.visibleContent = 'place_order';
  }

  submitOrder() {

    if (this.utilitiesService.isInternatConnectionAvailable()) {
      if (this.companyName) {

        const groupId = Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase();
        this.utilitiesService.showLoading();

        let orderPlaced = 0;
        this.cart.forEach(cartItem => {
          const formData = new FormData();
          formData.append('group_id', groupId);
          formData.append('customer_id', this.companyName);
          formData.append('len', cartItem.length);
          formData.append('wed', cartItem.width);
          formData.append('qual', cartItem.quality);
          formData.append('gsm', cartItem.gsm);
          if (cartItem.isReel == 'Yes') {
            formData.append('qty', cartItem.searchedWith.qty);
          } else {
            formData.append('qty', cartItem.selectedSize);
          }
          formData.append('deliv', this.delivery);
          formData.append('company', cartItem.searchedResult.company);
          formData.append('gwd', cartItem.searchedResult.gwd);
          formData.append('search_history_id', cartItem.searchedResult.search_history_id);
          formData.append('stock_id', cartItem.stock_id);
          formData.append('is_reel', cartItem.isReel);


          this.apiService.post('API_addorder/add_order', formData).subscribe((res: any) => {
            orderPlaced++;
            if (orderPlaced == this.cart.length) {
              this.postOrderPlaced();
            }
          }, () => {
            orderPlaced++;
            if (orderPlaced == this.cart.length) {
              this.postOrderPlaced();
            }
          });

        });
      } else {
        this.utilitiesService.presentErrorAlert('Alert', 'Please enter all mandatory fields.');
      }
    }
  }

  postOrderPlaced() {
    this.utilitiesService.dismissLoading();
    this.utilitiesService.cart = [];
    this.utilitiesService.presentErrorAlert('New Order Added', 'Your order is placed successfully.');
    this.router.navigate([`/nearest-sizes`]);
  }

  resetForm() {
    this.companyName = '';
    this.delivery = '';
  }

  onPlaceOrderHeaderClick() {
    if (this.confirmDetails) {
      this.visibleContent = 'place_order';
    }
  }

  removeFromCart(index) {
    this.utilitiesService.cart.splice(index, 1);
    if (this.utilitiesService.cart.length == 0) {
      this.router.navigate([`/nearest-sizes`]);
    }
  }

  goBack() {
    this.location.back();
  }

  get qtyTotal() {
    let total = 0;
    this.utilitiesService.cart.forEach(cartItem => {
      if (cartItem.isReel == 'Yes') {
        total += +cartItem.searchedWith.qty;
      } else {
        total += +cartItem.selectedSize;
      }
    });
    return total;
  }

  get qtyAsPerYourSizeTotal() {
    let total = 0;
    this.utilitiesService.cart.forEach(cartItem => {
      if (cartItem.isReel == 'Yes') {
        total += +cartItem.searchedWith.qty;
      } else {
        if (cartItem.selectedSize) {
          total += cartItem.selectedSize * cartItem.searchedResult.total_ups
        }
      }
    });
    return total;
  }
}

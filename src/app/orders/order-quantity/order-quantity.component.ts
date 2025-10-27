import { Component, Input, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { APIService } from 'src/app/services/api.services';
import { UtilitiesService } from 'src/app/services/utilities.services';

@Component({
    selector: 'app-order-quantity',
    templateUrl: './order-quantity.component.html',
    styleUrls: ['./order-quantity.component.scss']
})

export class OrderQuantityComponent implements OnInit {

    @Input() orderDetails: any = {};

    quantity = 0;
    delivery_at = '';

    constructor(private modalCtrl: ModalController, private apiService: APIService, private utilitiesService: UtilitiesService) {
    }

    ngOnInit() {
        this.quantity = this.orderDetails.qty;
        this.delivery_at = this.orderDetails.delivery_at;
    }

    closeModal(close = false) {
        if (close) {
            this.modalCtrl.dismiss({
                dismissed: true
            });
            return;
        }

        if (this.quantity && this.delivery_at) {
            const formData = new FormData();
            formData.append('order_id', this.orderDetails.id);
            formData.append('quantity', this.quantity + '');
            formData.append('delivery_at', this.delivery_at + '');

            this.apiService.post('API_addorder/update_quantity', formData).subscribe((res: any) => {
                this.utilitiesService.dismissLoading();
                if (res && res.data) {
                    this.modalCtrl.dismiss({
                        dismissed: true,
                        data: this.orderDetails
                    });
                } else {
                    this.utilitiesService.presentErrorAlert('Update order failed', ' ');
                }
            }, () => {
                this.utilitiesService.dismissLoading();
                this.utilitiesService.presentErrorAlert();
            });
        } else {
            this.utilitiesService.presentErrorAlert('Alert', 'Please enter all mandatory fields.');
        }

    }
}
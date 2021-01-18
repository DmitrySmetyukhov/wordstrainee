import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {Category, DataService} from '../../shared/services/data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.scss'],
})
export class CategoryEditComponent implements OnInit {
    @Input() category: Category;
    @Input() categories: Category[];
    form: FormGroup;

    constructor(
        private _modalCtrl: ModalController,
        private _fb: FormBuilder,
        private _dataService: DataService,
        private _toastCtrl: ToastController
    ) {
    }

    ngOnInit() {
        this.form = this._fb.group({
            name: ['', [
                Validators.maxLength(30),
                Validators.required,
                Validators.minLength(3)
            ]]
        });

        if (this.category) {
            this.name.setValue(this.category.name);
        }
    }

    get isDisabled() {
        return this.name.value === this.category?.name || this.form.invalid;
    }

    get name() {
        return this.form.get('name');
    }

    dismiss() {
        this._modalCtrl.dismiss();
    }

    async save() {
        if (this.categories.find(category => category.name === this.name.value)) {
            return this.presentToast();
        }
        if (this.category) {
            await this._dataService.updateCategory(this.category.id, {
                ...this.category,
                ...this.form.value
            });
        } else {
            await this._dataService.addCategory(this.form.value);
        }

        this.dismiss();
    }

    async presentToast() {
        const toast = await this._toastCtrl.create({
            message: 'This category already exists!',
            position: 'bottom',
            color: 'danger',
            duration: 3000
        });

        toast.present();
    }
}

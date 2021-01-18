import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Category, DataService} from '../../shared/services/data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-category-edit',
    templateUrl: './category-edit.component.html',
    styleUrls: ['./category-edit.component.scss'],
})
export class CategoryEditComponent implements OnInit {
    @Input() category: Category;
    form: FormGroup;

    constructor(
        private _modalCtrl: ModalController,
        private _fb: FormBuilder,
        private _dataService: DataService
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
}

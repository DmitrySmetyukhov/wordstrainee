import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, DataService} from '../shared/services/data.service';
import {Subscription} from 'rxjs';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryEditComponent} from './category-edit/category-edit.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit, OnDestroy {
    categories: Category[] = [];
    deletePending = false;
    form: FormGroup;
    private _pending = false;
    private _duplicate = false;
    private _subscription = new Subscription();

    constructor(
        private dataService: DataService,
        private actionSheetController: ActionSheetController,
        private fb: FormBuilder,
        private modalCtrl: ModalController
    ) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: ['', [
                Validators.maxLength(30),
                Validators.required,
                Validators.minLength(3)
            ]]
        });

        this.form.valueChanges.subscribe(val => {
            this._duplicate = !!this.categories.find(cat => cat.name === val.name);
        });

        this._subscription.add(this.dataService.categories$.subscribe(
            list => {
                this.categories = list;
            }
        ));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    get name() {
        return this.form.get('name');
    }

    get addDisabled() {
        return this.form.invalid || this._pending || this._duplicate;
    }

    async addCategory() {
        if (this.addDisabled) {
            return;
        }
        this._pending = true;
        await this.dataService.addCategory({
            name: this.name.value
        });

        this._pending = false;
        this.form.reset();
    }

    async deleteCategory(id: string) {
        this.deletePending = true;
        await this.dataService.deleteCategory(id);

        this.deletePending = false;
    }

    async presentActionSheet(category: Category) {
        const actionSheet = await this.actionSheetController.create({
            header: 'Confirm action:',
            cssClass: 'my-custom-class',
            buttons: [{
                text: `Delete ${category.name}`,
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    this.deleteCategory(category.id);
                }
            },
                {
                    text: 'Cancel',
                    icon: 'close',
                    role: 'cancel'
                }]
        });
        await actionSheet.present();
    }

    async openEditCategoryModal(category?: Category) {
        const modal = await this.modalCtrl.create({
            component: CategoryEditComponent,
            componentProps: {
                category
            }
        });

        await modal.present();
    }
}

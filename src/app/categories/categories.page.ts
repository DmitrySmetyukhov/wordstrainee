import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, DataService} from '../shared/services/data.service';
import {Subscription} from 'rxjs';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CategoryEditComponent} from './category-edit/category-edit.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit, OnDestroy {
    filtersForm: FormGroup;
    pending = false;
    filteredCategories: Category[];
    private _subscription = new Subscription();
    private _categories: Category[];

    constructor(
        private _fb: FormBuilder,
        private dataService: DataService,
        private actionSheetController: ActionSheetController,
        private modalCtrl: ModalController
    ) {
    }

    ngOnInit() {
        this.filtersForm = this._fb.group({
            search: ['']
        });

        this.filtersForm.valueChanges.subscribe(val => this._filterAction());

        this._subscription.add(this.dataService.categories$.subscribe(
            list => {
                this._categories = list;
                this._filterAction();
            }
        ));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    get search() {
        return this.filtersForm.get('search');
    }

    async deleteCategory(id: string) {
        this.pending = true;
        await this.dataService.deleteCategory(id);

        this.pending = false;
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
                category,
                categories: this._categories
            }
        });

        await modal.present();
    }

    private _filterAction() {
        this.filteredCategories = this._categories
            .filter(category => category.name.includes(this.search.value.trim().toLowerCase()));
    }
}

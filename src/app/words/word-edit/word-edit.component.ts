import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, DataService, Word} from '../../shared/services/data.service';

@Component({
    selector: 'app-word-edit',
    templateUrl: './word-edit.component.html',
    styleUrls: ['./word-edit.component.scss'],
})
export class WordEditComponent implements OnInit {
    @Input() word: Word;
    @Input() words: Word[];
    @Input() categories: Category[];
    form: FormGroup;
    pending = false;

    constructor(
        private _modalCtrl: ModalController,
        private _fb: FormBuilder,
        private _dataService: DataService,
        private _toastCtrl: ToastController
    ) {
    }

    ngOnInit() {
        this.form = this._fb.group({
            origin: ['', [Validators.required, Validators.maxLength(200)]],
            categoryId: ['', [Validators.required]],
            translation: ['', [Validators.required, Validators.maxLength(200)]]
        });

        if (this.word) {
            this.form.patchValue(this.word);
        }
    }

    dismiss() {
        this._modalCtrl.dismiss();
    }

    get noChanges() {
        if (this.word) {
            const fVal = this.form.value;
            return fVal.origin === this.word.origin && fVal.translation === this.word.translation
                && fVal.categoryId === this.word.categoryId;
        }
    }

    async save() {
        const dto: Word = {
            origin: this.form.get('origin').value.replace(/(\r\n|\n|\r)/gm, ' ').replace(/  +/g, ' ').trim().toLowerCase(),
            translation: this.form.get('translation').value.replace(/(\r\n|\n|\r)/gm, ' ').replace(/  +/g, ' ').trim().toLowerCase(),
            categoryId: this.form.get('categoryId').value
        };

        if (this.words.find(word => word.origin === dto.origin && !this.word)) {
            return this._presentToast();
        }

        this.pending = true;

        if (this.word) {
            await this._dataService.updateWord(this.word.id, dto);
        } else {
            await this._dataService.addWord(dto);
        }

        this.dismiss();
    }

    private async _presentToast() {
        const toast = await this._toastCtrl.create({
            message: 'This word already exists!',
            position: 'bottom',
            color: 'danger',
            duration: 3000
        });

        toast.present();
    }
}

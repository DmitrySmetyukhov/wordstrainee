import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, DataService, Word} from '../../shared/services/data.service';

@Component({
    selector: 'app-word-edit',
    templateUrl: './word-edit.component.html',
    styleUrls: ['./word-edit.component.scss'],
})
export class WordEditComponent implements OnInit {
    @Input() word: Word;
    @Input() categories: Category[];
    form: FormGroup;
    pending = false;

    constructor(
        private _modalCtrl: ModalController,
        private fb: FormBuilder,
        private dataService: DataService
    ) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            origin: ['', [Validators.required, Validators.maxLength(200)]],
            translation: ['', [Validators.required, Validators.maxLength(200)]],
            categoryId: ['', [Validators.required]]
        });

        if (this.word) {
            this.form.patchValue(this.word);
        }
    }

    dismiss() {
        this._modalCtrl.dismiss();
    }

    async save() {
        this.pending = true;
        if (this.word) {
            await this.dataService.updateWord(this.word.id, this.form.value);
        } else {
            await this.dataService.addWord(this.form.value);
        }

        this.dismiss();
    }
}

import { Component, inject, model } from '@angular/core'
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElement } from '../../../interfaces/PeriodicElement';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'app-edit-dialog',
    templateUrl: './edit-dialog.component.html',
    standalone: true,
    imports: [
        AsyncPipe,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
    ],
})
export class EditDialog {
    readonly dialogRef = inject(MatDialogRef<EditDialog>);
    readonly data = inject<PeriodicElement>(MAT_DIALOG_DATA);
    readonly element = model<PeriodicElement>(this.data)

    error$ = toObservable(this.element).pipe(
        map(({ name, symbol, weight }) => {
            return {
                name: /^[a-zA-Z]{1,32}$/.test(name) ? '' : 'Invalid name',
                symbol: /^[a-zA-Z]{1,3}$/.test(symbol) ? '' : 'Invalid symbol',
                weight: weight <= 100 && weight >= 0 ? '' : 'Weight out of range'
            }
        })
    )

    nameError$ = this.error$.pipe(map(e => e.name))
    symbolError$ = this.error$.pipe(map(e => e.symbol))
    weightError$ = this.error$.pipe(map(e => e.weight))

    isError$ = this.error$.pipe(map(e => Object.values(e).some(e => e)))

    onChangeInput(property: keyof PeriodicElement, event: Event) {
        this.element.update((previous: PeriodicElement) => ({
            ...previous,
            [property]: (event.target as HTMLInputElement).value
        }))
    }

    onDiscardClick(): void {
        this.dialogRef.close();
    }
}
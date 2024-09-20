import { Component, inject, model } from '@angular/core'
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface PeriodicElement {
    position: number,
    name: string,
    weight: number,
    symbol: string
}

@Component({
    selector: 'app-edit-dialog',
    templateUrl: './edit-dialog.component.html',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
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
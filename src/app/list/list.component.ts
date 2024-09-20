import { Component, inject, model, Pipe, PipeTransform } from '@angular/core'
import { FormControl } from '@angular/forms';
import { NgFor } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { EditDialog } from './edit-dialog/edit-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';

interface PeriodicElement {
    position: number,
    name: string,
    weight: number,
    symbol: string
}

@Pipe({
    name: 'nameQueryFilter',
    standalone: true
})
export class NameQueryFilter implements PipeTransform {
    transform(elements: PeriodicElement[], query: string): any {
        return elements.filter((element) => element.name.startsWith(query))
    }
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    standalone: true,
    imports: [
        NgFor,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        NameQueryFilter,
        ReactiveFormsModule
    ]
})
export class ListComponent {
    readonly ELEMENT_DATA = model<PeriodicElement[]>([
        { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
        { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
        { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
        { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
        { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
        { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
        { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
        { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
        { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
        { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    ]);
    readonly queryName = new FormControl('');
    debouncedQueryName = ''

    dialog = inject(MatDialog)

    constructor() {
        this.queryName.valueChanges.pipe(
            debounceTime(2000),

            distinctUntilChanged()
        ).subscribe(value => {
            this.debouncedQueryName = value!;
        });
    }

    openEditDialog(element: PeriodicElement) {
        const dialogRef = this.dialog.open(EditDialog, {
            data: { ...element }
        })

        dialogRef.afterClosed().subscribe((editedElement) => {
            if (editedElement !== undefined) {
                this.ELEMENT_DATA.update(element_data => (
                    element_data.map((element) => (
                        editedElement.position === element.position ?
                            { ...editedElement } : element
                    ))
                ))
            }
        })
    }
}

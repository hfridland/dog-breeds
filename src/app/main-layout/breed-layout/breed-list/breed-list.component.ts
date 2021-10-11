import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BreedsService } from '../../../services/breeds.service';
import { BreedItem } from '../../../interfaces';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-breed-list',
  templateUrl: './breed-list.component.html',
  styleUrls: ['./breed-list.component.scss'],
})
export class BreedListComponent implements OnInit, OnDestroy {
  breedItems: BreedItem[];
  bSub: Subscription;
  @Output() onSelectBreed = new EventEmitter<BreedItem>();
  searchStr: string;

  constructor(
    private breedsService: BreedsService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bSub = this.breedsService.getAll().subscribe(
      (breedItems) => {
        this.breedItems = breedItems;
      },
      (error) => {
        this._snackBar.open(error, 'Close');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.bSub) {
      this.bSub.unsubscribe();
    }
  }

  selected(isSel: boolean, breed: string, subBreed: string) {
    if (isSel) {
      this.onSelectBreed.emit({ breed: breed, subBreed: subBreed });
    }
  }
}

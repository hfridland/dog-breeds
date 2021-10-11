import { Component, OnInit } from '@angular/core';
import { BreedItem } from '../../interfaces';

@Component({
  selector: 'app-breed-layout',
  templateUrl: './breed-layout.component.html',
  styleUrls: ['./breed-layout.component.scss'],
})
export class BreedLayoutComponent implements OnInit {
  breedItem: BreedItem;

  constructor() {}

  ngOnInit(): void {}

  selectBreed(breedItem: BreedItem) {
    this.breedItem = breedItem;
  }
}

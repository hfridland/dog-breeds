import { Pipe, PipeTransform } from '@angular/core';
import { BreedItem } from '../interfaces';

@Pipe({
  name: 'searchBreeds',
})
export class SearchBreedsPipe implements PipeTransform {
  transform(breedItems: BreedItem[], search = ''): BreedItem[] {
    if (!search.trim()) {
      return breedItems;
    }
    return breedItems.filter((breedItem) => {
      return (
        breedItem.breed.toLowerCase().includes(search.toLowerCase()) ||
        breedItem.subBreed.toLowerCase().includes(search.toLowerCase())
      );
    });
  }
}

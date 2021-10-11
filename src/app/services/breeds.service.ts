import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BreedItem } from '../interfaces';
import { map } from 'rxjs/operators';

interface MsgBreeds {
  [key: string]: [];
}

interface AllBreeds {
  message: MsgBreeds;
  status: string;
}

interface BreedImages {
  message: string[];
  status: string;
}

@Injectable({ providedIn: 'root' })
export class BreedsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<BreedItem[]> {
    return this.http.get<AllBreeds>('https://dog.ceo/api/breeds/list/all').pipe(
      map((allBreeds) => {
        if (allBreeds.status !== 'success') {
          throw new Error(`Unknown request status: ${allBreeds.status}`);
        }
        const msgBreeds: MsgBreeds = allBreeds.message;
        return Object.keys(msgBreeds).reduce((arr: BreedItem[], breed) => {
          const res: BreedItem[] = [{ breed, subBreed: '' }];

          const subBreeds = msgBreeds[breed].map((sb) => {
            return { breed, subBreed: sb };
          });
          return arr.concat(res, subBreeds);
        }, []);
      })
    );
  }

  getBreedImages(breed: string, subBreed: string): Observable<string[]> {
    return this.http
      .get<BreedImages>(`https://dog.ceo/api/breed/${breed}/images`)
      .pipe(
        map((breedImages) => {
          if (breedImages.status !== 'success') {
            throw new Error(`Unknown request status: ${breedImages.status}`);
          }
          if (subBreed.trim()) {
            return breedImages.message.filter((sImage) => {
              const arr = sImage.split('/');
              const breedFullName = arr[arr.length - 2];
              return breedFullName.includes(`-${subBreed}`);
            });
          } else {
            return breedImages.message;
          }
        })
      );
  }
}

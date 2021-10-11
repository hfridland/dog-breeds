import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BreedItem, UserComment } from '../interfaces';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface FbCreateResponse {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CommentsService {
  constructor(private http: HttpClient) {}

  create(userComment: UserComment): Observable<UserComment> {
    const breedDescription = CommentsService.getBreedDescription(
      userComment.breedItem
    );
    return this.http
      .post<FbCreateResponse>(
        `${environment.fbDbUrl}/${breedDescription}/userComment.json`,
        userComment
      )
      .pipe(
        map((response) => {
          return {
            ...userComment,
            id: response.name,
            date: new Date(userComment.date),
          };
        })
      );
  }

  getUserComments(breedItem: BreedItem): Observable<UserComment[]> {
    const breedDescription = CommentsService.getBreedDescription(breedItem);
    return this.http
      .get(`${environment.fbDbUrl}/${breedDescription}/userComment.json`)
      .pipe(
        tap(),
        map((response: { [key: string]: any }) => {
          if (!response) {
            return [];
          }
          return Object.keys(response).map((key) => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date),
          }));
        })
      );
  }

  private static getBreedDescription(breedItem: BreedItem): string {
    return breedItem.subBreed
      ? `${breedItem.breed}-${breedItem.subBreed}`
      : breedItem.breed;
  }

  update(userComment: UserComment): Observable<UserComment> {
    const breedDescription = CommentsService.getBreedDescription(
      userComment.breedItem
    );
    return this.http.patch<UserComment>(
      `${environment.fbDbUrl}/${breedDescription}/userComment/${userComment.id}.json`,
      userComment
    );
  }

  remove(userComment: UserComment) {
    const breedDescription = CommentsService.getBreedDescription(
      userComment.breedItem
    );
    return this.http.delete<void>(
      `${environment.fbDbUrl}/${breedDescription}/userComment/${userComment.id}.json`
    );
  }
}

export interface BreedItem {
  breed: string;
  subBreed: string;
}

export interface User {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}

export interface FbAuthResponse {
  idToken: string;
  expiresIn: string;
  email: string;
}

export interface UserComment {
  id?: string;
  breedItem: BreedItem;
  email: string;
  comment: string;
  date: Date;
}

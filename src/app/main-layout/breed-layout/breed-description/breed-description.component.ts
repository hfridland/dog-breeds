import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreedItem, UserComment } from '../../../interfaces';
import { Subscription } from 'rxjs';
import { BreedsService } from '../../../services/breeds.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ShowImageDialogComponent } from './show-image-dialog/show-image-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { CommentsService } from '../../../services/comments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditUserCommentDialogComponent } from './edit-user-comment-dialog/edit-user-comment-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breed-description',
  templateUrl: './breed-description.component.html',
  styleUrls: ['./breed-description.component.scss'],
})
export class BreedDescriptionComponent implements OnInit, OnDestroy {
  fBreedItem: BreedItem;
  imgsSub: Subscription;
  commentsSub: Subscription;
  updCommentSub: Subscription;
  delCommentSub: Subscription;
  breedImages: string[] = [];
  currentlyShownImages: string[] = [];
  pageSize = 20;
  newComment: string;
  userComments: UserComment[];

  @ViewChild('paginator') paginator: MatPaginator;

  constructor(
    private breedsService: BreedsService,
    public dialog: MatDialog,
    public auth: AuthService,
    private commentsService: CommentsService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  @Input() set breedItem(value: BreedItem) {
    if (value === undefined) {
      return;
    }
    this.fBreedItem = value;
    if (this.imgsSub) {
      this.imgsSub.unsubscribe();
    }
    if (this.commentsSub) {
      this.commentsSub.unsubscribe();
    }
    this.imgsSub = this.breedsService
      .getBreedImages(this.fBreedItem.breed, this.fBreedItem.subBreed)
      .subscribe((breedImages) => {
        this.breedImages = breedImages;
        this.paginator.pageIndex = 0;
        this.calcCurrentlyShownImages(0);
      });
    this.commentsSub = this.commentsService
      .getUserComments(this.fBreedItem)
      .subscribe(
        (userComments) => {
          this.userComments = userComments;
        },
        (error) => {
          console.log(error.message);
        }
      );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.imgsSub) {
      this.imgsSub.unsubscribe();
    }
    if (this.commentsSub) {
      this.commentsSub.unsubscribe();
    }
    if (this.updCommentSub) {
      this.updCommentSub.unsubscribe();
    }
    if (this.delCommentSub) {
      this.delCommentSub.unsubscribe();
    }
  }

  calcCurrentlyShownImages(startIndex: number) {
    this.currentlyShownImages = this.breedImages.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onPage(pageEvent: PageEvent) {
    this.calcCurrentlyShownImages(pageEvent.pageIndex * this.pageSize);
  }

  openShowImageDialog(image: string) {
    // the dialog does not opens if I call dialog.open directly from anchor around image
    setTimeout(() => {
      this.dialog.open(ShowImageDialogComponent, {
        data: {
          image,
          breedItem: this.fBreedItem,
        },
      });
    }, 100);
  }

  postComment() {
    const userComment: UserComment = {
      breedItem: this.fBreedItem,
      email: this.auth.email,
      comment: this.newComment,
      date: new Date(),
    };
    //console.log(userComment);
    this.commentsService.create(userComment).subscribe(
      (userComment: UserComment) => {
        this.newComment = '';
        this._snackBar.open('Comment Created', 'Close', { duration: 5000 });
      },
      (error) => {
        this._snackBar.open(`Error ${error.message}`, 'Close');
      }
    );
  }

  editCommentDialog(userComment: UserComment) {
    if (!this.auth.email) {
      this.router.navigate(['/login'], {
        queryParams: {
          action: 'login',
          message: 'This operation for logged users only',
        },
      });
      return;
    } else if (this.auth.email !== userComment.email) {
      this._snackBar.open('You can edit YOURS comments only', 'Close');
      return;
    }

    const dialogRef = this.dialog.open(EditUserCommentDialogComponent, {
      width: '80%',
      data: {
        comment: userComment.comment,
      },
    });
    dialogRef.afterClosed().subscribe((comment) => {
      if (!comment) {
        return;
      }
      userComment.comment = comment;
      this.updCommentSub = this.commentsService.update(userComment).subscribe(
        () => {
          this._snackBar.open('Comment saved', 'Close');
        },
        (error) => {
          this._snackBar.open(`Error ${error.message}`, 'Close');
        }
      );
      //console.log(result);
    });
  }

  deleteComment(userComment: UserComment) {
    if (!userComment.email) {
      this.router.navigate(['/login'], {
        queryParams: { message: 'This operation for logged users only' },
      });
      return;
    } else if (this.auth.email !== userComment.email) {
      this._snackBar.open('You can delete YOURS comments only', 'Close');
      return;
    }

    this.delCommentSub = this.commentsService.remove(userComment).subscribe(
      () => {
        this.userComments = this.userComments.filter(
          (uc) => uc.id !== userComment.id
        );
        this._snackBar.open('Comment removed', 'Close');
      },
      (error) => {
        this._snackBar.open(`Error ${error.message}`, 'Close');
      }
    );
  }
}

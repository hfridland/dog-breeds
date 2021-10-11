import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user-comment-dialog',
  templateUrl: './edit-user-comment-dialog.component.html',
  styleUrls: ['./edit-user-comment-dialog.component.scss'],
})
export class EditUserCommentDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditUserCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onCancelClick() {
    this.dialogRef.close();
  }
}

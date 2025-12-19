import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {

  allProfilePictures = ['w.png', 'm.png', 'girl.jpg', 'boy.jpg', '1.jpg', '2.jpg'];

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}

}

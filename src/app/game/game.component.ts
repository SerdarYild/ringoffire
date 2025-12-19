import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { FormsModule } from '@angular/forms';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, getDocs, addDoc, onSnapshot, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerMobileComponent } from "../player-mobile/player-mobile.component";
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { log } from 'console';
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    NgStyle,
    PlayerComponent,
    PlayerMobileComponent,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})

export class GameComponent {
  game: Game = new Game();
  gameId: string | null = null;
  dialogOpen = false;
  gameOver = false;

  private firestore: Firestore = inject(Firestore);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  constructor(public dialog: MatDialog) { }

  async ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.gameId = paramMap.get('id');

      if (this.gameId) {
        const docRef = doc(this.firestore, 'games', this.gameId);

        onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const gameData = docSnap.data();

            this.game.players = gameData['players'];
            this.game.player_images = gameData['player_images'];
            console.log('DEBUG → player_images aus Firestore:', this.game.player_images);

            this.game.stack = gameData['stack'];
            this.game.playedCard = gameData['playedCard'];
            this.game.currentPlayer = gameData['currentPlayer'];
            this.game.pickCardAnimation = gameData['pickCardAnimation'];
            this.game.currentCard = gameData['currentCard'];

            console.log('Spiel in Echtzeit aktualisiert:', this.game);
          } else {
            console.error('Kein Spiel dieser ID gefunden:', this.gameId);
          }
        });
      }
    });
  }

  takeCard() {
    if(this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation && this.game.stack.length > 0) {
      this.game.currentCard = this.game.stack.pop() || '';
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      this.saveGame();
      setTimeout(async () => {
        this.game.playedCard.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        await this.saveGame();
      }, 1000);
    }
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Received change', change);

      if (change) {
        if (change == 'DELETE') {
          this.game.player_images.splice(playerId, 1);
          this.game.players.splice(playerId, 1);
        } else {
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    }, 50);

    dialogRef.afterClosed().subscribe(async (name: string) => {
      (document.activeElement as HTMLElement)?.blur();
      if (name && name.trim().length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('1.jpg');
        await this.saveGame();
      }
    });
  }

  async saveGame() {
    if (!this.gameId) return;
    const gameRef = doc(this.firestore, 'games', this.gameId);

    await updateDoc(gameRef, {
      players: this.game.players,
      player_images: this.game.player_images,
      stack: this.game.stack,
      playedCard: this.game.playedCard,
      currentPlayer: this.game.currentPlayer,
      pickCardAnimation: this.game.pickCardAnimation,
      currentCard: this.game.currentCard
    });
  }
}

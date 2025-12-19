import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Game } from '../../models/game';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { log } from 'console';


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  constructor(
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {

  }

async newGame() {
    const game = new Game();

    const gamesCollection = collection(this.firestore, 'games');
    const docRef = await addDoc(gamesCollection, game.toJson());

    this.router.navigateByUrl(`/game/${docRef.id}`);
  }
}

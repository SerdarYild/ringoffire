export class Game {
  public id: string = '';
  public players: string[] = [];
  public player_images: string[] = [];
  public stack: string[] = [];
  public playedCard: string[] = [];
  public currentPlayer: number = 0;
  public pickCardAnimation = false;
  public currentCard: string = '';

  constructor(baseData?: any) {
    if (baseData) {
      this.players = baseData.players || [];
      this.player_images = baseData.player_images || [];
      this.stack = baseData.stack || [];
      this.playedCard = baseData.playedCard || [];
      this.currentPlayer = baseData.currentPlayer || 0;
    } else {
      for (let i = 1; i < 14; i++) {
        this.stack.push('ace_' + i);
        this.stack.push('hearts_' + i);
        this.stack.push('clubs_' + i);
        this.stack.push('diamonds_' + i);
      }
      shuffle(this.stack);
    }
  }

  public toJson() {
    return {
      players: this.players,
      player_images: this.player_images,
      stack: this.stack,
      playedCard: this.playedCard,
      currentPlayer: this.currentPlayer,
      pickCardAnimation: this.pickCardAnimation,
      currentCard: this.currentCard
    };
  }
}

function shuffle(array: string[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

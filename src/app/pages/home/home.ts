import { Component, signal } from '@angular/core';
import { Confetti } from '../../services/confetti';

import { NgFor, NgForOf, NgIf } from '@angular/common'; // ✅ add this
import { FormsModule } from '@angular/forms'; // ✅ Add this

const DIGITS = 4;

@Component({
  selector: 'app-home',
  imports: [NgForOf, FormsModule, NgFor, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  guess = signal('');
  answer = signal<number[]>([]);
  errorText = signal<string>('');
  message = signal<string>('');

  // signals reactive variable. This holds an array of previous guesses.
  // an array of arrays of numbers, where initial value is a empty 2D array. 
  guessHistory = signal<number[][]>([]);

// gameState = signal<'playing' | 'won' | 'lost'>('playing');
  gameState = signal('initial');

  habits: {name: string, isCompleted: boolean}[] = [
    {name: "I like cows! 😅", isCompleted: false},
    {name: "Signals are neat! 📡", isCompleted: false},
    {name: "Eat moar Chik'n! 🐔", isCompleted: false}
  ];



  constructor(private confettiService: Confetti) {
    while(true) {
      const digits = [];
      for (let i = 0; i < DIGITS; i++) {
      digits.push(Math.floor(Math.random() * 9));
    }

    //first digit cannot be zero
    if (digits[0] === 0) {
      continue; // then try again ^ (restart the loop)
    }

    const digitsSet = new Set(digits);
    if (digitsSet.size === DIGITS) {
      this.answer.set(digits);
      break;
    }
  }
  console.log('The Answer Code:', this.answer());
}

  onCheckboxChange(event: MouseEvent, index: number): void {
    const mouseEvent = event as MouseEvent;
    console.log(mouseEvent);
    this.habits[index].isCompleted = true;
    this.confettiService.launchConfetti(mouseEvent);
  }

  inputChange(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    // console.log('text : ', text); // '1234'
    // console.log('text.length : ', text.length); // 4
    // console.log('DIGITS.length : ', DIGITS); // 4

    this.guess.set(text); // set the guess signal

    
  }

  guessNumber(): void {
    // const guessedNumber = parseInt(this.guess());
    // const actualNumber = 7; // Example actual number 
    
    // validation 1 -- must be exactly DIGITS digits
    if (this.guess().length !== DIGITS) {
      console.log('Error: You must enter exactly', DIGITS, 'digits.');
      this.errorText.set(`You must enter exactly ${DIGITS} digits.`);
      return
    }

    const digits = this.guess().split('').map((s) => +s);
    console.log('digits : ', digits); //[]
    // check for uniqueness 
    const digitsSet = new Set(digits); //{}
    console.log('digitsSet : ', digitsSet);
    // this.guess.set(text);
    
    // validation 2 -- must be unique digits
    if (digitsSet.size !== DIGITS) {
      this.errorText.set('You must enter UNIQUE digits.');
      return;
    }

    const [bulls, cows] = this.bullsCows(digits, this.answer());
    console.log('Bulls:', bulls, 'Cows:', cows);

    // |Update History| Call update() on our guessHistory signal. mutate the existing array.;
    // Essentially push another set of bulls and cows into the history.
    this.guessHistory.update(h => {
      h.push([bulls, cows]);
      return h;
    });

    // Win Condition. When bulls equal 4
    if (bulls === DIGITS) {
      this.message.set(`Woo HOO!! You won! Number of tries: ${this.guessHistory().length}`);
      this.gameState.set('won');
      // this.errorText.set('Congratulations! You guessed the correct number!');
    }
  }

  bullsCows(guess: number[], answer: number[]) {
      let bulls= 0;
      let cows = 0;
      const n = guess.length;
      const bullsUsed = new Set<number>();

      for (let i = 0; i < n; i++) {
        // bull check, index of the guess matches index of the answer-- correct position.
        if(guess[i] === answer[i]) {
          bulls++;
          bullsUsed.add(i);
      }
      }

      for (let i = 0; i < n; i++) {
        // cow check, index of the guess matches value of the answer-- wrong position.
        // if the index has not already been used as a bull and
        if(!bullsUsed.has(i) && answer.includes(guess[i])) {
          cows++;
        }
      }
      return [ bulls, cows ];
    }
  }

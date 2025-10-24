import { Component } from '@angular/core';
import { Confetti } from '../../services/confetti';

import { NgForOf } from '@angular/common'; // ✅ add this
import { FormsModule } from '@angular/forms'; // ✅ Add this

@Component({
  selector: 'app-home',
  imports: [NgForOf, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  habits: {name: string, isCompleted: boolean}[] = [
    {name: "Drink Water 💧", isCompleted: false},
    {name: "Workout 🏋️‍♂️", isCompleted: false},
    {name: "Read 10 Pages 📚", isCompleted: false}
  ];

  constructor(private confettiService: Confetti) {}

  onCheckboxChange(event: MouseEvent, index: number): void {
    const mouseEvent = event as MouseEvent;
    console.log(mouseEvent);
    this.habits[index].isCompleted = true;
    this.confettiService.launchConfetti(mouseEvent);
  }
}
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Car} from "./models/car-model";

@Component({
  selector: '.car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  @Input() car: Car = {
    id: 0,
    brand:"",
    model: "",
    weight: 0,
    isAvailable: false
  };
  @Output() emitId = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  emitIdFunction(){
    this.emitId.emit(this.car.id);
  }
}

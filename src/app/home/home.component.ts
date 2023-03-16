import {Component, OnDestroy, OnInit} from '@angular/core';
import {Car} from "./car/models/car-model";
import {CarService} from "../services/car.service";
import {Subscription, throwError} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public cars: Car[] = [];
  public subscription = new Subscription();
  public myForm!: FormGroup;
  public car!: Car;
  public view: string = "home";

  public get brand(){
    return this.myForm.get('brand');
  }

  public get model(){
    return this.myForm.get('model');
  }

  public get weight(){
    return this.myForm.get('weight');
  }

  constructor(private service: CarService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getCars();
    this.createForm();
  }

  private createForm(){
    this.myForm = this.formBuilder.group({
      brand: ["", [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Z]+[a-zA-Z]*$')]],
      model: ["", [Validators.required, Validators.minLength(2), Validators.pattern('^\\S*$')]],
      weight: ["", [Validators.required, Validators.min(500), Validators.pattern('^\\d*[.]?\\d$')]],
      availability: [false]
    },{
      updateOn: 'change'
    });
  }

  getCars(){
    this.subscription.add(
      this.service.getCars().subscribe({
        next: (cars) => {
          this.cars = cars;
          console.log(this.cars);
          },
        error: err => throwError(err)
      })
    )
  }

  addCar(){

    let car = {
      brand: this.myForm?.get("brand")?.value,
      model: this.myForm?.get("model")?.value,
      weight: this.myForm?.get("weight")?.value,
      isAvailable: this.myForm?.get("availability")?.value
    }

    this.subscription.add(
      this.service.addCar(car as Car).subscribe({
        next: () => {
          this.goHome();
          this.getCars();
        },
        error: (err: HttpErrorResponse) =>{
          alert(err)
        }
      })
    )
  }

  getCar(id: number): void{
    this.subscription.add(
      this.service.getCarById(id).subscribe({
        next: car => {
          this.car = car;
          console.log(this.car);
          this.intializeForm();
          this.view = "update";
        },
        error: err => throwError(err)
      })
    )
  }

  updateCar(){
    // let car: Car = this.myForm.value;
    let car: Car = {
      id: this.myForm.get('id')?.value,
      brand: this.myForm.get('brand')?.value,
      model: this.myForm.get('model')?.value,
      weight: this.myForm.get('weight')?.value,
      isAvailable: this.myForm.get('availability')?.value
    };
    console.log(car);

    this.subscription.add(
      this.service.updateCar(this.car.id, car).subscribe({
        next: () => {
          this.goHome();
          this.getCars();
        },
        error: (err: HttpErrorResponse) => alert(err)
      })
    )
  }

  deleteCar(){
    let id = this.car.id;

    this.subscription.add(
      this.service.deleteCar(id).subscribe({
        next: () => {
          this.goHome();
          this.getCars();
        },
        error: (err: HttpErrorResponse) =>{
          alert(err)
        }
      })
    )
  }

  intializeForm(){
    this.myForm.setValue({
      brand: this.car.brand,
      model: this.car.model,
      weight: this.car.weight,
      availability: this.car.isAvailable
    })
  }

  goToAddCar(){
    this.view = "create";
  }

  goHome(){
    this.view = "home";
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

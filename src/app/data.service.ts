import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public cabIndex = new Subject<number>();
  private currentCabIndex: number;
  constructor() { }

  getCurrentCabIndex(){
    return this.currentCabIndex;
  }
  updateCurrentCabIndex(index: number){
    this.currentCabIndex = index;
    this.cabIndex.next(this.currentCabIndex);
  }
}

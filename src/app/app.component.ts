import {Component, OnInit} from '@angular/core';
import {cabList} from './data';
import {DataService} from "./data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  cabList;
  activeIndex = 0;
  SevenSeaterCabCount = 0;
  FourSeaterCabCount = 0;
  employeeCount = 0;
  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.cabList = cabList;
    cabList.forEach((cab) => {
      this.employeeCount += cab.cabUsersList.length;
      if(cab.cabType == "7"){
        this.SevenSeaterCabCount++;
      }else{
        this.FourSeaterCabCount++;
      }
      console.log(cab);
    });
  }

  onSelectCab(e, index) {
    this.activeIndex = index;
    this.dataService.updateCurrentCabIndex(index);
  }
}

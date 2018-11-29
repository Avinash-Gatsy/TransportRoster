import {Component, OnInit, ViewChild} from '@angular/core';
import {} from '@types/googlemaps';
import {cabList} from '../data';
import {DataService} from "../data.service";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  @ViewChild('googleMap')
  gmapElement: any;
  map: google.maps.Map;
  markersList: any = [];
  markerArr = [];
  currentCabIndex: number = 0;
  waypts = [];
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer
  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    const mapProp = {
      center: new google.maps.LatLng(13.0827, 80.2707),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      // mapTypeId: google.maps.MapTypeId.HYBRID
      // mapTypeId: google.maps.MapTypeId.SATELLITE
      // mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.markers();
    this.populateMarkers();
    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay);
    this.dataService.cabIndex.subscribe((index) => {
      this.currentCabIndex = index;
      this.clearMarkers();
      this.markers();
      this.populateMarkers();
      this.directionsDisplay.setMap(null);
      this.directionsDisplay.setMap(this.map);
      this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay);
    })
  }

  markers() {
    cabList[this.currentCabIndex].cabUsersList.forEach((user,i) => {
      this.markersList.push({
        lat: user.latitude,
        lng: user.longitude,
        toolTip: `${user.name}-${user.gender}`,
        stopover: true
      });
    });
    console.log(this.markersList);
  }

  populateMarkers() {
    this.markersList.forEach((marker) => {
      let mark = new google.maps.Marker({position: new google.maps.LatLng(marker.lat, marker.lng)});
      let infowindow = new google.maps.InfoWindow({content: marker.toolTip});
      infowindow.open(this.map, mark);
      this.markerArr.push(mark);
      mark.setMap(this.map);
    });
  }

  clearMarkers() {
    while (this.markerArr.length) {
      this.markerArr.pop().setMap(null);
    }
    this.markersList = [];
    this.waypts = []
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    this.generateWaypoints();
    directionsService.route({
      origin: {lat: 12.9908, lng: 80.2469},
      destination: {
        lat: parseFloat(cabList[this.currentCabIndex].cabUsersList[cabList[this.currentCabIndex].cabUsersList.length - 1].latitude),
        lng: parseFloat(cabList[this.currentCabIndex].cabUsersList[cabList[this.currentCabIndex].cabUsersList.length - 1].longitude)
      },
      travelMode: 'DRIVING',
      waypoints: this.waypts,
      optimizeWaypoints: true
    }, (response, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    })
  }
  generateWaypoints(){
    cabList[this.currentCabIndex].cabUsersList.forEach((user)=>{
      this.waypts.push({
        location: {
          lat: parseFloat(user.latitude),
          lng: parseFloat(user.longitude)
        },
        stopover: true
      })
    })
  }
}

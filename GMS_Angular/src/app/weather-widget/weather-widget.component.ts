import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [NgIf],
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.scss'
})
export class WeatherWidgetComponent implements OnInit {
  WeatherData:any;

  constructor() { }

  ngOnInit() {
    this.WeatherData = {
      main : {},
      isDay: true
    };
    this.getWeatherData();
  }

  getWeatherData() {
    fetch('https://api.openweathermap.org/data/2.5/weather?id=5017185&appid=b6a6ff094d3db9361ffff3c775fc6e65&units=imperial')
    .then(response=>response.json())
    .then(data=>{this.setWeatherData(data);})

    // let data = JSON.parse('{"coord":{"lon":10.99,"lat":44.34},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"base":"stations","main":{"temp":284.24,"feels_like":283.34,"temp_min":283.18,"temp_max":284.64,"pressure":1011,"humidity":74,"sea_level":1011,"grnd_level":943},"visibility":10000,"wind":{"speed":1.24,"deg":61,"gust":1.1},"rain":{"1h":0.4},"clouds":{"all":100},"dt":1714145597,"sys":{"type":2,"id":2004688,"country":"IT","sunrise":1714104829,"sunset":1714155208},"timezone":7200,"id":3163858,"name":"Zocca","cod":200}');
    // this.setWeatherData(data);
  }

  setWeatherData(data: any) {
    this.WeatherData = data;
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    this.WeatherData.condition = this.WeatherData.weather[0].main;
    this.WeatherData.temp = (this.WeatherData.main.temp).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like).toFixed(0);
    this.WeatherData.windSpeed = (this.WeatherData.wind.speed).toFixed(0);
  }
}
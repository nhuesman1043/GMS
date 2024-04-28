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

  //Initialize the data
  ngOnInit() {
    this.WeatherData = {
      main : {},
      isDay: true
    };
    this.getWeatherData();
  }

  //Get the weather data from the .json file
  getWeatherData() {
    fetch('https://api.openweathermap.org/data/2.5/weather?id=5017185&appid=b6a6ff094d3db9361ffff3c775fc6e65&units=imperial')
    .then(response=>response.json())
    .then(data=>{this.setWeatherData(data);})
  }

  //Calculate the different weather information to be used in the component
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
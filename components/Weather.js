import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import SearchBar from '../components/SearchBar';

export default function Weather({ weatherData, fetchWeatherData }) {
  const { weather, name, main: { temp, humidity, feels_like }, wind: { speed }, rain } = weatherData;
  const [{ main: weatherMain }] = weather;

  let textColor = 'white'; 

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='darkgray' />
      <SearchBar fetchWeatherData={fetchWeatherData} />
      <View style={styles.weatherInfoContainer}>
        <Text style={[styles.text, { color: textColor, fontWeight: 'bold', fontSize: 46 }]}>{name}</Text>
        <Text style={[styles.text, { color: textColor, fontWeight: 'bold' }]}>{weatherMain}</Text>
        <Text style={[styles.text, { color: textColor }]}>{temp} °C</Text>
        <Text style={[styles.text, { color: textColor }]}>Feels Like: {feels_like} °C</Text>
          <Text style={[styles.text, { fontSize: 22 },{ color: textColor } ]}>Humidity: {humidity} %</Text>
          <Text style={[styles.text, { fontSize: 22 }, { color: textColor }]}>Wind Speed: {speed} m/s</Text>
       
      </View>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF407D',
    color: 'white',
    alignItems: 'center',
  },
  weatherInfoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  extraInfo: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    padding: 10,
  },
  info: {
    width: Dimensions.get('screen').width / 2.5,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});

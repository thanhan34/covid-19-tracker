import React, { useEffect, useState } from 'react';
import './App.css';
import {FormControl, MenuItem, Select} from "@material-ui/core";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  
  useEffect(() => {
    //async --> send a request, wait for it, do something with it
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((resonse) => resonse.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  }

  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID 19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select
            variant="outlined"
            value={country}
            onChange={onCountryChange}
          >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
            
          </Select>
        </FormControl>
      </div>
      
      {/*Header*/ }
      {/*Title + slect input dropdown field*/ }
      {/* InfoBoxs*/ }
      {/*InfoBoxs*/ }
      {/*InfoBoxs*/ }
      {/*Table*/ }
      {/*Graph*/ }
      {/*Map*/ }
    </div>
  );
}

export default App;

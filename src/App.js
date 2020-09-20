import React, { useEffect, useState } from 'react';
import './App.css';
import {FormControl, MenuItem, Select} from "@material-ui/core";
import InfoBox from "./InfoBox";
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
      
      <div className="app__stats"> 
            <InfoBox title="Coronavirus Cases" total={1230} cases={1230}/>
            <InfoBox title="Recovered" total={1230} cases={1230}/>
            <InfoBox title="Death" total={1230} cases={1230}/>
              
      </div>
      
      
      {/*Table*/ }
      {/*Graph*/ }
      {/*Map*/ }
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import './App.css';
import { Card,CardContent,FormControl, MenuItem, Select } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData , prettyPrintStart } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

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
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === "worldwide" ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter({ lat: 34.80746, lng: -40.4796});
          setMapZoom(3);
        } else {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4);
        }
      })
  }

  return (
    <div className="app">
      <div className="app__left">
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
          <InfoBox
            isRed
            active={casesType === "cases"} 
            onClick = {e=> setCasesType("cases")}
            title="Coronavirus Cases" 
            total={prettyPrintStart(countryInfo.cases)} 
            cases={prettyPrintStart(countryInfo.todayCases)} />
          <InfoBox 
            active={casesType === "recovered"} 
            onClick = {e=> setCasesType("recovered")}
            title="Recovered" 
            total={prettyPrintStart(countryInfo.recovered)} 
            cases={prettyPrintStart(countryInfo.todayRecovered)} />
          <InfoBox 
            isRed
            active={casesType === "deaths"} 
            onClick = {e=> setCasesType("deaths")}
            title="Death" 
            total={prettyPrintStart(countryInfo.deaths)} 
            cases={prettyPrintStart(countryInfo.todayDeaths)} />

        </div>

        <Map
          casesType={casesType} 
          countries={mapCountries}
          center={mapCenter} 
          zoom={mapZoom}/>
      </div>
      <Card className="app_right">
          <CardContent>
              <h3>Live Cases by Country</h3>
              <Table countries={tableData}/>
              <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
              <LineGraph className="app__graph" casesType={casesType}/>
          </CardContent>
      </Card>        
    </div>
  );
}

export default App;

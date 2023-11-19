import { useState, useEffect } from 'react';
import "./App.css";
import db_service from "./db_service.jsx";
import WeatherInfo from "./weather.jsx"

const Filter = ({ value, onChange }) => {
    // Filters results based on given value
    return (
        <div>
            find countries <input value={value} onChange={onChange} />
        </div>
    )
}

const CountryInfo = ({countryName}) => {
    const [country, setCountry] = useState([]);

    useEffect(() => {
        console.log('effect');
        db_service.getByName(countryName)
            .then(countryInfo => {
                console.log('promise fulfilled');
                setCountry(countryInfo);
            });
    }, []);

    console.log("Country")
    console.log(country)

    return(
        <div>
            {country?.capital ?
                <div>
                    <h2>{countryName}</h2>
                    <p>Capital: {country.capital}</p>
                    <p>Area: {country.area}</p>
                    <h3>Languages</h3>
                    <div>
                        {country.languages && Object.values(country.languages).map((language, index) =>
                            <p key={index}>{language}</p>
                        )}
                    </div>
                    <div>
                        <img src={country.flags.png} alt={countryName} />
                    </div>
                    <div>
                        <WeatherInfo capital={country.capital[0]}/>
                    </div>
                </div>
                : <div></div>}
        </div>
    )
};

const Countries = ({ countries, onCountrySelect }) => {
    // List all countries
    console.log(countries);

    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>;
    } else if (countries.length === 1) {
        return <CountryInfo countryName={countries[0].name.common}/>;
    } else {
        return (
            <div>
                {countries.map((country, index) => (
                    <div key={index}>
                        <span>{country.name.common} </span>
                        <button onClick={() => onCountrySelect(country.name.common)}>Show Info</button>
                    </div>
                ))}
            </div>
        );
    }
};

const App = () => {
    // Main application logic
    const [countries, setCountries] = useState([]);
    const [filter, setFilter] = useState('')
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        console.log('effect');
        db_service.getAll()
            .then(initialPersons => {
                console.log('promise fulfilled');
                setCountries(initialPersons);
            });
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const countriesToShow = filter
        ? countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
        : countries

    console.log("Countries");
    console.log(countries);

    return (
        <div>
            <Filter value={filter} onChange={handleFilterChange} />
            {selectedCountry
                ? <CountryInfo countryName={selectedCountry} />
                : <Countries countries={countriesToShow} onCountrySelect={setSelectedCountry} />
            }
        </div>
    );
};

export default App;

import './css/styles.css';
import {fetchCountries} from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY))

function onSearchInput(e) {
    e.preventDefault();

    const countryName = searchInput.value.trim();

    if (countryName === "") {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
    }
    
    fetchCountries(countryName)
        .then(countries => {
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';
            
            if (countries.length === 1) {
                countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
                countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
            }
            else if (countries.length > 10) {
                alertTooManyMatches();
            } else {
                countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
            }
        })
        .catch(alertWrongName);

}

function renderCountryList(countries) {
    const listMarkup = countries
        .map(({ name, flags }) => {
            return `
        <li class="country-list__item">
            <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 25px height = 25px>
            <h2 class="country-list__name">${name.official}</h2>
        </li>
        `
        })
        .join('');
    return listMarkup;
}

function renderCountryInfo(countries) {
    const infoMarkup = countries
        .map(({ capital, population, languages }) => {
            return `
        <ul class="country-info__list">
            <li class="country-info__item"><span class="country-info__item--weight">Capital:</span> ${capital}</li>
            <li class="country-info__item"><span class="country-info__item--weight">Population:</span> ${population}</li>
            <li class="country-info__item"><span class="country-info__item--weight">Languages:</span> ${Object.values(languages)}</li>
        </ul>
        `
        })
        .join('');
    return infoMarkup;
}


function alertWrongName() {
    Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
    Notify.info('Too many matches found. Please enter a more specific name.');
}
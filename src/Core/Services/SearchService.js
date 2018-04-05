/* eslint-disable */

import moment from 'moment';

const today = moment();
const tomorrow = moment().add(1, 'days');

const ROUTE_CLONE = {
    oCityName: '',
    oCityId: '',
    oLocId: '',
    oInputData: '',

    dCityName: '',
    dCityId: '',
    dLocId: '',
    dInputData: '',
    date: today,
}

const FLIGHT_CLONE = {
    type: '1',
    r: [],
    adt: '1',
    chd: '0',
    inf: '0',
    class: 'Y',
    weekendSearch: {
        enable: false,
        data: {
            month: '',
            startDay: '',
            endDay: ''
        }
    }
};

const HOTEL_CLONE = {
    dIn: today,
    dOut: tomorrow,
    CityId: '',
    CityName: '',
    nat: '182',
    poiLat: '',
    poiLng: '',
    poiName: '',
    hotel: {
        stars: '0+'
    },
    r: [
        {
        	adt: '1',
            chd: {
            	age: []
            }
        }
    ],
    weekendSearch: {
        enable: false,
        data: {
            month: '',
            startDay: '',
            endDay: ''
        }
    }

};

class SearchService {
  static getClone(type) {
    let clone = '';

    switch (type) {
      case 'flight':
        clone = JSON.parse(JSON.stringify(FLIGHT_CLONE));
        break;
      case 'hotel':
        clone = JSON.parse(JSON.stringify(HOTEL_CLONE));
        break;
      case 'route':
        clone = JSON.parse(JSON.stringify(ROUTE_CLONE));
    }

  	return clone;
  }
}

export default SearchService;

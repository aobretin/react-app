import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import ApiService from 'ApiService';
import FormElement from 'FormElement';
import SearchService from 'SearchService';
import moment from 'moment';

import {extendObservable, toJS} from "mobx";
import {observer, inject} from "mobx-react";

const tomorrow = moment(new Date()).add(1,'days');

const Flight_HotelTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@inject("languagesData") @observer
class Flight_Hotel extends Component {
    constructor(props) {
      super(props);

      extendObservable(this, {
  			typeaheadOptions: [],
				showHotelSettings: false,
  			classes: [
  				{ "value": "Y", "text": "Economy" },
  				{ "value": "W", "text": "Premium economy" },
  				{ "value": "C", "text": "Business" },
  				{ "value": "F", "text": "First class" }
  			]
  		});

      props.flight_hotel.h.r.forEach((room, idx) => {
  			if (typeof room.chd === 'undefined') {
  				room.chd = {age: []}
  			}
  		});
    }

    componentWillMount() {
      this.props.flight_hotel.f.r = this.props.flight_hotel.f.r.length ? this.props.flight_hotel.f.r : [
        SearchService.getClone('route'),
        {
            dCityId: '',
            oCityId: '',
            date: tomorrow.toISOString().split('T')[0],
        }
      ]

  		this.populateFlightOccupation();
    }

		switchDestination = flightRoutes => {
			const {
				0: fromRoute,
				1: toRoute
			} = flightRoutes;

			let route1 = {
				oInputData: fromRoute.dInputData,
				dInputData: fromRoute.oInputData,
				oCityName: fromRoute.dCityName,
				dCityName: fromRoute.oCityName,
				date: fromRoute.date,
				oLocId: fromRoute.dLocId,
				dLocId: fromRoute.oLocId,
				oCityId: fromRoute.dCityId,
				dCityId: fromRoute.oCityId
			}

			let route2 = {
				date: toRoute.date,
				oCityId: toRoute.dCityId,
				dCityId: toRoute.oCityId
			}

			let newHotelRoute = {
				CityId: fromRoute.oCityId,
				CityName: fromRoute.oInputData
			}

			this.props.flight_hotel.f.r[0] = Object.assign({}, route1);
			this.props.flight_hotel.f.r[1] = Object.assign({}, route2);

			this.props.flight_hotel.h = Object.assign({}, this.props.flight_hotel.h, newHotelRoute);
		}

    handleDateSelectRange = dates => {
			this.props.flight_hotel.f.r[0].date = this.props.flight_hotel.h.dIn = dates.startDate.format('YYYY-MM-DD');
			this.props.flight_hotel.f.r[1].date = this.props.flight_hotel.h.dOut = dates.endDate !== null ? dates.endDate.format('YYYY-MM-DD') : dates.endDate;
		}

    handleAutocomplete = (value, rIdx, inputType) => {
      if (inputType == 'd') {
        this.props.flight_hotel.h[`CityName`] = value.value.CityName;
  		  this.props.flight_hotel.h[`CityId`] = value.value.CityId;
      }

      this.props.flight_hotel.f.r[rIdx][`${inputType}InputData`] = value.text;
  		this.props.flight_hotel.f.r[rIdx][`${inputType}CityName`] = value.value.CityName;
  		this.props.flight_hotel.f.r[rIdx][`${inputType}CityId`] = value.value.CityId;

			if (inputType == 'o') this.props.flight_hotel.f.r[1][`dCityId`] = value.value.CityId;
			if (inputType == 'd') this.props.flight_hotel.f.r[1][`oCityId`] = value.value.CityId;
  	}

    handleUpdateInput = (query, inputType, idx) => {
  		if (query.length == 0) this.props.flight_hotel.f.r[idx][`${inputType}InputData`] = '';

  		ApiService.getLocations(`/flight-locations.php?q=${query}&lang=en`)
  		.then(res => {
  			let results = [];
  			res.data.forEach(cityObj => {
          const text = cityObj.CityCode != null
                        ? `${cityObj.CityName}, ${cityObj.CityCode.length ? "(" + cityObj.CityCode + "), " : ''} ${cityObj.CountryName}`
                        : `${cityObj.CityName}, ${cityObj.CountryName}`;

  				results.push({
  					text: text,
  					value: cityObj
  				});
  			});

  			this.typeaheadOptions = results;
  		});

			this.props.flight_hotel.f.r[idx][`${inputType}InputData`] = query;
  	}

    handleSelectChange = e => {
      this.props.flight_hotel.h[e.name] = e.value;

      this.populateFlightOccupation();
    }

    populateFlightOccupation = () => {
      let adults = 0;
      let children = 0;
      let Infants = 0;

      this.props.flight_hotel.h.r.forEach(humanType => {
          adults += parseInt(humanType.adt);

          if (humanType.chd.age.length) {
            humanType.chd.age.forEach(age => {
              if (age.length) {
                if (age < parseInt(2)) {
                  Infants++;
                } else {
                  children++;
                }
              }
            });
          }
      });

      this.props.flight_hotel.f.adt = adults;
      this.props.flight_hotel.f.chd = children;
      this.props.flight_hotel.f.inf = Infants;
    }

		toggleRooms = value => {
			const currentValue = parseInt(value[0]);
			const lastValue = this.props.flight_hotel.h.r.length;
			const arrClone = this.props.flight_hotel.h.r.slice();

			if (currentValue > lastValue) {
				const roomClone = SearchService.getClone('hotel').r;
				arrClone.push(roomClone[0]);
			} else {
				arrClone.splice(arrClone.length - 1, 1);
			}

			this.props.flight_hotel.h.r = [...arrClone];
			this.populateFlightOccupation();
		}

    showAges = (e, rIdx, room) => {
  		let selected = parseInt(e.value);

  		if (room.chd.age.length == 2 && e.value == 2) return false;

  		if (selected == 0) {
  			room.chd.age.length = 0;
  		} else if (selected < room.chd.age.length) {
  			room.chd.age.splice(selected, room.chd.age.length - 1);
  		} else {
  			let diff = selected - parseInt(room.chd.age.length);

  			[...Array(diff).keys()].map(el => room.chd.age.push(''));
  		}
  	}

		toggleHotelSettings = () => this.showHotelSettings = !this.showHotelSettings;

    render() {
      const View = Flight_HotelTemplates['DESKTOP'];

  		return (
  				<View
						showHotelSettings={this.showHotelSettings}
            typeaheadOptions={toJS(this.typeaheadOptions)}
            handleDateSelectRange={this.handleDateSelectRange}
            handleAutocomplete={this.handleAutocomplete}
            handleUpdateInput={this.handleUpdateInput}
            handleSelectChange={this.handleSelectChange}
						populateFlightOccupation={this.populateFlightOccupation}
            toggleRooms={this.toggleRooms}
            showAges={this.showAges}
						toggleHotelSettings={this.toggleHotelSettings}
						switchDestination={this.switchDestination}
            {...this.props} />
  		)
    }
}

export default Flight_Hotel;

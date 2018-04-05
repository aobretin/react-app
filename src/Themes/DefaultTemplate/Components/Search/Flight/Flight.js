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
const routeClone = SearchService.getClone('route');

const FlightTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@inject("languagesData") @observer
class Flight extends Component {
    constructor(props) {
      super(props);

      extendObservable(this, {
        typeaheadOptions: [],
        showFlightSettings: false,
  			classes: [
  				{ "value": "Y", "text": "Economy" },
  				{ "value": "W", "text": "Premium economy" },
  				{ "value": "C", "text": "Business" },
  				{ "value": "F", "text": "First class" }
  			],
  			routesByType: {
  				"0": props.flight.r.length && props.flight.type == '0' ? props.flight.r : [
  					routeClone
  				],
  				"1": props.flight.r.length && props.flight.type == '1' ? props.flight.r : [
  					routeClone,
  					{
                dCityId: '',
                oCityId: '',
                date: tomorrow.toISOString().split('T')[0],
            }
  				],
  				"2": props.flight.r.length && props.flight.type == '2' ? props.flight.r :  [
  					routeClone,
  					routeClone
  				]
  			}
  		});
    }

    componentWillMount() {
  		this.setRoutes(this.props.flight.type);
  	}

		switchDestination = (routes, type, idx) => {
			if (type == '1') {
				const {
					0: fromRoute,
					1: toRoute
				} = routes;

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

				this.props.flight.r[0] = Object.assign({}, route1);
				this.props.flight.r[1] = Object.assign({}, route2);
			} else {
				const currentRoute = routes[idx];

				let route = {
					oInputData: currentRoute.dInputData,
					dInputData: currentRoute.oInputData,
					oCityName: currentRoute.dCityName,
					dCityName: currentRoute.oCityName,
					oLocId: currentRoute.dLocId,
					dLocId: currentRoute.oLocId,
					oCityId: currentRoute.dCityId,
					dCityId: currentRoute.oCityId,
					date: currentRoute.date
				}

				this.props.flight.r[idx] = Object.assign({}, route);
			}
		}

    toggleFlightSettings = () => this.showFlightSettings = !this.showFlightSettings;

    setRoutes = type => this.props.flight.r = this.routesByType[type];

		handleDateSelectRange = (dates) => {
      //console.log(dates);

      this.props.flight.r[0].date = dates.startDate.format('YYYY-MM-DD');
			// this.props.flight.r[0].date = dates.startDate.format(dates.startDate._f);
      this.props.flight.r[1].date = dates.endDate !== null ? dates.endDate.format('YYYY-MM-DD') : dates.endDate;
			// this.props.flight.r[1].date = dates.endDate !== null ? dates.endDate.format(dates.endDate._f) : dates.endDate;
		}

		handleDateSelectSingle = (date, idx) => this.props.flight.r[idx].date = date.format('YYYY-MM-DD');

    handleAutocomplete = (value, rIdx, inputType) => {
      this.props.flight.r[rIdx][`${inputType}InputData`] = value.text;

  		this.props.flight.r[rIdx][`${inputType}CityName`] = value.value.CityName;
  		this.props.flight.r[rIdx][`${inputType}CityId`] = value.value.CityId;

  		if (this.props.flight.type == 1) {
  			if (inputType == 'o') this.props.flight.r[1][`dCityId`] = value.value.CityId;
  			if (inputType == 'd') this.props.flight.r[1][`oCityId`] = value.value.CityId;
  		}
  	}

    handleUpdateInput = (query, inputType, idx) => {
  		if (query.length == 0) this.props.flight.r[idx][`${inputType}InputData`] = '';

  		ApiService.getLocations(`/flight-locations.php?q=${query}&lang=en`)
  		.then(res => {
  			let results = [];
  			res.data.forEach(cityObj => {
          const text = cityObj.CityCode != null && (cityObj.CityCode && cityObj.CityCode.length != 0)
                        ? `${cityObj.CityName}, ${cityObj.CityCode.length ? "(" + cityObj.CityCode + "), " : ''} ${cityObj.CountryName}`
                        : `${cityObj.CityName}, (${cityObj.LocationCode}) ${cityObj.CountryName}`;

  				results.push({
  					text: text,
  					value: cityObj
  				});
  			});

  			this.typeaheadOptions = results;
  		})
      .catch(res => console.log(res))
      ;

			this.props.flight.r[idx][`${inputType}InputData`] = query;
  	}

    handleTypeChange = (value) => {
  		this.props.flight.type = value.toString();
  		this.setRoutes(this.props.flight.type);
  	}

    toggleWeSearch = () => {
  		if (this.props.flight.weekendSearch.enable == 'true') {
  			this.props.flight.weekendSearch.enable = 'false';
  		} else {
  			this.props.flight.weekendSearch.enable = 'true';
  		}

  		return true;
  	}

    setWeekendData = (target) => {
  		if (target.name == 'startDay') this.props.flight.weekendSearch.data.endDay = parseInt(target.value) + 1;

  		this.props.flight.weekendSearch.data[target.name] = target.value
  	}

    handleSelectChange = e => this.props.flight[e.name] = e.value;

    addMultiRoute = () => {
			const clone = SearchService.getClone('route');
			const lastElement = this.props.flight.r[this.props.flight.r.length - 1];

			clone.date = lastElement.date;

			//console.log(toJS(this.props.flight.r));

			return this.props.flight.r.push(clone);
		};

  	remMultiRoute = () => this.props.flight.r.splice(-1, 1);

		formatMinMultiDate = idx => {
			const routes = this.props.flight.r;

			routes.forEach((route, rIdx) => {
				if (rIdx > idx && moment(route.date).isBefore(routes[rIdx - 1].date)) {
					route.date = routes[rIdx - 1].date;
				}
			});
		}

    render() {
      const View = FlightTemplates['DESKTOP'];

  		return (
  				<View
            minDate={this.minDate}
            classes={this.classes}
            showFlightSettings={this.showFlightSettings}
            handleTypeChange={this.handleTypeChange}
            handleDateSelectRange={this.handleDateSelectRange}
						handleDateSelectSingle={this.handleDateSelectSingle}
            handleUpdateInput={this.handleUpdateInput}
            handleAutocomplete={this.handleAutocomplete}
            setWeekendData={this.setWeekendData}
            toggleWeSearch={this.toggleWeSearch}
            typeaheadOptions={toJS(this.typeaheadOptions)}
            handleSelectChange={this.handleSelectChange}
            addMultiRoute={this.addMultiRoute}
            remMultiRoute={this.remMultiRoute}
            toggleFlightSettings={this.toggleFlightSettings}
						switchDestination={this.switchDestination}
						formatMinMultiDate={this.formatMinMultiDate}
            {...this.props} />
  		)
    }
}

export default Flight;

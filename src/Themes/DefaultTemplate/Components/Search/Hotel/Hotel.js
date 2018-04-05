import React, {Component} from 'react';

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';
import ApiService from 'ApiService';
import SearchService from 'SearchService';

import moment from 'moment';

import {extendObservable, toJS} from "mobx";
import {observer} from "mobx-react";

const HotelTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class Hotel extends Component {
  constructor(props) {
		super(props);

		extendObservable(this, {
			typeaheadOptions: [],
			showHotelSettings: false
		})

		props.hotel.r.forEach((room, idx) => {
			if (typeof room.chd === 'undefined') {
				room.chd = {age: []}
			}
		});
	}

	toggleHotelSettings = () => this.showHotelSettings = !this.showHotelSettings;

	handleDateSelectRange = dates => {
		this.props.hotel.dIn = dates.startDate.format('YYYY-MM-DD');
		this.props.hotel.dOut = dates.endDate !== null ? dates.endDate.format('YYYY-MM-DD') : dates.endDate;
	}

	handleUpdateInput = query => {
		if (query.length == 0) this.props.hotel[`CityId`] = '';

		ApiService.getLocations(`/hotel-locations.php?q=${query}&lang=en`)
		.then(res => {
			let results = [];
			res.data.forEach(cityObj => {
				results.push({
					text: `${cityObj.Name}, ${cityObj.CityCode.length ? "(" + cityObj.CityCode + "), " : ''} ${cityObj.CountryName}`,
					value: cityObj
				});
			});

			this.typeaheadOptions = results;
		});

		this.props.hotel[`CityName`] = query;
	}

	handleAutocomplete = (params) => {
		this.props.hotel[`CityName`] = params.value.Name;
		this.props.hotel[`CityId`] = params.value.CityId;
	}

	handleSelectChange = e => this.props.hotel[e.name] = e.value;

	toggleWeSearch = () => {
		if (this.props.hotel.weekendSearch.enable == 'true') {
			this.props.hotel.weekendSearch.enable = 'false';
		} else {
			this.props.hotel.weekendSearch.enable = 'true';
		}

		return true;
	}

	setWeekendData = (target) => {
		console.log(target);

		if (target.name == 'startDay') this.props.hotel.weekendSearch.data.endDay = parseInt(target.value) + 1;

		this.props.hotel.weekendSearch.data[target.name] = target.value
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

	toggleRooms = value => {
		const currentValue = parseInt(value[0]);
		const lastValue = this.props.hotel.r.length;
		const arrClone = this.props.hotel.r.slice();

		if (currentValue > lastValue) {
			const roomClone = SearchService.getClone('hotel').r;
			arrClone.push(roomClone[0]);
		} else {
			arrClone.splice(arrClone.length - 1, 1);
		}

		this.props.hotel.r = [...arrClone];
	}

	render() {
      	const View = HotelTemplates['DESKTOP'];

  		return (
  				<View
						handleDateSelectRange={this.handleDateSelectRange}
						handleUpdateInput={this.handleUpdateInput}
						handleAutocomplete={this.handleAutocomplete}
						handleSelectChange={this.handleSelectChange}
						setWeekendData={this.setWeekendData}
            toggleWeSearch={this.toggleWeSearch}
						toggleRooms={this.toggleRooms}
						showAges={this.showAges}
						showHotelSettings={this.showHotelSettings}
						toggleHotelSettings={this.toggleHotelSettings}
						typeaheadOptions={toJS(this.typeaheadOptions)}
						{...this.props} />
  		)
	}
}

export default Hotel;

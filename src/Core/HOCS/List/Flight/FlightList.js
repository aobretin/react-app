/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {withRouter} from 'react-router-dom';

import {deepCopy, formatSelectedFlight} from 'HelperMethods';

import Popup from 'react-popup';

import {observable, extendObservable, toJS, action} from "mobx";
import {observer, inject} from "mobx-react";

const DEFAULT_SIZE = 10;

const MSG = {
	LIMIT_REACHED: 'You have reached your limit for flights, if you continue the last added flight will be replaced by this one',
	REPLACE: 'Are you sure you want to replace this flight ?',
	CANCEL_BTN: 'No, I am sorry!',
	OK_BTN: 'Yes, please!'
}

const FlightListCore = (View) => {
	return @inject("cartData") @withRouter @observer class extends Component {
		static propTypes = {
        SID: PropTypes.string.isRequired,
				serviceSearchData: PropTypes.object.isRequired,
        selectedId: PropTypes.object,
				isFlightAndHotel: PropTypes.bool,
				selectFlight: PropTypes.func
    	}

	    static defaultProps = {
	        selectedId: undefined,
					isFlightAndHotel: false
	    }

		constructor(props){
			super(props);

			console.log(props, 'xxx')

			extendObservable(this, {
				selectedFlightId: props.selectedId ? props.selectedId.flight.ItineraryCode : null,
				code: '',
				searchCounter: 0,
				noResults: false,
				collection: {
					loaded: false,
					allItems: [],
					filtered: [],
					inViewItems: [],
					count: 0,
					ranges: {
						min: 0,
						max: DEFAULT_SIZE
					},
					SID: null,
					initPrices: [],
					filters: {
						prices: [],
						stops: [],
						airlines: []
					},
					filtersLoading: false,
					activeFilters: {
						prices: [],
						airlines: [],
						stops: []
					}
				},
				selectFlight: typeof props.selectFlight != 'undefined' ? props.selectFlight : action(value => {
					value.flight.code = this.code;

					this.selectNewService(value, () => this.selectedFlightId = value.flight.ItineraryCode);
				})
			});

			this.collection.SID = props.SID;
		}

		componentWillMount() {
			this.reqsForCode();
		}

		reqsForCode = () => {
			ApiService.req('/en/dynamic-package/sid/' + this.collection.SID, 'get', null, []).then((result) => {
				if (this.props.history.location.pathname.indexOf("list") < 0) return false;

				if (result.data.hasOwnProperty("code")) {

					if (result.data.code == null) {

						this.collection.noResults = true;
						this.collection.allItems = [];
						this.collection.count = 0;
						this.collection.loaded = true;

						return;
					}

					this.collection.noResults = false;
					this.collection.type = result.data.type;  // set flight type on items
					this.code = result.data.code;
					this.getFlights(result.data.code);
				}else {
					if (this.searchCounter >= 30) {
						this.collection.noResults = true;
						this.collection.allItems = [];
						this.collection.count = 0;
						this.collection.loaded = true;

						// NO RESULTS

						return;
					}
					setTimeout(this.reqsForCode,1000)
					this.searchCounter++;
				}
			})
			.catch((res) => {
				this.collection.noResults = true;
				this.collection.allItems = [];
				this.collection.count = 0;
				this.collection.loaded = true;

				return;
			})
		}

		getFlights = (code) => {
			ApiService.req('/v3/flights?code=' + code, 'get', null, []).then((result) => {

				this.collection.allItems = this.collection.filtered = result.data._embedded.flights.slice();
				this.collection.count = result.data._embedded.flights.length;

				// this.collection.allItems.forEach((flight, index) => console.log(flight, index));

				// parse stops
				let stopsArr = [];
				if (Array.isArray(result.data.stops)) {
					stopsArr = result.data.stops;
				}else if (typeof result.data.stops == 'object') {
					Object.keys(result.data.stops).forEach( (key, val) => {
						stopsArr.push(val);
					})
				}
				stopsArr.forEach( (val, key) => {
					this.collection.filters.stops.push({
						value: val,
						checked: false
					})
				})
				// console.log(JSON.parse(JSON.stringify(this.collection.filters.stops)))

				if (result.data.airlines) result.data.airlines.forEach( airline => {
					this.collection.filters.airlines.push({
						value: airline,
						checked: false
					})
				})

				this.collection.activeFilters["prices"] = [result.data.minPrice, result.data.maxPrice];
				this.collection.initPrices = this.collection.activeFilters["prices"];

				this.collection.loaded = true;

				if (this.props.isFlightAndHotel && !this.props.selectedId) {
					this.props.serviceSearchData.code = code;

					this.selectFlight(
						{
							flight: this.collection.allItems[0],
							selectedRefs: [this.collection.allItems[0].Routes[0].Route[0].Ref, this.collection.allItems[0].Routes[1].Route[0].Ref]
						},
						this.SID,
						this.props.serviceSearchData
					);
				}
			})
		}

		handlePageChange = items => {
			this.collection.inViewItems = items;
		}

		selectNewService = (value = {}, callback) => {
			const SERVICE_NAME = 'flight';

			const {
				addToBucket,
				updateTimestampAndCount,
				computeTotal
			} = this.props.cartData.methods;

			const clone = deepCopy(this.props.cartData);
			const {items, itemsCount, limits} = clone;
			const {empty, services} = items[SERVICE_NAME];

			const {SID} = this.collection;

			let formattedValue = formatSelectedFlight(value);

			let data = {
				items: items,
				itemsCount: parseInt(itemsCount)
			}

			if (services[`${SERVICE_NAME}-${SID}`] || limits[SERVICE_NAME] === Object.keys(services).length) {
				let limitReached = !services[`${SERVICE_NAME}-${SID}`] && limits[SERVICE_NAME] === Object.keys(services).length;

				Popup.create({
					title: null,
					content: limitReached ? MSG.LIMIT_REACHED : MSG.REPLACE,
					buttons: {
						right: [
							{
								text: MSG.OK_BTN,
								action: () => {
									if (limitReached) {
										let newItems = {};
										let {empty, services} = data.items[SERVICE_NAME];

										Object.keys(services).forEach((item, idx) => {
											if (Object.keys(services).length - 1 == idx) {
													newItems.services[`${SERVICE_NAME}-${SID}`] = {
														data: value,
														searchData: this.props.serviceSearchData,
														SID: SID
													}
											} else {
												newItems.services[item] = services[item];
											}
										});

										data.items[SERVICE_NAME] = {empty};
										data.items[SERVICE_NAME].services = {...newItems};
									} else {
										data.items[SERVICE_NAME].services[`${SERVICE_NAME}-${SID}`] = {
											data: value,
											searchData: this.props.serviceSearchData,
											SID: SID
										}
									}

									addToBucket(data).then(res => {
										this.props.cartData.items = data.items;
										this.props.cartData.itemsCount = data.itemsCount;
										updateTimestampAndCount(data.itemsCount);
										computeTotal();
										Popup.close();
										callback()
									})
								}
							},
							{
								text: MSG.CANCEL_BTN,
								action: () => Popup.close()
							}
						]
					}
				})
			} else {
				data.itemsCount += 1;
				data.items[SERVICE_NAME].empty = 'false';

				data.items[SERVICE_NAME].services[`${SERVICE_NAME}-${SID}`] = {
					data: value,
					searchData: this.props.serviceSearchData,
					SID: SID
				}

				addToBucket(data).then(res => {
					this.props.cartData.items = data.items;
					this.props.cartData.itemsCount = data.itemsCount;
					updateTimestampAndCount(data.itemsCount);
					computeTotal();

					callback()
				})
			}
		}

		checkIfFlightIsSelected = flightId => {
			if (this.selectedFlightId == null) return false;

			return this.selectedFlightId == flightId;
		}

		componentWillReceiveProps(nextProps) {
			this.selectedFlightId = nextProps.selectedId ? nextProps.selectedId.flight.ItineraryCode : undefined;
		}

		render(){
			return (
				<View
					collection={this.collection}
					selectFlight={this.selectFlight}
					checkIfFlightIsSelected={this.checkIfFlightIsSelected}
					handlePageChange={this.handlePageChange}>
					{this.props.children}
				</View>
			)
		}
	}


}

export default FlightListCore;

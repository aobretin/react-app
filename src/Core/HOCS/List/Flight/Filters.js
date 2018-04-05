/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {observable, extendObservable, toJS, action} from "mobx";
import {observer, inject} from "mobx-react";

// MAIN RENDER
const FlightFiltersCore = (View) => {
  	return @observer class extends Component {
	  	static propTypes = {
	  		collection: PropTypes.object.isRequired
	  	}

	    static defaultProps = {}

	    constructor(props) {
      		super(props);

      		extendObservable(this, {
      			collection: {}
		   	});

		   	this.collection = this.props.collection
		}

		handleFilterCheck = (e, typeKey) => {
			//this.props.loader(true);
			this.collection.filters[typeKey].forEach( (item, index) => {
				let itemValue = "" + item["value"];
				if ( itemValue == e.target.value ) {
					if (item.checked == false) {
						this.props.collection.filters[typeKey][index]["checked"] = true;
						this.props.collection.activeFilters[typeKey].push(e.target.value);
					}
					else {
						this.props.collection.filters[typeKey][index]["checked"] = false;
						let activeFilters = toJS(this.props.collection.activeFilters[typeKey]);
						activeFilters.splice( activeFilters.indexOf(itemValue), 1 );
						this.props.collection.activeFilters[typeKey] = activeFilters;
					}
				}
			})
			this.applyFilters(this.props.collection.filters);
		}

		filterByPrice = (collection, customMin, customMax) => {
			let results = [];
			let activePrices = this.collection.activeFilters['prices'];
			let currentMin = customMin || activePrices[0];
			let currentMax = customMax || activePrices[1];

			if (currentMin == this.collection.initPrices[0] && currentMax == this.collection.initPrices[1]) return collection;
			// console.log("apply price filter")
			// collection.forEach( (flight, fIdx) => {
			// 	if (
			// 		flight.Price >= Math.floor(currentMin)
			// 		&&
			// 		flight.Price <= Math.ceil(currentMax)
			// 	) results.push(flight);
	    //     });
      //
	    //     return results;

      return collection.filter((flight, fIdx) => flight.Price >= Math.floor(currentMin) && flight.Price <= Math.ceil(currentMax))
		}
		filterByStops(collection){
			let results = [];
			let activeStops = this.collection.activeFilters['stops'];
			if (activeStops.length < 1) return collection;

			collection.forEach( (flight, fIdx) => {
          flight.Routes.forEach( (routes, rIdx) => {
              routes.Route.forEach( (option, oIdx ) => {
                  var segLen = option.Segment.length - 1;
                  // debugger;
                  if (activeStops.indexOf(segLen.toString()) > -1 && results.indexOf(flight) === -1) {
                      results.push(flight);
                  }
              });
          });
      });

      return results;

			// console.log("results filtered:");
			// console.log(results);
		}
		filterByAirline(collection) {
			let results = [];
			let activeItems = this.collection.activeFilters['airlines'];
			if (activeItems.length < 1) return collection;

			collection.forEach( (flight, fIdx) => {
	            flight.Routes.forEach( (routes, rIdx) => {
	                routes.Route.forEach( (option, oIdx ) => {
		            	// check Operator on 1st segment only
		            	if (activeItems.indexOf(option.Segment[0].Carrier.Operating._) >= 0 && results.indexOf(flight) === -1) results.push(flight);
	                });
	            });
			})

			// console.log("results filtered:");
			// console.log(results);
			return results;
		}

		filtersLoaderToggler = (type) => this.collection.filtersLoading = type

		applyFilters(filters){
			this.collection.filtered = this.filterByPrice(this.collection.allItems);
			this.collection.filtered = this.filterByStops(this.collection.filtered);
			this.collection.filtered = this.filterByAirline(this.collection.filtered);

			this.collection.count = this.collection.filtered.length
			setTimeout( () => {
				this.filtersLoaderToggler(false);
			},20)
		}

		onPriceRangeChange = (value) => {
			this.props.collection.activeFilters.prices = value;
			this.applyFilters(this.props.collection.filters);
		}

		render(){
			// console.log("FlightFiltersCore:");
			// console.log(this.props);

			return (
				<View
					handleFilterCheck={this.handleFilterCheck}
					applyFilters={this.applyFilters}
					onPriceRangeChange={this.onPriceRangeChange}
					collection={this.collection}
					{...this.props}
				/>
			)
		}
	}
}

export default FlightFiltersCore;

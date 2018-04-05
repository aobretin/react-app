/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {observable, extendObservable, toJS, action} from "mobx";
import {observer, inject} from "mobx-react";

// MAIN RENDER
const HotelFiltersCore = (View) => {
	  return @observer class extends Component {
	  	static propTypes = {
        code: PropTypes.string.isRequired,
        setListLoading: PropTypes.func.isRequired,
        updateHotelList: PropTypes.func.isRequired,
				updateCurrentFilters: PropTypes.func.isRequired,
  			hotels: PropTypes.object,
  			loading: PropTypes.bool,
				initialPrices: PropTypes.array,
				currentFilters: PropTypes.object,
  			totalRes: PropTypes.oneOfType(
          [
            PropTypes.string,
            PropTypes.number
          ]
        )
      }

	    static defaultProps = {
  			hotels: {},
				currentFilters: {},
  			loading: false,
  			totalRes: 0
      }

	    constructor(props) {
	      super(props);

	      extendObservable(this, {
          code: props.code,
    			hotels: props.hotels,
    			loading: props.loading,
    			totalRes: props.totalRes,
					initialPrices: [],

    			filters: {
    				code: props.code,
    				prices: [],
    				noFilteredResults: false,
    				stars: [
    					{ label: "All stars", 	value: "0+", 	checked: true },
    					{ label: "1 star", 		value: "1", 	checked: false },
    					{ label: "2 stars", 	value: "2", 	checked: false },
    					{ label: "3 stars", 	value: "3", 	checked: false },
    					{ label: "4 stars", 	value: "4", 	checked: false },
    					{ label: "5 stars", 	value: "5", 	checked: false }
    				],
    				name: '',
    				facilities: [],
    				types: [
    					{ label: "All hotels",		value: "", 					checked: true },
    					{ label: "Apartaments",		value: "apartament", 		checked: false },
    					{ label: "Suites",			value: "suite", 			checked: false },
    					{ label: "Residence",		value: "residence", 		checked: false },
    					{ label: "Villas",			value: "villa", 			checked: false },
    					{ label: "Spa and resort",	value: "spa and resort", 	checked: false },
    					{ label: "Spa",				value: "spa", 				checked: false },
    					{ label: "Resort",			value: "resort", 			checked: false }
    				],
    				page: 1,
    				sortOrder: 1,
    				sortType: 'MinPrice',
    				filter: {
    					MinPrice: {
    						range: []
    					},
    					Stars: [],
    					Name: {
    						like: ''
    					}
    				}
    			},
          processFilters: action(() => {
            props.setListLoading(true);

            const toJsFilters = toJS(this.filters);
            const {
              code,
              page,
              sortOrder,
              sortType,
              prices,
              filter
            } = toJsFilters;

    				let filterParams = {
    					code: code,
    					page: page,
    					sortOrder: sortOrder,
    					sortType: sortType,
    					filter: {
    						MinPrice: {
    							range: {
    								0: prices[0],
    								1: prices[1]
    							}
    						},
    						Name: {
    							like: filter.Name.like
    						},
    						Stars: {}
    					}
    				}

    				if (filter.Stars.length == 0) {
              delete filterParams.filter.Stars;
            } else {
              filter.Stars.forEach((star,idx) => filterParams.filter.Stars[idx] = star)
            }

    				if (!filter.Name.like.length) delete filterParams.filter.Name;

						let currentFilters = Object.assign({}, filterParams, props.currentFilters);

            ApiService.req('/v2/hotels', 'get', null, filterParams).then(res => {
        			if (res.data._embedded.hotels.length) {
        				this.filters.noFilteredResults = false;

                props.updateHotelList(res.data._embedded.hotels);

        				this.totalRes = res.data.total_items;

        			} else if (!res.data._embedded.hotels.length) {
                props.updateHotelList([]);

        				this.filters.noFilteredResults = true;
        				this.totalRes = 0;
        			}

              props.setListLoading(false);
							props.updateCurrentFilters(currentFilters, this.totalRes);
          	}).catch(res => {});
    			})
		   })
		}

		componentWillMount() {
			ApiService.req('/v2/hotels', 'get', null, {code: this.code, filters: true}).then(res => {
				const prices = [+res.data.filters.minPrice, +res.data.filters.maxPrice];

				this.filters.prices = [...prices];
				this.initialPrices = [...prices];
			});
		}

    onPriceRangeChange = value => {
  		this.filters.prices.replace(value);
  		this.processFilters();
  	}

    handleFilterCheck = (event, type) => {
  		let val = event.target.value.toString();
  		let wasChecked = false;

  		if (event.target.value == "0+") {
  			this.filters.stars[0].checked = true;
  			this.filters.filter.Stars.replace([]);
  		}

  		this.filters.stars.forEach( (star,idx) => {
  			if (val == 0 && star.value != "0+") star.checked = false;
  			else if (val != 0 && star.value == val) {
  				this.filters.stars[0].checked = false;
  				wasChecked = star.checked;
  				if (wasChecked) {
  					if (this.filters.filter.Stars.indexOf(star.value) >= 0) this.filters.filter.Stars.splice(this.filters.filter.Stars.indexOf(star.value), 1);
  					star.checked = false;
  					if (this.filters.filter.Stars.length == 0) this.filters.stars[0].checked = true;
  				}else {
  					star.checked = true;
  					if (this.filters.filter.Stars.indexOf(star.value) < 0) this.filters.filter.Stars.push(star.value);
  				}
  			}
  		});

  		this.processFilters();
  	}

    handleTypeCheck = event => {
  		let val = event.target.value.toString();
  		let checked = false;

  		this.filters.types.forEach( (typeObj,idx) => {
  			typeObj.checked = false;
  			if (typeObj.value == val) {
  				this.filters.types[idx].checked = true;
  				this.filters.filter.Name.like = val;
  			}

  			if(!val.length) {
  				this.filters.types[0].checked = true;
  				this.filters.filter.Name.like = "";
  			}
  		})

  		this.processFilters();
  	}

    handleNameChange = e => this.filters.filter.Name.like = e.target.value;

    filterByName = event => event.keyCode === 13 ? this.processFilters() : false;

		render(){
			return (
		        <View
              filters={this.filters}
              filterByName={this.filterByName}
              handleNameChange={this.handleNameChange}
              handleTypeCheck={this.handleTypeCheck}
              handleFilterCheck={this.handleFilterCheck}
              onPriceRangeChange={this.onPriceRangeChange}
							initialPrices={this.initialPrices}

		        	{...this.props}
           >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default HotelFiltersCore;

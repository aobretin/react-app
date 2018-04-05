/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import SearchService from 'SearchService';
import Config from 'Config';
import moment from 'moment';
import PropTypes from 'prop-types';

import {computeWeekends, serializer} from 'HelperMethods';

import {observable, extendObservable, toJS} from "mobx";
import {observer, inject} from "mobx-react";

const SearchCore = (View) => {
	  return @observer class extends Component {
	  	static propTypes = {
	      services: PropTypes.array.isRequired,
	      selectedService: PropTypes.string,
	      searchData: PropTypes.object
	    }

	    static defaultProps = {
	      services: Config.services.slice(),
	      selectedService: 'flight',
	      searchData: undefined
	    }

	    constructor(props) {
	      super(props);

	      extendObservable(this, {
		      activeService: {
		        data: observable({}),
		        label: ''
		      },
			  goToList: '',
			  canSubmit: false,
		      autocompleteService: {
		        service: '',
		        index: 0,
		        data: null
		      }
		   })
		}

		componentWillMount() {
			if (this.props.searchData) {
		      const {searchData} = this.props;
		      const isFlightAndHotel = Object.keys(searchData).length == 2;
		      let key = '';

		      if (isFlightAndHotel) {
		        this.activeService.label = this.autocompleteService.service = 'flight_hotel';
		        this.autocompleteService.index = 2;

		        this.autocompleteService.data = this.activeService.data = {
		          f: {...searchData['f0']},
		          h: {...searchData['h1']}
		        };
		      } else {
		        key = Object.keys(searchData)[0];
		        const searchedService = key.split('')[0];

		        switch (searchedService) {
		          case 'f':
		            this.activeService.label = this.autocompleteService.service = 'flight';
		            this.autocompleteService.index = 0;
		            break;
		          case 'h':
		            this.activeService.label = this.autocompleteService.service = 'hotel';
		            this.autocompleteService.index = 1;
		            break;
		        }

		        this.autocompleteService.data = {...searchData[key]};
		        this.activeService.data = {...searchData[key]};
		      }
		    } else {
		      this.activeService.label = this.props.selectedService;
		      this.activeService.data = SearchService.getClone(this.props.selectedService);
		    }
		}

		handleSubmit = (model) => {
			let data = {};
			let sids = '';
			let type = '';

			switch (this.activeService.label) {
				case 'flight':
					if (this.activeService.data.weekendSearch.enable == 'true') {
						let clones = {
							f: []
						};

						let dates = computeWeekends(this.activeService.data.weekendSearch);

						dates.forEach((dateArr, idx) => {
							clones['f'].push({...toJS(this.activeService.data)});
							clones['f'][idx].r[0].date = dateArr[0];
							clones['f'][idx].r[1].date = dateArr[1];
						})

						clones = JSON.parse(JSON.stringify(clones));

						clones['f'].forEach((service, idx) => {
							let values = {};
							serializer(service, `_s[B2C][f][${idx}]`, data);

							Object.assign(data, values);
						});
					} else {
						serializer(toJS(this.activeService.data), `_s[B2C][f][0]`, data);
					}

					console.log('data', data);

					type = 'flight';
					break;
				case 'hotel':
					if (this.activeService.data.weekendSearch.enable == 'true') {
						let clones = {
							h: []
						};

						let dates = computeWeekends(this.activeService.data.weekendSearch);

						dates.forEach((dateArr, idx) => {
							clones['h'].push({...toJS(this.activeService.data)});
							clones['h'][idx].dIn = dateArr[0];
							clones['h'][idx].dOut = dateArr[1];
						})

						clones = JSON.parse(JSON.stringify(clones));

						clones['h'].forEach((service, idx) => {
							let values = {};
							serializer(service, `_s[B2C][h][${idx}]`, data);

							Object.assign(data, values);
						});
					} else {
						serializer(toJS(this.activeService.data), `_s[B2C][h][0]`, data);
					}

					type = 'hotel';
					break;
				case 'flight_hotel':
					const formatted = toJS(this.activeService.data);
					type = 'flight_hotel';

					Object.keys(formatted).forEach((serviceKey, idx) => {
						let values = {};

						serializer(formatted[serviceKey], `_s[B2C][${serviceKey}][${idx}]`, data);

						Object.assign(data, values);
					});

					break;
			}

			return ApiService.req('/en/dynamic-package', 'get', null, data, true).then(res => {
				console.log(res);

				res.data['B2C'].forEach((service, idx) => {
					sids += res.data['B2C'].length - 1 == idx ? `${service.Type}=${service.Id}` : `${service.Type}=${service.Id}-`;
				});

				this.goToList = `/list/${sids}/${type}`;
				// this.props.cartData.fh_cart = {};

				// if (this.props.toggleForm) this.toggleFormView();
				//
				// setTimeout(() => this.goToList = '', 500);

			}).catch(() => {});
		}

		changeActiveService = (service) => {
			if (this.activeService.label === service) return false;

			this.activeService = {
				data: (() => {
					let data = {};

					console.log(this.autocompleteService, service)

					if (this.autocompleteService.data !== null && this.autocompleteService.service == service) {
						data = {...this.autocompleteService.data};
					} else {
						data = service == 'flight_hotel' ? {
						 f: SearchService.getClone('flight'),
						 h: SearchService.getClone('hotel')
					 } : SearchService.getClone(service);
					}

					console.log(data);

					return data;
				})(),
				label: service
			}
		}

		render(){
			return (
		        <View
		        	services={this.services}
		        	activeService={this.activeService}
		        	changeActiveService={this.changeActiveService}
							handleSubmit={this.handleSubmit}
							goToList={this.goToList}
		        	{...this.props}
		        >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default SearchCore;

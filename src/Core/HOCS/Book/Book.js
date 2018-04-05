/* eslint-disable */
import React, {Component} from 'react';

import PropTypes from 'prop-types';

import ApiService from 'ApiService';

import {extendObservable, observe, observable, toJS} from "mobx";
import {observer, inject} from "mobx-react";

const BookCore = (View) => {
	  return @inject("cartData", "user") @observer class extends Component {
	  	static propTypes = {}

	    static defaultProps = {}

	    constructor(props) {
	      super(props);

      	extendObservable(this, {
          resultReady: false,
					hasService: true,
    			services: {
            flight: [],
            hotel: [],
            flight_hotel: []
          },
          localTravellers: observable.map({})
		   	});

				observe(props.cartData, change => {
					if (change.name == 'itemsCount' && change.newValue != change.oldValue) {
						this.resultReady = false;

						if (change.newValue == 0) {
							this.resultReady = true;
							this.hasService = false;

							return false;
						}

		        this.services = {
		          flight: [],
		          hotel: [],
		          flight_hotel: []
		        }

		        this.renderBook(change.object.items);
		      }
				});
		}

    renderBook = items => {
      let urls = [];
      let flightIdx = 0;
      let hotelIdx = 0;
      let flight_hotelIdx = 0;
      const results = items;

      Object.keys(results).forEach(serviceType => {
        const {empty, services} = results[serviceType];

        if (Object.keys(services).length == 0) return false;

        switch (serviceType) {
          case 'flight':
          case 'hotel':
            Object.keys(services).forEach(service => {
              const splitted = service.split('-');
              const type = splitted[0];
              const sid = splitted[1];

              if (type == 'flight') {
                this.services[serviceType].push({
                  [`flightOffer-${flightIdx}`]: {},
                  [`flightInitialReq-${flightIdx}`]: {},
                  flightIdx: flightIdx
                });

                urls.push({
                  [`flightOffer-${flightIdx}`]: `/v3/flights/${services[service].data.flight.code}/flight/${services[service].data.flight.ItineraryCode}:0`,
                  [`flightInitialReq-${flightIdx}`]: `/en/dynamic-package/sid/${sid}`
                })

                flightIdx++;
              }

              if (type == 'hotel') {
                this.services[serviceType].push({
                  [`hotelDetails-${hotelIdx}`]: {},
                  [`hotelOffer-${hotelIdx}`]: {},
                  hotelIdx: hotelIdx
                });

                urls.push({
                  [`hotelDetails-${hotelIdx}`]: `/v2/hotels/${services[service].data.hotel.Id}`,
                  [`hotelOffer-${hotelIdx}`]: `/v2/hotels/${services[service].data.code}/${services[service].data.hotel.Id}/package/${services[service].data.packagecode}/${services[service].data.roomCode}`
                })

                hotelIdx++;
              }
            });
            break;
          case 'flight_hotel':
            this.services[serviceType].push({});
            let lastEleme = this.services[serviceType].length - 1;

            Object.keys(services).forEach(service => {
              const splitted = service.split('-');
              const type = splitted[0];
              const sid = splitted[1];

              if (type == 'flight') {
                this.services[serviceType][lastEleme][`flightOffer-${flightIdx}`] = {};
                this.services[serviceType][lastEleme][`flightInitialReq-${flightIdx}`] = {};
                this.services[serviceType][lastEleme].flightIdx = flightIdx;

                urls.push({
                  [`flightOffer-${flightIdx}`]: `/v3/flights/${services[service].data.flight.code}/flight/${services[service].data.flight.ItineraryCode}:0`,
                  [`flightInitialReq-${flightIdx}`]: `/en/dynamic-package/sid/${sid}`
                })
                flightIdx++;
              }

              if (type == 'hotel') {
                this.services[serviceType][lastEleme][`hotelDetails-${hotelIdx}`] = {};
                this.services[serviceType][lastEleme][`hotelOffer-${hotelIdx}`] = {};
                this.services[serviceType][lastEleme].hotelIdx = hotelIdx;

                urls.push({
                  [`hotelDetails-${hotelIdx}`]: `/v2/hotels/${services[service].data.hotel.Id}`,
                  [`hotelOffer-${hotelIdx}`]: `/v2/hotels/${services[service].data.code}/${services[service].data.hotel.Id}/package/${services[service].data.packagecode}/${services[service].data.roomCode}`
                })
                hotelIdx++;
              }
            });
            break;
        }
      });

      let processedUrls = Object.assign({}, ...urls);

      ApiService.q(processedUrls).then(finalRes => {
        console.log(finalRes);

         Object.keys(this.services).forEach(type => {
           this.services[type].forEach(service => {
             Object.keys(finalRes).forEach(key => {
                if(service.hasOwnProperty(key)) service[key] = finalRes[key].data;
             });
           });
         });

         console.log(toJS(this.services));


         this.resultReady = true;
      }).catch((res) => {console.log(res)});
    }

    componentWillMount() {
			if (this.props.cartData.itemsCount == 0) {
				this.resultReady = true;
				this.hasService = false;
			} else {
				this.renderBook(this.props.cartData.items);
			}
  	}

		render(){
			return (
		        <View
              resultReady={this.resultReady}
							hasService={this.hasService}
              services={this.services}
		        	{...this.props}
		        >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default BookCore;

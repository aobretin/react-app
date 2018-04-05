/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {deepCopy, formatSelectedFlight, formatSelectedHotel} from 'HelperMethods';

import Popup from 'react-popup';

import {observable, extendObservable, toJS, action, observe} from "mobx";
import {observer, inject} from "mobx-react";

const DEFAULT_SIZE = 10;

const MSG = {
	LIMIT_REACHED: 'You have reached your limit for flight & hotel, if you continue the last added flight & hotel will be replaced by this one',
	REPLACE: 'Are you sure you want to replace this flight & hotel ?',
	CANCEL_BTN: 'No, I am sorry!',
	OK_BTN: 'Yes, please!'
}

const CART_STATES = {
  CAN_ADD: 'can-add',
  ADD_HOTEL: 'add-hotel',
  CANNOT_ADD: 'cannot-add',
  ALREADY_ADDED: 'already-added'
}

const FlightListCore = (View) => {
	return @inject("cartData") @observer class extends Component {
		static propTypes = {
			serviceSearchData: PropTypes.object.isRequired,
      services: PropTypes.object.isRequired
  	}

    static defaultProps = {}

		constructor(props){
			super(props);

			extendObservable(this, {
        cartStates: {
          state: CART_STATES.CANNOT_ADD,
          states: {...CART_STATES}
        }
			});
		}

    componentWillMount() {
      const {services} = this.props.cartData.items.flight_hotel;
      const {
        flight_hotel: {
          f0: {
            SID: flightSID
          },
          h1: {
            SID: hotelSID
          }
        }
      } = this.props.services;

      if (typeof services[`flight-${flightSID}`] != 'undefined' && typeof services[`hotel-${hotelSID}`] != 'undefined') {
        Object.keys(services).forEach(service => this.props.cartData.fh_cart.set(service, services[service]));
        this.cartStates.state = CART_STATES.ALREADY_ADDED;
      } else {
        this.cartStates.state = CART_STATES.ADD_HOTEL;
      }
    }

    componentWillUnmount() {
      this.props.cartData.fh_cart = observable.map({});
    }

		componentWillReceiveProps(nextProps) {
			if (nextProps.cartData.fh_cart.size == 1) this.cartStates.state = CART_STATES.ADD_HOTEL;
		}

    selectFlight = (flight, SID, search) => {
			flight.flight.code = search.code;

      this.props.cartData.fh_cart.set(`flight-${SID}`, {
        data: {
          flight: formatSelectedFlight(flight)
        },
        searchData: search
      });

      if (this.props.cartData.fh_cart.size == 2) this.cartStates.state = CART_STATES.CAN_ADD;
    }

    selectRoomWithHotel = (room, {hotel, code, compileRefsCombinations}, SID, search) => {
      hotel.Price = room.Price.Amount;

      let hotelWithRoom = {
        hotel: hotel,
        code: code,
        packagecode: room.PackageCode,
        roomCode: compileRefsCombinations(room['refs']['Rooms']),
        room: {
          roomData: room,
          roomCode: room['refs']['PaxCode']
        }
      }

      this.props.cartData.fh_cart.set(`hotel-${SID}`, {
        data: formatSelectedHotel(hotelWithRoom),
        searchData: search
      });

      this.cartStates.state = CART_STATES.CAN_ADD;
    }

    selectNewService = (value = {}, callback) => {
      const SERVICE_NAME = 'flight_hotel';

      const {
        addToBucket,
        updateTimestampAndCount,
				computeTotal
      } = this.props.cartData.methods;

      const clone = deepCopy(this.props.cartData);
      const localCart = toJS(clone.fh_cart);

      const {items, itemsCount, limits} = clone;
      const {empty, services} = items[SERVICE_NAME];

      let data = {
        items: Object.assign({}, items, {
          [SERVICE_NAME]: {
            empty: 'true',
            services: localCart
          }
        }),
        itemsCount: parseInt(itemsCount)
      }

      if (empty != 'true' || Object.keys(services).length / 2 == limits[SERVICE_NAME]) {
        let limitReached = typeof services[Object.keys(localCart)[0]] == 'undefined' && Object.keys(services).length / 2 == limits[SERVICE_NAME];

        Popup.create({
					title: null,
					content: limitReached ? MSG.LIMIT_REACHED : MSG.REPLACE,
					buttons: {
						right: [
							{
								text: MSG.OK_BTN,
								action: () => {
									data.items[SERVICE_NAME].empty = "false";

									addToBucket(data).then(res => {
										this.props.cartData.items = data.items;
										this.props.cartData.itemsCount = data.itemsCount;
										updateTimestampAndCount(data.itemsCount);
										computeTotal();
                    callback();
										Popup.close();
									})
								}
							},
							{
								text: MSG.CANCEL_BTN,
								action: () => Popup.close()
							}
						]
					}
				});
      } else {
        data.itemsCount++;
				data.items[SERVICE_NAME].empty = "false";

				addToBucket(data).then(res => {
					this.props.cartData.items = data.items;
					this.props.cartData.itemsCount = data.itemsCount;
					updateTimestampAndCount(data.itemsCount);
					computeTotal();
					callback();
				}).catch(res => {
					console.log(res)
				})
      }
    }

    changeCartState = state => this.cartStates.state = state;

		render(){
			return (
				<View
          cartStates={this.cartStates}
          selectFlight={this.selectFlight}
          selectRoomWithHotel={this.selectRoomWithHotel}
          selectNewService={this.selectNewService}
          changeCartState={this.changeCartState}
          localCart={toJS(this.props.cartData.fh_cart)}
          {...this.props}
          >
					{this.props.children}
				</View>
			)
		}
	}


}

export default FlightListCore;

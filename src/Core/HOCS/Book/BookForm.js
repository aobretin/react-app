/* eslint-disable */
import React, {Component} from 'react';

import PropTypes from 'prop-types';

import ApiService from 'ApiService';

import {buildPassengers, buildDestinations, buildClientObj} from 'BookHelperMethods';

import {extendObservable, observable} from "mobx";
import {observer, inject} from "mobx-react";

const TYPE_TIMEOUT = 1000;
let typeTimeout = null;

const BookFormCore = (View) => {
	  return @inject("cartData", "user") @observer class extends Component {
	  	static propTypes = {
        // userData: PropTypes.object.isRequired,
        services: PropTypes.object.isRequired
      }

	    static defaultProps = {}

	    constructor(props) {
	      super(props);

      	extendObservable(this, {
          typeTimeout: null,
          auxiliaryData: {
            'owner[street]': 'unnecessary',
            'owner[housenr]': '00000',
            'owner[city]': 'unnecessary',
            'owner[zipcode]': '00000',
            'owner[country]': 'AA'
          },
          form: null,
          forms: [],
          flightAndHotelSyncs: {},
          preselectedUsers: observable.map({}),
          amount: 0,
          oldVals: {
            'owner[firstname]': {
              val: '',
              mappedWith: []//'services[hotel][0][room][0][adults][0][firstName]'
            },
            'owner[lastname]': {
              val: '',
              mappedWith: []//'services[hotel][0][room][0][adults][0][lastName]'
            },
            'owner[email]': {
              val: '',
              mappedWith: []//'services[hotel][0][room][0][adults][0][email]'
            },
            'owner[phone]': {
              val: '',
              mappedWith: []//'services[hotel][0][room][0][adults][0][phone]'
            }
          }
		   	})
		}

    componentWillMount() {
			const {
				services
			} = this.props

      Object.keys(services).forEach(type => {
        services[type].forEach(service => {
          let clients = null;

          const {
            hotelIdx,
            flightIdx,
          } = service;

          const {
            [`hotelOffer-${hotelIdx}`]: hotel,
            [`hotelDetails-${hotelIdx}`]: hotelData,
            [`flightOffer-${flightIdx}`]: flight,
            [`flightInitialReq-${flightIdx}`]: flightData
          } = service;

          switch (type) {
            case 'flight':
              Object.assign(this.auxiliaryData, {
                [`services[flight][${flightIdx}][resultCode]`]: flight.FlightsCode,
                [`services[flight][${flightIdx}][itineraryCode]`]: flight.ItineraryCode,
                [`services[flight][${flightIdx}][amount]`]: flight.Price.toString(),
                [`services[flight][${flightIdx}][currency]`]: flight.Currency,
                [`services[flight][${flightIdx}][status]`]: '1',
                [`services[flight][${flightIdx}][type]`]: flightData.type
              });

              if (!this.auxiliaryData.hasOwnProperty('flight[payment]')) this.auxiliaryData['flight[payment]'] = 'credit';

              for (let el in flightData) {
                switch(el) {
                  case 'adt':
                  this.auxiliaryData[`services[flight][${flightIdx}][ADT]`] = flightData[el];
                    break;
                  case 'chd':
                  this.auxiliaryData[`services[flight][${flightIdx}][CHD]`] = flightData[el];
                    break;
                  case 'sen':
                  this.auxiliaryData[`services[flight][${flightIdx}][SEN]`] = flightData[el];
                    break;
                  case 'ins':
                  this.auxiliaryData[`services[flight][${flightIdx}][INS]`] = flightData[el];
                    break;
                }
              }

              this.amount += parseInt(flight.Price);

              this.oldVals['owner[firstname]'].mappedWith.push(`services[flight][${flightIdx}][passenger][ADT][0][firstName]`);
              this.oldVals['owner[lastname]'].mappedWith.push(`services[flight][${flightIdx}][passenger][ADT][0][lastName]`);
              this.oldVals['owner[email]'].mappedWith.push(`services[flight][${flightIdx}][passenger][ADT][0][email]`);
              this.oldVals['owner[phone]'].mappedWith.push(`services[flight][${flightIdx}][passenger][ADT][0][phone]`);

              this.forms.push({
                type: type,
                idx: flightIdx,
                passengers: buildPassengers(flight.FareDetails.PaxFare, flight.Routes)
              });
              break;
            case 'hotel':
              clients = buildClientObj(hotel.PackageRooms.PackageRoom, hotel.AccommodationPeriod.EndDate);

              Object.assign(this.auxiliaryData, {
                [`services[hotel][${hotelIdx}][resultCode]`]: hotel.Code,
                [`services[hotel][${hotelIdx}][packageCode]`]: hotel.PackageCode,
                [`services[hotel][${hotelIdx}][hotelId]`]: hotel.HotelId,
                [`services[hotel][${hotelIdx}][checkin]`]: hotel.AccommodationPeriod.StartDate,
                [`services[hotel][${hotelIdx}][checkout]`]: hotel.AccommodationPeriod.EndDate,
                [`services[hotel][${hotelIdx}][adultsNr]`]: 0,
                [`services[hotel][${hotelIdx}][childrenNr]`]: 0,
                [`services[hotel][${hotelIdx}][amount]`]: hotel.Price.Amount.toString(),
                [`services[hotel][${hotelIdx}][currency]`]: hotel.Price.Currency
              });

              if (!this.auxiliaryData.hasOwnProperty('hotel[payment]')) this.auxiliaryData['hotel[payment]'] = 'credit';

              clients.forEach(client => {
                if (client.clientType == 'Adult') ++this.auxiliaryData[`services[hotel][${hotelIdx}][adultsNr]`];
                if (client.clientType == 'Child') ++this.auxiliaryData[`services[hotel][${hotelIdx}][childrenNr]`];

                if (client.anotherRoom) {
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][code]`] = parseInt(client.roomData.RoomCode);
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][price]`] = client.roomData.Price ? client.roomData.Price.Amount : '';
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][currency]`] = client.roomData.Price ? client.roomData.Price.Currency : '';
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][name]`] = client.roomData.Name;
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][info]`] = client.roomData.Info ? client.roomData.Info : '';
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][board]`] = client.roomData.Board ? client.roomData.Board : '';
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][packagecode]`] = parseInt(client.roomData.packageRoomCode);
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][status]`] = client.roomData.Status;
                }
              });

              this.oldVals['owner[firstname]'].mappedWith.push(`services[hotel][${hotelIdx}][room][0][adults][0][firstName]`);
              this.oldVals['owner[lastname]'].mappedWith.push(`services[hotel][${hotelIdx}][room][0][adults][0][lastName]`);
              this.oldVals['owner[email]'].mappedWith.push(`services[hotel][${hotelIdx}][room][0][adults][0][email]`);
              this.oldVals['owner[phone]'].mappedWith.push(`services[hotel][${hotelIdx}][room][0][adults][0][phone]`);

              this.amount += parseInt(hotel.Price.Amount);

              this.forms.push({
                type: type,
                idx: hotelIdx,
                clients: clients
              });
              break;
            case 'flight_hotel':
              clients = buildClientObj(hotel.PackageRooms.PackageRoom, hotel.AccommodationPeriod.EndDate);

              Object.assign(this.auxiliaryData, {
                [`services[flight][${flightIdx}][resultCode]`]: flight.FlightsCode,
                [`services[flight][${flightIdx}][itineraryCode]`]: flight.ItineraryCode,
                [`services[flight][${flightIdx}][amount]`]: flight.Price.toString(),
                [`services[flight][${flightIdx}][currency]`]: flight.Currency,
                [`services[flight][${flightIdx}][status]`]: '1',
                [`services[flight][${flightIdx}][type]`]: flightData.type,
                [`services[hotel][${hotelIdx}][resultCode]`]: hotel.Code,
                [`services[hotel][${hotelIdx}][packageCode]`]: hotel.PackageCode,
                [`services[hotel][${hotelIdx}][hotelId]`]: hotel.HotelId,
                [`services[hotel][${hotelIdx}][checkin]`]: hotel.AccommodationPeriod.StartDate,
                [`services[hotel][${hotelIdx}][checkout]`]: hotel.AccommodationPeriod.EndDate,
                [`services[hotel][${hotelIdx}][adultsNr]`]: 0,
                [`services[hotel][${hotelIdx}][childrenNr]`]: 0,
                [`services[hotel][${hotelIdx}][amount]`]: hotel.Price.Amount.toString(),
                [`services[hotel][${hotelIdx}][currency]`]: hotel.Price.Currency
              });

              if (!this.auxiliaryData.hasOwnProperty('flight[payment]')) this.auxiliaryData['flight[payment]'] = 'credit';
              if (!this.auxiliaryData.hasOwnProperty('hotel[payment]')) this.auxiliaryData['hotel[payment]'] = 'credit';

              for (let el in flightData) {
                switch(el) {
                  case 'adt':
                  this.auxiliaryData[`services[flight][${flightIdx}][ADT]`] = flightData[el];
                    break;
                  case 'chd':
                  this.auxiliaryData[`services[flight][${flightIdx}][CHD]`] = flightData[el];
                    break;
                  case 'sen':
                  this.auxiliaryData[`services[flight][${flightIdx}][SEN]`] = flightData[el];
                    break;
                  case 'ins':
                  this.auxiliaryData[`services[flight][${flightIdx}][INS]`] = flightData[el];
                    break;
                }
              }

              clients.forEach(client => {
                if (client.clientType == 'Adult') ++this.auxiliaryData[`services[hotel][${hotelIdx}][adultsNr]`];
                if (client.clientType == 'Child') ++this.auxiliaryData[`services[hotel][${hotelIdx}][childrenNr]`];

                if (client.anotherRoom) {
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][code]`] = parseInt(client.roomData.RoomCode);
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][price]`] = client.roomData.Price ? client.roomData.Price.Amount : '';
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][currency]`] = client.roomData.Price ? client.roomData.Price.Currency : '';
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][name]`] = client.roomData.Name;
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][info]`] = client.roomData.Info ? client.roomData.Info : '';
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][board]`] = client.roomData.Board ? client.roomData.Board : '';
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][packagecode]`] = parseInt(client.roomData.packageRoomCode);
                    this.auxiliaryData[`services[hotel][${hotelIdx}][room][${client.roomIndex}][status]`] = client.roomData.Status;
                }
              });

              this.oldVals['owner[firstname]'].mappedWith.push(`services[flight][${flightIdx}][passenger][ADT][0][firstName]`);
              this.oldVals['owner[lastname]'].mappedWith.push(`services[flight][${flightIdx}][passenger][ADT][0][lastName]`);
              this.oldVals['owner[email]'].mappedWith.push(`services[flight][${flightIdx}][passenger][ADT][0][email]`);
              this.oldVals['owner[phone]'].mappedWith.push(`services[flight][${flightIdx}][passenger][ADT][0][phone]`);

              this.oldVals['owner[firstname]'].mappedWith.push(`services[hotel][${hotelIdx}][room][0][adults][0][firstName]`);
              this.oldVals['owner[lastname]'].mappedWith.push(`services[hotel][${hotelIdx}][room][0][adults][0][lastName]`);
              this.oldVals['owner[email]'].mappedWith.push(`services[hotel][${hotelIdx}][room][0][adults][0][email]`);
              this.oldVals['owner[phone]'].mappedWith.push(`services[hotel][${hotelIdx}][room][0][adults][0][phone]`);

              this.amount += parseInt(hotel.Price.Amount) + parseInt(flight.Price);

              this.forms.push({
                type: type,
                idxs: {hotelIdx, flightIdx},
                clients: clients,
                passengers: buildPassengers(flight.FareDetails.PaxFare, flight.Routes)
              });
              break;
          }
        });
      });
    }

		handleLoginPrecomplete = () => {
			const {
				getUserData,
				getUserTypeID
			} = this.props.user;

			const mappings = ['firstname', 'lastname', 'phone'];
			const TYPE_ID = getUserTypeID();
			const USER_ID = getUserData('id');

			let data = {};

			ApiService.req(`/auth/user-details/${USER_ID}/${TYPE_ID}`).then(res => {
        Object.keys(res.data).forEach(input => {
          if (res.data[input].hasOwnProperty('Field') && mappings.indexOf(res.data[input]['Field'].toLowerCase()) > -1) {
            data[`owner[${res.data[input]['Field'].toLowerCase()}]`] = res.data[input].Value;
          }
        });

        data['owner[email]'] = getUserData('email');

        this.handleChange(Object.assign({}, this.form.getModel(), data));
      }).catch(res => console.log(res));
		}

    handleChange = currentValues => {
      let newVals = {};

      clearTimeout(typeTimeout);

      typeTimeout = setTimeout(() => {
        Object.keys(this.oldVals).forEach(key => {
          this.oldVals[key].mappedWith.forEach(el => {
            if (currentValues.hasOwnProperty(el)) {
              if (typeof currentValues[key] != 'undefined') newVals[el] = currentValues[key];
            } else {
              this.flightAndHotelSyncs[el] = this.oldVals[key].val;
            }
          })

          if (this.oldVals[key].val != this.form.getModel()[key]) {
            this.oldVals[key].val = this.form.getModel()[key];

            this.form.reset(Object.assign({}, currentValues, newVals));
          }
        });
      }, TYPE_TIMEOUT);
    }

		applyPreselectedUser = (e, serviceIdx, user, service) => {
	    let client = JSON.parse(e.value);
	    let newVals = {};

	    Object.keys(client.fields).forEach(field => {
	      if (service == 'hotel') newVals[`services[hotel][${serviceIdx}][room][${user.roomIndex}][${user.clientCategory}][${user.clientIndex}][${field}]`] = client.fields[field];
	      if (service == 'flight') newVals[`services[flight][${serviceIdx}][passenger][${user.passCode}][${user.passIndex}][${field}]`] = client.fields[field];
	    });

	    this.form.reset(Object.assign({}, this.form.getModel(), newVals));
	  }

		onSubmit = model => {
			const submitData = Object.assign({}, model, this.auxiliaryData, this.flightAndHotelSyncs);

			console.log(submitData);
		}

    setForm = form => this.form = form;

		render(){
			return (
		        <View
              forms={this.forms}
              setForm={this.setForm}
              amount={this.amount}
							syncs={this.flightAndHotelSyncs}
							preselectedUsers={this.preselectedUsers}
              handleChange={this.handleChange}
							applyPreselectedUser={this.applyPreselectedUser}
							onSubmit={this.onSubmit}
							handleLoginPrecomplete={this.handleLoginPrecomplete}
		        	{...this.props}
		        >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default BookFormCore;

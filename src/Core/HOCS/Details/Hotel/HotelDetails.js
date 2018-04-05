/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {observable, extendObservable, toJS, action} from "mobx";
import {observer, inject} from "mobx-react";

// MAIN RENDER
const ListCore = (View) => {
	return @observer class extends Component {
		static propTypes = {}

		static defaultProps = {}

		constructor(props) {
			super(props);

      console.log(props);

			extendObservable(this, {
        loading: true,
				hotelDetails: {},
        hotelId: props.match.params.hotelId,
        hotelCode: props.match.params.hotelCode,
        similarHotels: []
			})
		}

		componentWillMount(){
      const {
        hotelId,
        hotelCode
      } = this;

      ApiService.req(`/v2/hotels/${hotelId}`).then(res => {
        const stars = res.data.Stars;

        ApiService.req(`/v2/hotels?filter[Star][]=${stars}&code=${hotelCode}`).then(hotels => {
          this.hotelDetails = res.data;
          this.similarHotels = hotels.data._embedded.hotels;
          this.loading = false;
        });
      });
		}

		render(){
      const {
        loading,
        hotelDetails,
        hotelId,
        hotelCode,
        similarHotels
      } = this;

			return (
	        <View
            loading={loading}
            hotelDetails={hotelDetails}
            hotelId={hotelId}
            hotelCode={hotelCode}
            similarHotels={similarHotels}
            {...this.props}
         >
	          {this.props.children}
	        </View>
			)

		}
  }
}

export default ListCore;

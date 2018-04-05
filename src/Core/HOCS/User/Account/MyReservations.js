/* eslint-disable */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ApiService from 'ApiService';

import {formatFilters} from 'HelperMethods';

import {extendObservable, observable} from "mobx";
import {observer, inject} from "mobx-react";

const MyReservationsCore = (View) => {
	 return @inject("user") @observer class extends Component {
  	static propTypes = {}

    static defaultProps = {}

		constructor() {
			super();

			extendObservable(this, {
        resultsReady: false,
        data: {},
        orders: [],
        ordersDetails: observable.map({}),
			})
		}

    getOrders = state => {
      const {
        page,
        pageSize: limit,
        filtered,
        sorted
      } = state;

      this.resultsReady = false;

      const filters = formatFilters(
        {
          limit,
          filtered,
          sorted,
          page: page + 1
        }
      );

      ApiService.req('/v2/orders', 'GET', null, filters).then(res => {
        const {_embedded, ...rest} = res.data;

        this.data = rest;
  			this.orders = _embedded.orders;

        // this.orders.forEach((order,orderIdx) => {
        //   this.ordersDetails.set(order["Id"], {
        //     detailed: false
        //   });
  			// });
  			// this.orders.forEach( (order,orderIdx) => {
  			// 	console.info(order)
  			// 	this.ordersDetails.set(order["Id"], {
  			// 		detailed: false,
  			// 		formattedRoutes: observable({
  			// 			Routes: observable([]),
  			// 			FareRules: [],
  			// 			FareDetails: {
  			// 				PaxFare: []
  			// 			}
  			// 		}),
  			// 		Services: observable([])
  			// 	})
  			// });
  			// this.status.total_items = res.data.total_items;
  			// this.status.page_count 	= res.data.page_count;
  			// this.status.page 		= res.data.page;
        this.resultsReady = true;
  		}).catch(res => console.log(res));
    }

		render(){
			return (
	        <View
            resultsReady={this.resultsReady}
            data={this.data}
            orders={this.orders}
            ordersDetails={this.ordersDetails}
            getOrders={this.getOrders}
            {...this.props}
          >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default MyReservationsCore;

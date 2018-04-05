/* eslint-disable */
import React, {Component} from 'react';

import PropTypes from 'prop-types';
import ApiService from 'ApiService';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const CurrencyCore = (View) => {
	  return @inject("currencyValues") @observer class extends Component {
	  	static propTypes = {}

	    static defaultProps = {}

	    constructor(props) {
	      super(props);

	      extendObservable(this, {
          currencies: [],
  	      currentCurrency: '',
  	      defaultCurr: ''
		   })
		}

    componentDidMount() {
  		ApiService.req('/currencies/enabled', 'get', null, null).then(res => {
  			let currency = null;
  		 	this.currencies = res.data._embedded.items;

  	 		this.currencies.some(curr => {
  		 		if(curr.Default == 1) {
  		 			this.defaultCurr = curr.Code;

  		 			if (localStorage.getItem('SET_CURRENCY')) {
  		 				currency = localStorage.getItem('SET_CURRENCY');
  	 					currency = JSON.parse(currency);
  		 			} else {
  		 				currency = this.defaultCurr;
  		 			}

  		 			return this.handleChange(currency);
  		 		}
  		 	});
  		}).catch(() => {});
  	}

    handleChange = value => {
  		ApiService.req(`/currencies/${this.defaultCurr}/exchange/${value}`, 'get', null, null).then(res => {
  			const result = res.data[0] || res.data;

  			this.props.currencyValues.value = result.Value;
  			this.props.currencyValues.currency = value;
  			this.currentCurrency = value;

  			localStorage.setItem('SET_CURRENCY', JSON.stringify(value));
  		}).catch(() => {});
  	}

		render(){
			return (
		        <View
              currentCurrency={this.currentCurrency}
              handleChange={this.handleChange}
              currencies={this.currencies}
							currencyValues={this.props.currencyValues}
		        	{...this.props}
          >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default CurrencyCore;

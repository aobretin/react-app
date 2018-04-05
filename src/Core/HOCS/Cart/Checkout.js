/* eslint-disable */
import React, {Component} from 'react';

import PropTypes from 'prop-types';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const CheckoutCore = (View) => {
	return @inject("cartData") @observer class extends Component {
	  	static propTypes = {}

	    static defaultProps = {}

	    constructor(props) {
	      	super(props);

	      	extendObservable(this, {

			}
		}

		render(){
			return (
		        <View
		        	{...this.props}
		        >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default CheckoutCore;
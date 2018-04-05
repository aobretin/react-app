/* eslint-disable */
import React, {Component} from 'react';

import PropTypes from 'prop-types';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const CartCore = (View) => {
	  return @inject("cartData") @observer class extends Component {
	  	static propTypes = {}

	    static defaultProps = {}

	    constructor(props) {
	      super(props);

      	extendObservable(this, {
    			goTo: ''
		   	})
		}

		redirectTo = url => {
			this.goTo = url;
			setTimeout(() => this.goTo = '', 500)
		}

		render(){
			return (
		        <View
		        	goTo={this.goTo}
		        	redirectTo={this.redirectTo}
		        	{...this.props}
		        >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default CartCore;

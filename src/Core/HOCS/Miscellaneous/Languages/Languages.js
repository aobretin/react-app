/* eslint-disable */
import React, {Component} from 'react';

import PropTypes from 'prop-types';
import ApiService from 'ApiService';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const LanguagesCore = (View) => {

	return @inject("languagesData") @observer class extends Component {
	  	static propTypes = {}

	    static defaultProps = {}

	    constructor(props) {
	      	super(props);

	      	extendObservable(this, {
	      		
	   		})
		}

		render(){
			return (
		        <View
		        	currentLanguage={this.props.languagesData.activeLanguage}
		        	changeLanguage={this.props.languagesData.methods.changeLanguage}
		        	languages={this.props.languagesData.languages}
		        	{...this.props}
      			>
		        	{this.props.children}
		        </View>
			)
		}
	}
}

export default LanguagesCore;
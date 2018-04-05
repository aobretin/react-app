/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {observable, extendObservable, toJS} from "mobx";
import {observer, inject} from "mobx-react";

const HotelPackagesCore = (View) => {
	  return @observer class extends Component {
	  	static propTypes = {
        package: PropTypes.object.isRequired,
        compileRefsCombinations: PropTypes.func.isRequired,
        packCode: PropTypes.string.isRequired,
				packIndex: PropTypes.oneOfType(
          [
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
          ]
        ),
        hotelId: PropTypes.oneOfType(
          [
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
          ]
        ),
        prices: PropTypes.object.isRequired
	    }

	    static defaultProps = {}

	    constructor(props) {
	      super(props);

	      extendObservable(this, {
          pax       : props.package,
    			cpLoader  : false
		    })
		}

    handleSelectChange = (e, index, parentIndex) => {
  		console.log(this.pax);

  		this.pax['refs']['PaxCode'] = this.pax.PackageCode;
  		this.pax['refs']['Rooms'][index]['RoomCode'] = e.target.value;
  		this.props.prices[parentIndex] = {
  			'Amount' 	: '',
  			'Currency'  : ''
  		};
  		this.cpLoader = true;

  		let comb = this.props.compileRefsCombinations(this.pax['refs']['Rooms']);
  		let sendReq = '/v2/hotels/' + this.props.packCode + '/' + this.props.hotelId + '/package/' + this.pax['refs']['PaxCode'] + '/' + comb;

  		ApiService.req(sendReq, 'get', null, null, true)
  			.then((res) => {
  				this.props.prices[parentIndex] = res.data.Price;
  				this.pax.refs['Rooms'][index]['Info'] = res.data.Info;
  				this.pax.refs['Rooms'][index]['Board'] = res.data.Board;
  				this.cpLoader = false;
  			}).catch(() => {});
  	}

		render(){
			return (
		        <View
              cpLoader={this.cpLoader}
              pax={this.pax}
              handleSelectChange={this.handleSelectChange}
		        	{...this.props}
		        >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default HotelPackagesCore;

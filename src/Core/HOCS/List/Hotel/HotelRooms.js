/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {observable, extendObservable, toJS} from "mobx";
import {observer, inject} from "mobx-react";

const HotelRoomsCore = (View) => {
	  return @observer class extends Component {
	  	static propTypes = {
	      id: PropTypes.oneOfType(
          [
            PropTypes.string,
            PropTypes.number
          ]
        ),
        code: PropTypes.oneOfType(
          [
            PropTypes.string,
            PropTypes.number
          ]
        )
	    }

	    static defaultProps = {}

	    constructor(props) {
	      super(props);

	      extendObservable(this, {
          loading: true,
    			// actionElem: 'See more...',
    			id: props.id,
    			packages: [],
    			prices:   []
		    })
		}

		componentWillMount() {
      this.loading = true;
      let url = '/v2/hotels/' + this.props.code + '/' + this.props.id + '/package';

      ApiService.req(url, 'get', null, null, true).then((res) => {
        this.packages = res.data._embedded.packages;
        this.packages.forEach((pax, index) =>{
          this.prices.push(pax.Price);
          pax.refs = {
            'CP'      : {},
            'cpLoader': false,
            'Rooms'   : [],
            'PaxCode' : pax.PackageCode
          };
          pax.PackageRooms.PackageRoom.forEach((room, rIndex) => {
            pax.refs['Rooms'].push(
              {
                'Info': room.RoomRefs.RoomRef[0].Info,
                'Board': room.RoomRefs.RoomRef[0].Board,
                'RoomCode': room.RoomRefs.RoomRef[0].RoomCode
              }
            );
          })
        })
        this.loading = false;
      })
		}

    getOfferDetails = (packCode, packIndex, roomIndex) => {
  		this.packages[packIndex]['refs']['cpLoader'] = true;
  		let comb = this.compileRefsCombinations(this.packages[packIndex]['refs']['Rooms']);
  		let sendReq = '/v2/hotels/' + this.props.code + '/' + this.props.id + '/package/' + packCode + '/' + comb;

  		ApiService.req(sendReq, 'get', null, null)
  			.then((res) => {
  				this.prices[packIndex] = res.data.Price;
  				if(roomIndex){
  					this.packages[packIndex]['refs']['Rooms'][roomIndex]['Info'] = res.data.Info;
  					this.packages[packIndex]['refs']['Rooms'][roomIndex]['Board'] = res.data.Board;
  					this.packages[packIndex]['refs']['Rooms'][roomIndex]['RoomCode'] = res.data.RoomCode;
  				}
  				this.packages[packIndex]['refs']['CP'] = res.data.CancellationPolicy;
  				this.packages[packIndex]['refs']['cpLoader'] = false;
  			}).catch(() => {});
  	}

    compileRefsCombinations = refs => {
  		let arr = Object.keys(refs).map(key => refs[key]);
  		let combination = '';

  		arr.forEach((comb, index) => {
  			if (index === arr.length - 1) {
  	            combination += index + ':' + comb.RoomCode;
  	        } else {
  	            combination += index + ':' + comb.RoomCode + '-'
  	        }
  		})

  		return combination;
  	}

		render(){
			return (
		        <View
              loading={this.loading}
              packages={this.packages}
              prices={this.prices}
              compileRefsCombinations={this.compileRefsCombinations}
		        	{...this.props}
		        >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default HotelRoomsCore;

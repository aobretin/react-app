import React, {Component} from 'react';

import {observable, extendObservable, toJS} from "mobx";
import {observer, inject} from "mobx-react";

import HotelDetailsCore from 'HotelDetailsCore';

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

const Templates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@inject("view") @observer
class HotelDetails extends Component {
	render(){
		const View = Templates[this.props.view.device];

		return <View {...this.props} />
	}
}

export default HotelDetailsCore(HotelDetails);

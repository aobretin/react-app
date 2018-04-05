import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import MyReservationsCore from 'MyReservationsCore';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const MyReservationsTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@inject("view")  @observer
class MyReservations extends Component {
	render(){
		const View = MyReservationsTemplates[this.props.view.device];

		return <View {...this.props} />
	}
}

export default MyReservationsCore(MyReservations);

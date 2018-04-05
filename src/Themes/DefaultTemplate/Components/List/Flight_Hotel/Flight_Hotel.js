import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';
import Flight_HotelListCore from 'Flight_HotelListCore';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const ListTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

const DEFAULT_SIZE = 10;

@inject("view") @observer
class Flight_HotelList extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      flightShown: false
    });
  }

  toggleServiceInView = () => this.flightShown = !this.flightShown;

	render() {
		const View = ListTemplates[this.props.view.device];

		return (
			<View
        flightShown={this.flightShown}
        toggleServiceInView={this.toggleServiceInView}
				{...this.props}
   />
		)
	}
}

export default Flight_HotelListCore(Flight_HotelList);

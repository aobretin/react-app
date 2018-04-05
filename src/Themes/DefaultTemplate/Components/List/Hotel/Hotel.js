import React, {Component} from 'react';
import HotelListCore from 'HotelListCore';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const HotelListTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class HotelList extends Component {
	constructor(props) {
		super(props)

		console.log(props);

		extendObservable(this, {
			showDetails: props.location.hash.length
		})
	}

	toggleRoomsDetails = () => {
		this.showDetails = !this.showDetails;
		if (!this.showDetails) this.props.updateSelectedHotel(null);

		return this.showDetails;
	}

	render() {
		const View = HotelListTemplates['DESKTOP'];

		return (
				<View showDetails={this.showDetails} toggleRoomsDetails={this.toggleRoomsDetails} {...this.props} />
		)
	}
}

export default HotelListCore(HotelList);

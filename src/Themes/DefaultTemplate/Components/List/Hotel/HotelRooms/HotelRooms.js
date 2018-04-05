import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';
import HotelRoomsCore from 'HotelRoomsCore';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const HotelRoomsTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class HotelRooms extends Component {
	render() {
		const View = HotelRoomsTemplates['DESKTOP'];

		return (
				<View {...this.props} />
		)
	}
}

export default HotelRoomsCore(HotelRooms);

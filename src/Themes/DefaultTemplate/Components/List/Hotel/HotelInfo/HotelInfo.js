import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const HotelInfoTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class HotelInfo extends Component {
	render() {
		const View = HotelInfoTemplates['DESKTOP'];

		return (
				<View {...this.props} />
		)
	}
}

export default HotelInfo;

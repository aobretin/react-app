import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';
import HotelPackagesCore from 'HotelPackagesCore';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const HotelPackagesTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class HotelPackages extends Component {
	render() {
		const View = HotelPackagesTemplates['DESKTOP'];

		return (
				<View {...this.props} />
		)
	}
}

export default HotelPackagesCore(HotelPackages);

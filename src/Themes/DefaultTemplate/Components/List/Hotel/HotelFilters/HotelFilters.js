import React, {Component} from 'react';
import HotelFiltersCore from 'HotelFiltersCore';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const HotelFiltersTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class HotelFilters extends Component {
	render() {
		const View = HotelFiltersTemplates['DESKTOP'];

		return (
				<View {...this.props} />
		)
	}
}

export default HotelFiltersCore(HotelFilters);

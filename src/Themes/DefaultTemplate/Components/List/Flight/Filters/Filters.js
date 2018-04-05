import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';
import FlightFiltersCore from 'FlightFiltersCore';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const FiltersTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@inject("view") @observer
class FlightFilters extends Component {
	render(){
		const View = FiltersTemplates[this.props.view.device];

		return (
			<View
				{...this.props}
			/>
		)
	}

}

export default FlightFiltersCore(FlightFilters);
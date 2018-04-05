/* eslint-disable */
import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {observable, autorun, computed, action, extendObservable, toJS} from "mobx";
import {observer, inject} from "mobx-react";

const ItemTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class FlightItem extends Component {
	constructor(props) {
		super(props);

		let selectedRefs = [];
		props.flight.Routes.forEach( (route,rIdx) => {
			selectedRefs.push( route.Route[0].Ref );
		});

		extendObservable(this, {
			selectedRefs: selectedRefs
		})
	}

	updateOptions(rIdx, optionValue) {
		this.selectedRefs[rIdx] = optionValue;
	}

	render() {
		const View = ItemTemplates['DESKTOP'];

		return (
			<View
				updateOptions={this.updateOptions}
				selectedRefs={this.selectedRefs}
				{...this.props}
			/>
		)
	}
}

export default FlightItem;

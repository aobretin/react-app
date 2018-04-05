import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';
import FlightListCore from 'FlightListCore';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const ListTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

const DEFAULT_SIZE = 10;

@inject("view") @observer
class FlightList extends Component {
	render() {
		const View = ListTemplates[this.props.view.device];

		return (
			<View
				{...this.props}
			/>
		)
	}
}

export default FlightListCore(FlightList);

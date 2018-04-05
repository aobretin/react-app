import React, {Component} from 'react';
import {observer, toJS} from "mobx-react";
import {extendObservable} from "mobx";
// import AirlineLogo from './AirlineLogo';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

const styles = {
	optionChecked: {
		border: '1px solid red'
	},
	optionDetailed: {
		border: '1px solid blue'
	}
}

const FlightDetailsTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

const FlightDetails = (props) => {
	const View = FlightDetailsTemplates['DESKTOP'];

	return (
		<View 
			{...props}
		/>
	)

}

export default observer(FlightDetails);
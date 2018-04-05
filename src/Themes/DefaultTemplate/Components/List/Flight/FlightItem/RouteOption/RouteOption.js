import React, {Component} from 'react';
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {extendObservable} from "mobx";
import AirlineLogo from './AirlineLogo';
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

const RouteOptionTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

class RouteOption extends Component {
	constructor(props){
		super(props);

		extendObservable(this, {
			detailed: props.detailed != undefined ? props.detailed : false
		})

	}

	updateOptions(rIdx, refValue) {
		this.props.updateOptions(rIdx, refValue);
	}

	renderDetails = () => {}

	toggleDetails = () => {
		this.detailed = this.detailed != undefined ? !this.detailed : false;
	}

	render() {
		const View = RouteOptionTemplates['DESKTOP'];
		const {rIdx, oIdx} = this.props;
		const Route = this.props.option.Route;
		let firstSegment = this.props.option.Segment[0]
		let optionCheckedClass = this.props.option.Ref == this.props.selectedRefs[rIdx] ? styles.optionChecked : ''
		let optionDetailedClass = this.detailed ? styles.optionDetailed : ''
		let lastSegment = this.props.option.Segment[this.props.option.Segment.length - 1]
		let toggleDetailsClassName = this.detailed ? 'more' : 'less'

		return (
			<View 
				key={this.detailed}
				detailed={this.detailed}
				selectedRefs={this.props.selectedRefs}
				toggleDetails={this.toggleDetails}
				{...this.props} 
			/>
		)
	}
}

export default observer(RouteOption);
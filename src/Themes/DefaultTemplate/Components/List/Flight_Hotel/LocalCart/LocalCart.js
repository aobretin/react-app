import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const LocalCartTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@inject("view") @observer
class LocalCart extends Component {
	render() {
		const View = LocalCartTemplates[this.props.view.device];

		return (
			<View
				{...this.props}
   />
		)
	}
}

export default LocalCart;

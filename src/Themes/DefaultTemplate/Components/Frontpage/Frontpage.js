import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const Templates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class Frontpage extends Component {
	
	render() {
		const View = Templates['DESKTOP'];

		return (
			<View 
				{...this.props}
			/>
		)
	}	
}

export default Frontpage;

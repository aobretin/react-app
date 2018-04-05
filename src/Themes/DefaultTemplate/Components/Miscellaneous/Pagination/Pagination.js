import React, {Component} from 'react';
import PaginationCore from 'PaginationCore';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const PaginationtTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class Pagination extends Component {
	render() {
		const View = PaginationtTemplates['DESKTOP'];

		return (
				<View {...this.props} />
		)
	}
}

export default PaginationCore(Pagination);

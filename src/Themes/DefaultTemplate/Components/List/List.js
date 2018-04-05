import React, {Component} from 'react';
import ListCore from 'ListCore';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const ListTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class List extends Component {
	constructor() {
		super();

		extendObservable(this, {
			tabShown: 0
		})
	}

	changeActiveServiceTab = tabIdx => this.tabShown = tabIdx;

	render() {
		const View = ListTemplates['DESKTOP'];

		return (
			
				<View
					tabShown={this.tabShown}
					changeActiveServiceTab={this.changeActiveServiceTab}
					{...this.props}
				/>
		)
	}
}

export default ListCore(List);

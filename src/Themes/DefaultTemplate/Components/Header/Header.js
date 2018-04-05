import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {observer, inject} from "mobx-react";

const HeaderTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@inject("view", "languagesData") @observer
class Header extends Component {
	render(){

		const View = HeaderTemplates[this.props.view.device];

		return <View languagesData={this.props.languagesData} {...this.props} />
	}
}

export default Header;

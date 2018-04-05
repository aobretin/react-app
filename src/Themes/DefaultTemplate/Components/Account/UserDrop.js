import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import AccountCore from 'AccountCore';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const UserDropTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@inject("view")  @observer
class UserDrop extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      showUserDrop: false
    });
  }

  toggleUserDrop = () => this.showUserDrop = !this.showUserDrop;

	render(){

		const View = UserDropTemplates[this.props.view.device];

		return <View showUserDrop={this.showUserDrop} toggleUserDrop={this.toggleUserDrop} {...this.props} />
	}
}

export default AccountCore(UserDrop);

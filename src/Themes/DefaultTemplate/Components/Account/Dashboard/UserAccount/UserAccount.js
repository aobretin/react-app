import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';
import Formsy from 'formsy-react-2';

import UserAccountCore from 'UserAccountCore';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const UserAccountTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@inject("view") @observer
class UserAccount extends Component {
  constructor() {
    super();

    extendObservable(this, {
      canSubmit: false
    });
  }

	render(){
		const View = UserAccountTemplates[this.props.view.device];

		return (
      <Formsy.Form
				mapping={inputs => inputs}
				onSubmit={this.props.submit}
				name="userAccountForm"
				onValid={() => this.canSubmit = true}
				onInvalid={() => this.canSubmit = false}
      >
				<View canSubmit={this.canSubmit} {...this.props} />
			</Formsy.Form>
    )
	}
}

export default UserAccountCore(UserAccount);

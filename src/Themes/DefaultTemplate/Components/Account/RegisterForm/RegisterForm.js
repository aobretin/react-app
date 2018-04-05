import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import AccountCore from 'AccountCore';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const RegisterFormTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@inject("view") @observer
class LoginForm extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      data: {
        Email: '',
        Password: ''
      },
      loading: false
    });
  }

  handleChange = e => this.data[e.target.name] = e.target.value;
  toggleLoadingState = () => this.loading = !this.loading;

	render(){
		const View = RegisterFormTemplates[this.props.view.device];

		return <View data={this.data} handleChange={this.handleChange} loading={this.loading} toggleLoadingState={this.toggleLoadingState}  {...this.props} />
	}
}

export default AccountCore(LoginForm);

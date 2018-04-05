import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import AccountCore from 'AccountCore';
import {Redirect} from 'react-router-dom';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const DashboardTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@inject("view")  @observer
class Dashboard extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      currenServiceIdx: 0
    });
  }

  changeCurrenServiceIdx = idx => this.currenServiceIdx = idx;

	render(){
		const View = DashboardTemplates[this.props.view.device];

		return (
      this.props.user.getAllowDashboard()
      ?
        <View currenServiceIdx={this.currenServiceIdx} changeCurrenServiceIdx={this.changeCurrenServiceIdx} {...this.props} />
      :
        <Redirect to='/' push /> : null
    )
	}
}

export default AccountCore(Dashboard);

import React, {Component} from 'react';
import CartCore from 'CartCore';

import {observable, extendObservable, toJS} from "mobx";
import {observer} from "mobx-react";

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

const CheckoutTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class Checkout extends Component {
	constructor(props) {
    	super(props);

		extendObservable(this, {
			detailedServices: observable.map({})
		})
	}

	toggleDetails = (serviceKey) => {
		this.detailedServices.set(serviceKey, !this.detailedServices.get(serviceKey))
	}

	render(){
		const View = CheckoutTemplates['DESKTOP'];

		return <View
			detailedServices={this.detailedServices}
			toggleDetails={this.toggleDetails}
      		{...this.props} />
	}
}

export default CartCore(Checkout);

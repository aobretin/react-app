import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const CurrencyConverterTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@inject("currencyValues")
@observer
class CurrencyConverter extends Component {
	render(){
		const View = CurrencyConverterTemplates['DESKTOP'];

		return <View {...this.props} />
	}
}

export default CurrencyConverter;

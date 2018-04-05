import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import CurrencyCore from 'CurrencyCore';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const CurrencySelectorTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class CurrencySelector extends Component {
  constructor() {
    super();

    extendObservable(this, {
      showCurrencySelector: false
    })
  }

  toggleCurrencyConverter = () => this.showCurrencySelector = !this.showCurrencySelector;

	render(){
		const View = CurrencySelectorTemplates['DESKTOP'];

		return <View showCurrencySelector={this.showCurrencySelector} toggleCurrencyConverter={this.toggleCurrencyConverter} {...this.props} />
	}
}

export default CurrencyCore(CurrencySelector);

import React, {Component} from 'react';
import CartCore from 'CartCore';

import {extendObservable, toJS} from "mobx";
import {observer} from "mobx-react";

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

const CartDropdownTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class CartDropdown extends Component {
  constructor() {
    super();

    extendObservable(this, {
      showCartDropdown: false
    })
  }

  toggleDropdown = () => this.showCartDropdown = !this.showCartDropdown;

	render(){
		const View = CartDropdownTemplates['DESKTOP'];

		return <View
      showCartDropdown={this.showCartDropdown}
      toggleDropdown={this.toggleDropdown}
      {...this.props} />
	}
}

export default CartCore(CartDropdown);

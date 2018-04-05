import React, { Component } from "react";

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

@observer
export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      extendObservable(this, {
        component: null
      });
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.component = component
    }

    render() {
      const C = this.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}

import React, {Component} from 'react';
import BookFormCore from 'BookFormCore';

import Formsy from 'formsy-react-2';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

const BookFormTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class BookForm extends Component {
  constructor() {
    super();

    extendObservable(this, {
      enableForm: false,
      selectedTab: 0
    })
  }

  changeSelectedTab = idx => this.selectedTab = idx;

	render(){
		const View = BookFormTemplates['DESKTOP'];

    return (
      <Formsy.Form
        className="col-sm-12"
        ref={form => this.props.setForm(form)}
        mapping={inputs => inputs}
        onChange={this.props.handleChange}
        onSubmit={this.props.onSubmit}
        name="bookForm"
        onValid={() => this.enableForm = true}
        onInvalid={() => this.enableForm = false}
      >
        <View
          enableForm={this.enableForm}
          selectedTab={this.selectedTab}
          changeSelectedTab={this.changeSelectedTab}
          {...this.props} />
      </Formsy.Form>
    )
	}
}

export default BookFormCore(BookForm);

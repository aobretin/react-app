import React, {Component} from 'react';
import Formsy from 'formsy-react-2';
import SearchCore from 'SearchCore';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {Redirect} from 'react-router-dom';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

import Counterpart from 'counterpart';

Formsy.addValidationRule('checkId', (values, value, otherField) => {
  let response = true;

	if (value.length == 0) return false;

  if (value.length <= 1) {
  	response = Counterpart('hey');
  } else if (otherField.length == 0) {
  	response = 'Please select a city';
  }

  return response;
});

Formsy.addValidationRule('dateCompleted', (values, value, otherField) => console.log(otherField));

const SearchTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class Search extends Component {
	constructor(props) {
		super(props);

		extendObservable(this, {
			hideForm: props.toggleForm,
			canSubmit: false
		})
	}

  toggleFormView = () => this.hideForm = !this.hideForm;

	render() {
		const View = SearchTemplates['DESKTOP'];

		return (
			<Formsy.Form
				mapping={inputs => inputs}
				onSubmit={() => this.props.handleSubmit()}
				name="searchForm"
				onValid={() => this.canSubmit = true}
				onInvalid={() => this.canSubmit = false}
				className="flex w100"
			>
				<View toggleFormView={this.toggleFormView} hideForm={this.hideForm} canSubmit={this.canSubmit} {...this.props} />
				{this.props.goToList.length ? <Redirect to={this.props.goToList} push /> : null}
			</Formsy.Form>
		)
	}
}

export default SearchCore(Search);

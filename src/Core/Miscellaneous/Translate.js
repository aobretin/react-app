import React, {Component} from 'react';

import PropTypes from 'prop-types';
import ApiService from 'ApiService';

import Translate from 'react-translate-component';

import translate from 'counterpart';

import {extendObservable} from "mobx";
import {observer, inject} from "mobx-react";

const SEPARATOR = ">>";

@observer
class TranslateWrapper extends Component {
	static propTypes = {
		component: PropTypes.any.isRequired,
		translateKey: PropTypes.string,
		with: PropTypes.object,
		attributes: PropTypes.object
	}

	static defaultProps = {
		translateKey: '',
		with: {},
		attributes: {}
	}

	render() {
		const {
			with: vars,
			component,
			translateKey,
			attributes,
			children,
			...rest
		} = this.props;

		let fallback = translateKey.split(SEPARATOR);
		fallback = fallback[fallback.length - 1];

		console.log(translateKey);

		return(
			<Translate
				component={component}
				content={translateKey}
				fallback={fallback}
				with={vars}
				attributes={attributes}
				{...rest}
			>
				{children}
			</Translate>
		)
	}
}

export default TranslateWrapper;

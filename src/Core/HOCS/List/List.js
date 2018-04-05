/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {observable, extendObservable, toJS, action} from "mobx";
import {observer, inject} from "mobx-react";

// MAIN RENDER
const ListCore = (View) => {
	return @inject("cartData") @observer class extends Component {
		static propTypes = {}

		static defaultProps = {}

		constructor(props) {
			super(props);

			extendObservable(this, {
				resultReady: false,
				searchData: {},
				services: {
					[props.match.params.type]: observable.map({})
				},
				type: props.match.params.type,
				SIDS: props.match.params.SIDS,
				requestForServices: action(sids => {
					let urls = {};

					sids.forEach((sid, idx) => {
				  		let splitted = sid.split('=');

				  		urls[`${splitted[0]}${idx}`] = `/en/dynamic-package/sid/${splitted[1]}`
					});

					ApiService.q(urls).then(res => {
						Object.keys(res).forEach((service, idx) => {
							this.searchData[service] = res[service].data;

							this.services[this.type].set(service, {
								SID: sids[idx].split('=')[1]
							});
						});

					  this.resultReady = true;
					});

					return true;
				})
			})
		}

		componentWillMount(){
			const sids = this.SIDS.split('-');

			this.requestForServices(sids);
		}

		componentWillReceiveProps(nextProps) {
			if (this.SIDS == nextProps.match.params.SIDS) return false;

			this.resultReady = false;
			this.services = {};
			this.searchData = {};
			this.type = nextProps.match.params.type;
			this.services[nextProps.match.params.type] = observable.map({});

			const sids = nextProps.match.params.SIDS.split('-');

			this.requestForServices(sids);
		}

		render(){
			return (
		        <View
              resultReady={this.resultReady}
              searchData={this.searchData}
              services={this.services}
              type={this.type}
              SIDS={this.SIDS}
              {...this.props}
						>
		          {this.props.children}
		        </View>
			)

		}
  }
}

export default ListCore;

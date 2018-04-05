/* eslint-disable */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ApiService from 'ApiService';

import {extendObservable, toJS} from "mobx";
import {observer, inject} from "mobx-react";

const UserAccountCore = (View) => {
	 return @inject("user") @observer class extends Component {
  	static propTypes = {}

    static defaultProps = {}

    constructor(props) {
      super(props);

      const {
        getUserTypeID,
        getUserData
      } = props.user;

      this.USER_TYPE_ID = getUserTypeID();
      this.USER_ID = getUserData('id');

      extendObservable(this, {
        resultsReady: false,
        fields: {
          personal: [],
          billing: []
        }
      });
    }

    componentWillMount() {
      const urls = {
        inputs: `/auth/user-detail-fields/${this.USER_TYPE_ID}`,
        inputsValues: `/auth/user-details/${this.USER_ID}/${this.USER_TYPE_ID}`
      }

      ApiService.q(urls).then(res => {
        const fields = res.inputs.data._embedded.user_detail_fields;
			  const fieldsValues = res.inputsValues.data;

        let type = 'personal';

        fields.forEach(field => {
          Object.keys(fieldsValues).forEach( fieldValue => {
    				if (field.Field == fieldsValues[fieldValue].Field) field.Value = fieldsValues[fieldValue].Value;
    			});

    			switch (field.Category) {
    				case 'Personal':
    				case 'Contact':
    					type = 'personal'; break;
    				case 'Address':
    				case 'Passport':
    				case 'Identity Card':
    					type = 'billing'; break;
    				default:
    					type = 'personal';
    					break;
    			}

    			this.fields[type].push(field);
          this.resultsReady = true;
    		})
      }).catch(res => console.log(res));
    }

    submit = model => ApiService.req(`/auth/user-details/${this.USER_ID}/${this.USER_TYPE_ID}`, 'post', model);

		render(){
			return (
	        <View
            resultsReady={this.resultsReady}
            fields={this.fields}
            submit={this.submit}
            {...this.props}
         >
            {this.props.children}
          </View>
			)

		}
	}
}

export default UserAccountCore;

import React, {Component} from 'react';

import PropTypes from 'prop-types';

import ApiService from 'ApiService';

import {compileTemplate, replaceSnippet} from 'CMSMethods';
import {withRouter} from 'react-router-dom';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

@observer
class PlaceholderConstructor extends Component {
  static propTypes = {
    slug: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    extendObservable(this, {
        appReady: false,
        hasPreviewClass: false,
        template: ''
    })
  }

  componentWillMount() {
    const {
      location: {
        hash
      },
      slug
    } = this.props;

    ApiService.getCmsSnippets(`/${slug}`).then(res => {
        const {
          Template,
          Id
        } = res.data;

        this.template = replaceSnippet(Template);
        //verifies if is preview state and gets the snippet id
        this.hasPreviewClass = hash.split('#').pop().split('&').some(item => item == `preview=${Id}`);
        this.appReady = true;
    }).catch(() => {
        this.template = '';
        this.appReady = true;
    });
  }

	render() {

		return (
      !this.appReady
      ?
      <div>Loading</div>
      :
      <div className={this.hasPreviewClass ? 'preview-placeholder' : ''}>{compileTemplate(this.template)}</div>
		)
	}
}

export default withRouter(PlaceholderConstructor);

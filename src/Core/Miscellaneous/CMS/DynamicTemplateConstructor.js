import React, {Component} from 'react';

import PropTypes from 'prop-types';

import ApiService from 'ApiService';

import {compileTemplate, replaceSnippet} from 'CMSMethods';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";


import {Helmet} from 'react-helmet';

@observer
class DynamicTemplateConstructor extends Component {
  static propTypes = {
    slug: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    extendObservable(this, {
        appReady: false,
        head: '',
        template: ''
    })

  }

  componentWillMount() {
    const {
      slug
    } = this.props;

    ApiService.getCmsPages(`/${slug}`).then(res => {
      this.template = replaceSnippet(res.data.Content);
      this.head = res.data.Head;
      this.props.headerFooterSetter({'Header': res.data.Header, 'Footer': res.data.Footer});

      this.appReady = true;
    });

  }

  componentWillUnmount() {
    this.props.headerFooterSetter({'Header': '1', 'Footer': '1'});
  }

	render() {
		return (
      !this.appReady
      ?
      <div>Loading</div>
      :

      <div>
        <Helmet>{compileTemplate(this.head)}</Helmet>
        {compileTemplate(this.template)}
      </div>
		)
	}
}

export default DynamicTemplateConstructor;

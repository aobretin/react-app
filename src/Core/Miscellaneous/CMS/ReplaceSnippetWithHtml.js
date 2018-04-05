import React, {Component} from 'react';

import PropTypes from 'prop-types';

import ApiService from 'ApiService';

import {replaceSnippet} from 'CMSMethods';
import {twig} from 'twig';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

@observer
class ReplaceSnippetWithHtml extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    extendObservable(this, {
        template: '',
        appReady: false
    })

  }

  componentWillMount() {
    const {
      name
    } = this.props;

    const self = this;

    ApiService.getCmsSnippets(`/${name}`).then(res => {
      let dataSource = res.data.DataUrl;
      let template = replaceSnippet(res.data.Template);

      if(dataSource == null){
        this.template = template;
      }else{
        ApiService.getDataSource(dataSource).then(res => {
          this.template = twig({
            data: template
          }).render(res.data);
        })
      }
    })

    this.appReady = true;



  }

	render() {
		return (
      !this.appReady 
      ?
      <div>Loading</div>
      :
      <div dangerouslySetInnerHTML={{__html: this.template}} /> 
		)
	}
}

export default ReplaceSnippetWithHtml;

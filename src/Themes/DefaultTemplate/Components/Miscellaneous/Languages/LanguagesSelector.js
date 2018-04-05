import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import LanguagesCore from 'LanguagesCore';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

const LanguagesSelectorTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class LanguagesSelector extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      currentLanguage: 'en',
      showLanguagesList: false,
      languages: []
    })
  }

  toggleLanguagesList = () => this.showLanguagesList = !this.showLanguagesList;

  handleChange = (langObj) => {
     this.props.changeLanguage(langObj);
     this.showLanguagesList = false;
  }

	render(){
		const View = LanguagesSelectorTemplates['DESKTOP'];

		return <View 
            showLanguagesList={this.showLanguagesList}
            toggleLanguagesList={this.toggleLanguagesList}
            handleChange={this.handleChange}
            {...this.props} 
          />
	}
}

export default LanguagesCore(LanguagesSelector);

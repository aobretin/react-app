import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

const FooterTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

class Footer extends Component {
	render(){
		const View = FooterTemplates['DESKTOP'];

		return <View {...this.props} />
	}
}

export default Footer;

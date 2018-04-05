import React from 'react';
import {observer} from "mobx-react";
import Search from 'Search';

import PlaceholderConstructor from 'PlaceholderConstructor';

const ViewDesktop = (props) => {


	return(		
		<div className="container flex minh100 no-padding" style={{flexWrap: 'wrap'}}>
			<Search />
			<PlaceholderConstructor slug="..widgets.." />
		</div>
	)
}

export default observer(ViewDesktop);
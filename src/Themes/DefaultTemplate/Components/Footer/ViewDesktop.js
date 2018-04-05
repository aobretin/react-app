import React from 'react';
import {observer} from "mobx-react";

import PlaceholderConstructor from 'PlaceholderConstructor';

const ViewDesktop = props => {
  return (
    <footer className="align-self-end flex">
      <PlaceholderConstructor slug="..footer.1.." />
      <div className="container align-self-center">
        <div className="row no-gutters">
          <div className="col-3">
					<a href="#" className=""><span className="icon-yt"></span></a> &nbsp;
					<a href="#" className=""><span className="icon-fb"></span></a> &nbsp;
					<a href="#" className=""><span className="icon-ig"></span></a> &nbsp;
				</div>
				<div className="col-6 text-center">
					<a href="#" className="white-text">terms & conditions</a> | <a href="#" className="white-text">privacy policy</a>
				</div>
				<div className="col-3 text-right">
					dcs plus &copy; <span className="text-muted">all rights reserved</span>
				</div>
			</div>
		</div>
	</footer>
  )
}

export default observer(ViewDesktop);

import React from 'react';
import {observer} from "mobx-react";
import FormElement from 'FormElement'

const ViewDesktop = props => {
  return (
    <div className="card" style={{marginBottom: '20px'}}>
      <div className="card-header">
        Contact
      </div>
      <div className="card-body row">
        <div className="form-group col-sm-3">
          <label>First name</label>
          <FormElement placeholder="First name" component='input' type="text" className="form-control" name='owner[firstname]' required />
        </div>
        <div className="form-group col-sm-3">
          <label>Last name</label>
          <FormElement placeholder="Last name" component='input' type="text" className="form-control" name='owner[lastname]' required />
        </div>

        <div className="form-group col-sm-3">
          <label>Email</label>
          <FormElement placeholder="Email" component='input' type="text" className="form-control" name='owner[email]' required />
        </div>

        <div className="form-group col-sm-3">
          <label>Phone</label>
          <FormElement placeholder="Phone" component='input' type="text" className="form-control" name='owner[phone]' required />
        </div>
      </div>
    </div>
  )
}

export default observer(ViewDesktop);

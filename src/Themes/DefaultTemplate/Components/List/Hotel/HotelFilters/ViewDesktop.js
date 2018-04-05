import React from 'react';
import {observer} from "mobx-react";

import Nouislider from 'react-nouislider';

const ViewDesktop = props => {
  const {
    filters,
    handleFilterCheck,
    filterByName,
    handleNameChange,
    initialPrices,
    onPriceRangeChange
  } = props;

  const {
    stars,
    filter,
    prices
  } = filters;

  return(
    <div>
      <h3><strong>Filters</strong></h3>
      <div className="card">
        <ul className="list-group list-group-flush">
          {
            initialPrices.length === 2 && (
              <li className="list-group-item">
                <h5><strong>Prices</strong></h5>
                <div style={{"padding": "0 10px"}}>
                  <Nouislider
      							range={{min: Math.floor(initialPrices[0]), max: Math.ceil(initialPrices[1])}}
                    start={[+prices[0], +prices[1]]}
      							step={1}
      							onEnd={onPriceRangeChange}
      							tooltips={[{to: val => Math.floor(val)}, {to: val => Math.ceil(val)}]}
      						/>
                </div>
              </li>
            )
          }

          {
            stars.length > 1
              ?
                <li className="list-group-item">
                  <h5><strong>Stars</strong></h5>
                  <div style={{"padding": "0 10px"}}>
                    {
                      stars.map(star => {
                        return (
                          <div key={star.value} className="form-check">
                            <label className={`checkbox-inline ${star.checked ? 'checked' : null}`}>
                              <input type="checkbox" className="form-check-input" name="stops" onChange={(e, type) => handleFilterCheck(e, "stars")} checked={star.checked} value={star.value} /> {star.label}
                            </label>
                          </div>
                        )
                      })
                    }
                  </div>
                </li>
              :
            null
          }

          <li className="list-group-item">
            <h5><strong>Hotel name type</strong></h5>
            <div>
              <input placeholder="Hotel name type..." className="form-control" type="text" name="type" onChange={e => props.handleNameChange(e)} onKeyDown={props.filterByName} value={filter.Name.like} />
            </div>
          </li>

          <li className="list-group-item">
            <h5><strong>Hotel type</strong></h5>
            {
              filters.types.map(type => {
                return (
                  <div key={type.value} className="form-check">
                    <label className={`checkbox-inline ${type.checked ? 'checked' : null}`}>
                      <input type="radio" className="form-check-input" name="type" onChange={e => props.handleTypeCheck(e)} checked={type.checked} value={type.value} /> {type.label}
                    </label>
                  </div>
                )
              })
            }
          </li>

        </ul>
      </div>
    </div>
  )
}

export default observer(ViewDesktop);

import React from 'react';
import {observer} from "mobx-react";

const ViewDesktop = props => {
  const {
    showLanguagesList,
    toggleLanguagesList,
    currentLanguage,
    handleChange,
    changeLanguage,
    languages
  } = props;

  return (
    <div className="col dropdown" id="langDrop">
      <a href="javascript:;" onClick={toggleLanguagesList} className="dropdown-toggle" data-toggle="dropdown"><span className="icon-"></span>{currentLanguage.code.toUpperCase()}</a>
      <div className={`dropdown-menu align-right ${showLanguagesList ? ' show' : ''}`} aria-labelledby="langDrop">
        {
          languages.map((lang, idx) => {
            return (
              <a href="javascript:;" key={idx} onClick={() => handleChange(lang)} className="dropdown-item">{lang.name}</a>
            )
          })
        }
      </div>
    </div>
  )
}

export default observer(ViewDesktop);

/*
<div className="dropdown col">
      <button onClick={toggleLanguagesList} className="btn btn-secondary dropdown-toggle">{currentLanguage.code.toUpperCase()}</button>
      <div style={{left: 'auto', right: 0}} className={`dropdown-menu${showLanguagesList ? ' show' : ''}`}>
        {
          languages.map((lang, idx) => {
            return (
              <a key={idx} onClick={() => handleChange(lang)} className="dropdown-item">{lang.name}</a>
            )
          })
        }
      </div>
    </div>

    */

import React, {Component} from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

@observer
class ModalWrapper extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string,
    onRequestClose: PropTypes.func,
    onAfterOpen: PropTypes.func,
    shouldCloseOnOverlayClick: PropTypes.bool
  }

  static defaultProps = {
    isOpen: false,
    title: 'Modal',
    onRequestClose: () => {},
    onAfterOpen: () => {},
    shouldCloseOnOverlayClick: false
  }

  constructor(props) {
    super(props);

    extendObservable(this, {
      openModal: props.isOpen
    });
  }

  componentWillReceiveProps(nextProps) {
    this.openModal = nextProps.isOpen;
  }

  closeModal = () => this.openModal = false;

	render() {
    const {
      openModal,
      closeModal,
      props: {
        onRequestClose,
        onAfterOpen,
        title,
        children,
        shouldCloseOnOverlayClick
      }
    } = this;

		return (
			<Modal
        isOpen={openModal}
        contentLabel="Modal"
        className="modal-content"
        // onRequestClose={onRequestClose}
        onAfterOpen={onAfterOpen}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        style={
          {
            overlay: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            },
            content: {
              width: 'auto',
              left: 'auto',
              right: 'auto',
              top: 'auto',
              bottom: 'auto',
              padding: 0,
              border: 'none'
            }
          }
        }
        role="dialog"
   >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button onClick={() => {
              onRequestClose();
              closeModal();
            }} type="button" className="close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>

			</Modal>
		)
	}
}

export default ModalWrapper;

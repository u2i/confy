import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import helpText from 'texts/help.md';

const Header = () => (
  <Modal.Header closeButton>
    <Modal.Title>What is this?</Modal.Title>
  </Modal.Header>
);

const Body = () => (
  <Modal.Body dangerouslySetInnerHTML={{ __html: helpText }} />
);

const Footer = ({ onHide }) => (
  <Modal.Footer>
    <Button onClick={onHide}>Close</Button>
  </Modal.Footer>
);

Footer.propTypes = {
  onHide: React.PropTypes.func
};

const Help = ({ show, onHide }) => (
  <Modal show={show} onHide={onHide}>
    <Header />
    <Body />
    <Footer onHide={onHide} />
  </Modal>
);

Help.propTypes = {
  show: React.PropTypes.bool,
  onHide: React.PropTypes.func
};

Help.Header = Header;
Help.Body = Body;
Help.Footer = Footer;

export default Help;

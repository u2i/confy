import React from 'react';
import { Modal } from 'react-bootstrap';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import CreateEventModal from 'components/modal/CreateEventModal';
import ConferenceRoom from 'test/factories/ConferenceRoom';
import ModalHeader from 'components/modal/layout/ModalHeader';
import ModalBody from 'components/modal/layout/ModalBody';
import ModalFooter from 'components/modal/layout/ModalFooter';

describe('<CreateEventModal />', () => {
  const props = {
    closeModal: () => {},
    refresh: () => {},
    showModal: true
  };
  
  const wrapper = shallow(<CreateEventModal
    conferenceRooms={[ConferenceRoom.build()]} {...props} />);

  it('renders <Modal />', () => {
    expect(wrapper.find(Modal)).to.exist();
  });

  it('renders <ModalHeader />', () => {
    expect(wrapper.find(ModalHeader)).to.exist();
  });

  it('renders <ModalBody />', () => {
    expect(wrapper.find(ModalBody)).to.exist();
  });

  it('renders <ModalFooter />', () => {
    expect(wrapper.find(ModalFooter)).to.exist();
  });
});

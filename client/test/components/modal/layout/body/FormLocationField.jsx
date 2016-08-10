import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { ControlLabel, FormControl } from 'react-bootstrap';
import FormLocationField from 'components/modal/layout/body/FormLocationField';
import ConferenceRoom from 'test/factories/ConferenceRoom';

describe('<FormLocationField />', () => {
  const onChangeSpy = sinon.spy();
  const rooms = [
    ConferenceRoom.build(),
    ConferenceRoom.build()
  ];

  const formLocationField = (props) => (
    <FormLocationField
      available={props.available || rooms}
      unavailable={props.unavailable || []}
      onChange={onChangeSpy} />
  );

  const shallowWrapper = (props) => shallow(formLocationField(props));
  const mountWrapper = (props) => mount(formLocationField(props));

  it('renders <ControlLabel />', () => {
    const wrapper = shallowWrapper();
    expect(wrapper.find(ControlLabel)).to.exist();
  });

  it('renders <ControlLabel /> with "Location:" text', () => {
    const wrapper = mountWrapper();
    expect(wrapper.find(ControlLabel)).to.have.text('Location:');
  });

  it('renders <FormControl />', () => {
    const wrapper = shallowWrapper();
    expect(wrapper.find(FormControl)).to.exist();
  });

  it('invokes onChange handler after location change', () => {
    const wrapper = mountWrapper();
    wrapper.find('select').simulate('change', { target: { value: rooms[1].id } });
    expect(onChangeSpy).to.be.calledOnce();
  });

  describe('location select', () => {
    it('renders select option for every room', () => {
      const wrapper = mountWrapper({ unavailable: ConferenceRoom.buildList(2) });
      expect(wrapper).to.have.exactly(rooms.length + 2).descendants();
    });

    context('with empty available and unavailable location list', () => {
      it('should not render option groups', () => {
        const wrapper = mountWrapper({ available: [] });
        expect(wrapper).to.not.have.descendants('optgroup');
      });
    });

    context('with non-empty available location list', () => {
      it('should render available location group', () => {
        const wrapper = mountWrapper({ available: rooms });
        expect(wrapper).to.have.exactly(1).descendants('optgroup');
      });
    });

    context('with non-empty unavailable location list', () => {
      it('should render unavailable location group', () => {
        const wrapper = mountWrapper({ available: [], unavailable: rooms });
        expect(wrapper).to.have.exactly(1).descendants('optgroup');
      });
    });
  });
});

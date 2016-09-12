import React from 'react';
import { Checkbox } from 'react-bootstrap';
import { mount, shallow } from 'enzyme';
import Filter from 'components/calendar/filters/Filter';
import { expect } from 'chai';
import sinon from 'sinon';
import ConferenceRoom from 'test/factories/ConferenceRoom';


describe('<Filter />', () => {
  const conferenceRoom = ConferenceRoom.build();
  const defaultProps = {
    color: conferenceRoom.color,
    onEnabled: () => {
    },
    onDisabled: () => {
    },
    key: conferenceRoom.id,
    enabled: false
  };
  const defaultWrapper = mount(<Filter {...defaultProps} >{conferenceRoom.title}</Filter>);

  it('renders <Checbkox />', () => {
    expect(defaultWrapper.find(Checkbox)).to.have.lengthOf(1);
  });

  it('sets .filter-box backgroundColor', () => {
    expect(defaultWrapper.find('.filter-box').props().style.backgroundColor).to.eq(conferenceRoom.color);
  });

  it('triggers onToggle callback', () => {
    const onToggle = sinon.spy();
    const props = {
      onToggle,
      color: conferenceRoom.color,
      enabled: false
    };

    const wrapper = mount(<Filter {...props} />);

    wrapper.find('input').simulate('change');
    expect(onToggle).to.have.been.calledOnce();
  });
});

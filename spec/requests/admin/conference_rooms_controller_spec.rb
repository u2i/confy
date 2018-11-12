require 'rails_helper'

RSpec.describe 'Admin::ConferenceRooms', type: :request do
  let(:headers) { AuthHelper.http_basic_auth }
  let(:valid_attributes) { { title: 'Room', color: '#AABBCC', email: 'room@test.com', capacity: 4 } }
  let(:invalid_attributes) { { title: '', color: '', email: '' } }

  describe 'GET #index' do
    subject { get admin_conference_rooms_url, headers: headers }

    let!(:conference_room) { create(:conference_room) }

    it_behaves_like 'successfull request'
    it_behaves_like 'unauthenticated request'
  end

  describe 'GET #show' do
    subject { get admin_conference_room_url(conference_room), headers: headers }

    let!(:conference_room) { create(:conference_room, valid_attributes) }

    it_behaves_like 'successfull request'
    it_behaves_like 'unauthenticated request'
  end

  describe 'GET #new' do
    subject { get new_admin_conference_room_url, headers: headers }

    it_behaves_like 'successfull request'
    it_behaves_like 'unauthenticated request'
  end

  describe 'GET #edit' do
    subject { get edit_admin_conference_room_url(conference_room), headers: headers }

    let!(:conference_room) { create(:conference_room, valid_attributes) }

    it_behaves_like 'successfull request'
    it_behaves_like 'unauthenticated request'
  end

  describe 'POST #create' do
    subject { post admin_conference_rooms_url, headers: headers, params: { conference_room: attributes } }

    context 'with valid params' do
      let(:attributes) { valid_attributes }

      it_behaves_like 'unauthenticated request'

      it 'creates a new ConferenceRoom' do
        expect { subject }.to change(ConferenceRoom, :count).by(1)
      end

      it 'redirects to the created conference_room' do
        subject
        expect(response).to redirect_to(admin_conference_room_url(ConferenceRoom.last))
      end
    end

    context 'with invalid params' do
      let(:attributes) { invalid_attributes }

      it_behaves_like 'successfull request'
      it_behaves_like 'unauthenticated request'

      it 'does not creates a new ConferenceRoom' do
        expect { subject }.not_to change(ConferenceRoom, :count)
      end
    end
  end

  describe 'PUT #update' do
    subject { put admin_conference_room_url(conference_room), headers: headers, params: { conference_room: new_attributes } }

    let!(:conference_room) { create(:conference_room, valid_attributes) }

    context 'with valid params' do
      let(:new_attributes) { { title: 'Room - updated' } }

      it 'updates the requested conference room' do
        expect do
          subject
          conference_room.reload
        end.to change(conference_room, :title).from('Room').to('Room - updated')
      end

      it 'redirects to the updated conference_room' do
        subject
        expect(response).to redirect_to(admin_conference_room_url(conference_room))
      end

      it_behaves_like 'unauthenticated request'
    end

    context 'with invalid params' do
      let(:new_attributes) { { title: '' } }

      it 'does not update the requested conference room' do
        expect do
          subject
          conference_room.reload
        end.not_to change(conference_room, :title)
      end

      it_behaves_like 'successfull request'
      it_behaves_like 'unauthenticated request'
    end
  end

  describe 'DELETE #destroy' do
    subject { delete admin_conference_room_url(conference_room), headers: headers }

    let!(:conference_room) { create(:conference_room, valid_attributes) }

    it 'destroys the requested conference_room' do
      expect { subject }.to change(ConferenceRoom, :count).by(-1)
    end

    it 'redirects to the conference rooms' do
      subject
      expect(response).to redirect_to(admin_conference_rooms_url)
    end

    it_behaves_like 'unauthenticated request'
  end
end

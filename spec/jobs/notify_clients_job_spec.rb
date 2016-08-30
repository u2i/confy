require 'rails_helper'

RSpec.describe NotifyClientsJob, type: :job do
  include ActiveJob::TestHelper
  describe '.perform' do
    let(:server) { double('server', broadcast: true) }
    let(:conference_room_id) { 1 }
    subject(:job) { described_class.perform_later(conference_room_id) }

    it 'is queued' do
      expect { job }.to have_enqueued_job.with(conference_room_id)
    end

    it 'executes ActionCable.server.broadcast call with appropriate conference room id' do
      allow(ActionCable).to receive(:server) { server }
      expect(server).to receive(:broadcast).with('events', conference_room_id: conference_room_id)
      perform_enqueued_jobs do
        described_class.perform_later(conference_room_id)
      end
    end
  end
end

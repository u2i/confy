class AddTypeToConferenceRoom < ActiveRecord::Migration[5.0]
  def change
    add_column :conference_rooms, :kind, :integer, default: 0
  end
end

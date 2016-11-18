class AddLogoToConferenceRooms < ActiveRecord::Migration[5.0]
  def change
    add_column :conference_rooms, :logo, :string
  end
end

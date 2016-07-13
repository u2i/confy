class AddEmailFieldToConferenceRoom < ActiveRecord::Migration[5.0]
  def change
    add_column :conference_rooms, :email, :string, null: false, unique: true
  end
end

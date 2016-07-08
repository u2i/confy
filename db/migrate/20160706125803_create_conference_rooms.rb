class CreateConferenceRooms < ActiveRecord::Migration[5.0]
  def change
    create_table :conference_rooms do |t|
      t.integer :capacity, null: false
      t.string :title, null: false, unique: true
      t.string :color, null: false, unique: true

      t.timestamps
    end
  end
end

class CreateEventsTable < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|
      t.string :event_id, null: false, unique: true
      t.belongs_to :conference_room, index: true, null: false
      t.boolean :confirmed, default: false

      t.timestamps
    end
  end
end

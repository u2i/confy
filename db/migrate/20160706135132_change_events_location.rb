class ChangeEventsLocation < ActiveRecord::Migration[5.0]
  def change
    remove_column :events, :location, :string, null: false
    add_reference :events, :conference_room, index: true, foreign_key: true
  end
end

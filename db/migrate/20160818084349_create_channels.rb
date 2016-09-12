class CreateChannels < ActiveRecord::Migration[5.0]
  def change
    create_table :channels do |t|
      t.string :channel_id, null: false, unique: true
      t.string :resource_id, null: false, unique: true
      t.belongs_to :conference_room, index: true, null: false
      t.timestamp :expiration, null: false

      t.timestamps
    end
  end
end

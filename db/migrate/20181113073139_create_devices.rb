class CreateDevices < ActiveRecord::Migration[5.0]
  def change
    create_table :devices do |t|
      t.string :device_id
      t.string :device_name
      t.integer :conference_room_id
      t.boolean :authorized

      t.timestamps
    end

    add_index :devices, :device_id, unique: true
  end
end

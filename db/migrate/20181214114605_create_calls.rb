class CreateCalls < ActiveRecord::Migration[5.0]
  def change
    create_table :calls do |t|
      t.string :link
      t.integer :event_id
      t.boolean :active

      t.timestamps
    end

    add_index :calls, :link, unique: true
    add_index :calls, :event_id
    add_index :calls, :active
  end
end

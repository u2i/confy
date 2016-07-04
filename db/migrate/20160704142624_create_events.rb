class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events do |t|
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.string :description
      t.string :user, null: false
      t.string :location, null: false

      t.timestamps
    end
  end
end

class AddNameToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :name, :string
  end
end

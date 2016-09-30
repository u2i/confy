class AddNotifiedToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :notified, :boolean
  end
end

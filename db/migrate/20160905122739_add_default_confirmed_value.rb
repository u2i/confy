class AddDefaultConfirmedValue < ActiveRecord::Migration[5.0]
  def change
    change_column_default :events, :confirmed, false
  end
end

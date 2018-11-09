class AddingIndex < ActiveRecord::Migration[5.2]
  def change
    add_index :likes, [:likable_id, :likable_type, :user_id], unique: true

  end
end

class CreateLikes < ActiveRecord::Migration[5.2]
  def change
    create_table :likes do |t|
      t.integer :user_id
      t.integer :likable_id
      t.string :likable_type
      t.timestamps
    end

    add_index :likes, [:likable_id, :likable_type, :user_id]
  end
end

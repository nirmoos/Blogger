class AddIsDeletedToComments < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :is_deleted, :boolean, default: false
  end
end

class ChangeColumnNames < ActiveRecord::Migration[5.2]
  def change
    rename_column :comments, :comment_id, :parent_id
  end
end

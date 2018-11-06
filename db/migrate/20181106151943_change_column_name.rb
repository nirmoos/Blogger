class ChangeColumnName < ActiveRecord::Migration[5.2]
  def change
    rename_column :comments, :comments_id, :comment_id
  end
end

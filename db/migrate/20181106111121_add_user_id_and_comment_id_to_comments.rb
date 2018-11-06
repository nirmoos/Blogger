class AddUserIdAndCommentIdToComments < ActiveRecord::Migration[5.2]
  def change
    add_column :comments, :comments_id, :bigint
  end
end

class AddPublicToArticles < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :ispublic, :boolean
  end
end

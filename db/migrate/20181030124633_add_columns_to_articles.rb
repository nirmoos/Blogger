class AddColumnsToArticles < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :title, :string
    add_column :articles, :content, :text
  end
end

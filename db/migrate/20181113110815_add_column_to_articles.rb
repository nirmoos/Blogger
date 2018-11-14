class AddColumnToArticles < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :is_drafted, :boolean, default: false
  end
end

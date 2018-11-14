class ChangeColumnTypeOfArticles < ActiveRecord::Migration[5.2]
  def change
    change_column :articles, :ispublic, :boolean
  end
end

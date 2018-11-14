class ChangeColumnTypeToIspublicArticles < ActiveRecord::Migration[5.2]
  def change
    change_column :articles, :ispublic, :boolean, default: true
  end
end

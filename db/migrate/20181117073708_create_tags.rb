class CreateTags < ActiveRecord::Migration[5.2]
  def change
    create_table :tags do |t|
      t.references :article, foreign_key: true
      t.string :name
      t.timestamps
    end
    add_index :tags, [:article_id, :name], unique: true
  end
end

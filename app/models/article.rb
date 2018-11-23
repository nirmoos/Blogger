class Article < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :likes, as: :likable
  has_many :article_tags
  has_many :tags, through: :article_tags, dependent: :destroy

  validates :title, :content, presence: true

end

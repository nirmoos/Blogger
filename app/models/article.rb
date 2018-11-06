class Article < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy

  has_many :comments, dependent: :destroy

  validates :title, :content, presence: true
end

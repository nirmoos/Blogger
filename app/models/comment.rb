class Comment < ApplicationRecord
  belongs_to :parent, class_name: 'Comment',
                      foreign_key: 'parent_id',
                      optional: true
  has_many :replies, class_name: 'Comment',
                     foreign_key: 'parent_id'
  has_many :likes, as: :likable
  belongs_to :article, optional: true
  belongs_to :user
end

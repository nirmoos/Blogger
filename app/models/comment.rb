class Comment < ApplicationRecord
  belongs_to :parent, class_name: 'Comment',
                      foreign_key: 'parent_id',
                      optional: true
  has_many :replies, class_name: 'Comment',
                     foreign_key: 'parent_id'
  belongs_to :article, optional: true

end

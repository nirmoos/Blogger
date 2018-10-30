class User < ApplicationRecord
  # Include default devise modules.
  # :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable
  # Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :validatable
end

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_11_06_151158) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "abcs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "articles", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.text "content"
    t.boolean "ispublic"
    t.index ["user_id"], name: "index_articles_on_user_id"
  end

  create_table "bbcs", force: :cascade do |t|
    t.bigint "abcs_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["abcs_id"], name: "index_bbcs_on_abcs_id"
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "article_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "body"
    t.bigint "user_id"
    t.bigint "comments_id"
    t.boolean "is_deleted", default: false
    t.index ["article_id"], name: "index_comments_on_article_id"
  end

  create_table "followers", force: :cascade do |t|
    t.bigint "follower_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_followers_on_user_id"
  end

  create_table "relationships", force: :cascade do |t|
    t.integer "follower_id"
    t.integer "followed_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["followed_id"], name: "index_relationships_on_followed_id"
    t.index ["follower_id", "followed_id"], name: "index_relationships_on_follower_id_and_followed_id", unique: true
    t.index ["follower_id"], name: "index_relationships_on_follower_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "firstname", default: "", null: false
    t.string "lastname", default: "", null: false
    t.boolean "admin", default: false
    t.boolean "is_blocked", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "articles", "users"
  add_foreign_key "bbcs", "abcs", column: "abcs_id"
  add_foreign_key "comments", "articles"
  add_foreign_key "followers", "users"
end

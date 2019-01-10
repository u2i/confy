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

ActiveRecord::Schema.define(version: 20181214114605) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "calls", force: :cascade do |t|
    t.string   "link"
    t.string   "event_id"
    t.boolean  "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_calls_on_active", using: :btree
    t.index ["event_id"], name: "index_calls_on_event_id", using: :btree
    t.index ["link"], name: "index_calls_on_link", unique: true, using: :btree
  end

  create_table "channels", force: :cascade do |t|
    t.string   "channel_id",         null: false
    t.string   "resource_id",        null: false
    t.integer  "conference_room_id", null: false
    t.datetime "expiration",         null: false
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.index ["conference_room_id"], name: "index_channels_on_conference_room_id", using: :btree
  end

  create_table "conference_rooms", force: :cascade do |t|
    t.integer  "capacity",               null: false
    t.string   "title",                  null: false
    t.string   "color",                  null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "email",                  null: false
    t.integer  "kind",       default: 0
    t.string   "logo"
  end

  create_table "devices", force: :cascade do |t|
    t.string   "device_id"
    t.string   "device_name"
    t.integer  "conference_room_id"
    t.boolean  "authorized"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.index ["device_id"], name: "index_devices_on_device_id", unique: true, using: :btree
  end

  create_table "events", force: :cascade do |t|
    t.string   "event_id",                           null: false
    t.integer  "conference_room_id",                 null: false
    t.boolean  "confirmed",          default: false
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.index ["conference_room_id"], name: "index_events_on_conference_room_id", using: :btree
  end

  create_table "sessions", force: :cascade do |t|
    t.string   "session_id", null: false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["session_id"], name: "index_sessions_on_session_id", unique: true, using: :btree
    t.index ["updated_at"], name: "index_sessions_on_updated_at", using: :btree
  end

end

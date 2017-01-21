class CreateImportRecords < ActiveRecord::Migration
  def change
    create_table :import_records do |t|
      t.datetime :time_ended
      t.text :json

      t.timestamps null: false
    end
  end
end

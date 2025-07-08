import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateConversationsTable extends BaseSchema {
  protected tableName = 'conversations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('session_id').notNullable().unique()
      table.integer('last_message_id').unsigned().nullable() 
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

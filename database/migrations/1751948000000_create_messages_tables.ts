import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateMessagesTable extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('conversation_id').nullable() 
      table.enum('sender_type', ['user', 'bot']).notNullable()
      table.text('message').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

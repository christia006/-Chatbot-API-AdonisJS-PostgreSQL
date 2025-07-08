import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  BelongsTo,
  belongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'

export default class Conversation extends BaseModel {
  public static table = 'conversations'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'session_id' })
  public sessionId!: string

  @column({ columnName: 'last_message_id' })
  public lastMessageId!: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @hasMany(() => Message, {
    localKey: 'sessionId',
    foreignKey: 'conversationId',
  })
  public messages!: HasMany<typeof Message>

  @belongsTo(() => Message, {
    foreignKey: 'lastMessageId',
  })
  public lastMessage!: BelongsTo<typeof Message>
}

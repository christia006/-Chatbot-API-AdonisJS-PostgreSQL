import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  BelongsTo,
  belongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import Conversation from './Conversation'

export default class Message extends BaseModel {
  public static table = 'messages'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'conversation_id' })
  public conversationId!: string

  @column({ columnName: 'sender_type' })
  public senderType!: 'user' | 'bot'

  @column()
  public message!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => Conversation, {
    foreignKey: 'conversationId',
    localKey: 'sessionId',
  })
  public conversation!: BelongsTo<typeof Conversation>
}

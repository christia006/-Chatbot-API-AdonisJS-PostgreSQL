import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Conversation from 'App/Models/Conversation'
import Message from 'App/Models/Message'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import QuestionValidator from 'App/Validators/QuestionValidator'

export default class ConversationsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      const { question, sessionId: incomingSessionId } = await request.validate(QuestionValidator)

      let conversation: Conversation | null
      let sessionId: string

      if (incomingSessionId) {
        conversation = await Conversation.findBy('sessionId', incomingSessionId)
        sessionId = conversation ? conversation.sessionId : uuidv4()
        if (!conversation) {
          conversation = await Conversation.create({ sessionId })
        }
      } else {
        sessionId = uuidv4()
        conversation = await Conversation.create({ sessionId })
      }

      if (!conversation) {
        return response.internalServerError({ message: 'Gagal membuat atau menemukan percakapan.' })
      }

      const userMessage = await Message.create({
        conversationId: sessionId,
        senderType: 'user',
        message: question,
      })

     
      const specialAnswers: Record<string, string> = {
        'apa itu ai?': 'AI adalah kecerdasan buatan yang memungkinkan mesin meniru perilaku manusia.',
        'apa itu machine learning?': 'Machine Learning adalah bagian dari AI untuk belajar dari data.',
      }

      const normalizedQuestion = question.trim().toLowerCase()
      let botResponseText = specialAnswers[normalizedQuestion]

      
      if (!botResponseText) {
        const externalApiUrl = 'https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message'

        try {
          const externalApiResponse = await axios.post(externalApiUrl, {
            session_id: sessionId,
            message: question,
          })

          botResponseText =
            externalApiResponse.data?.response?.message ||
            externalApiResponse.data?.message ||
            'Tidak ada jawaban dari bot.'
        } catch (error) {
          console.error('Error memanggil API eksternal:', error)
          botResponseText = 'Maaf, terjadi kesalahan saat menghubungi chatbot eksternal.'
        }
      }

      const botMessage = await Message.create({
        conversationId: sessionId,
        senderType: 'bot',
        message: botResponseText,
      })

      await conversation.merge({ lastMessageId: botMessage.id }).save()

      return response.ok({
        sessionId,
        messages: [
          {
            sender: 'user',
            message: userMessage.message,
            timestamp: userMessage.createdAt,
          },
          {
            sender: 'bot',
            message: botMessage.message,
            timestamp: botMessage.createdAt,
          },
        ],
      })
    } catch (error: any) {
      if (error?.messages) {
        return response.badRequest(error.messages)
      }

      console.error('Error di store:', error)
      return response.internalServerError({
        message: 'Terjadi kesalahan pada server.',
        error: error?.message ?? error,
      })
    }
  }

  public async index({ request, response }: HttpContextContract) {
    try {
      const { search, page = 1, limit = 10 } = request.qs()
      const query = Conversation.query().preload('lastMessage')

      if (search) {
        query.whereHas('lastMessage', (messageQuery) => {
          messageQuery.where('message', 'ILIKE', `%${search}%`)
        })
      }

      const conversations = await query.paginate(page, limit)
      return response.ok(conversations.serialize())
    } catch (error) {
      console.error('Error di index:', error)
      return response.internalServerError({
        message: 'Terjadi kesalahan pada server.',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const { id_or_uuid } = params
      let conversation: Conversation | null

      if (!isNaN(Number(id_or_uuid))) {
        conversation = await Conversation.query()
          .where('id', id_or_uuid)
          .preload('messages')
          .first()
      } else {
        conversation = await Conversation.query()
          .where('sessionId', id_or_uuid)
          .preload('messages')
          .first()
      }

      if (!conversation) {
        return response.notFound({ message: 'Percakapan tidak ditemukan.' })
      }

      return response.ok(conversation.serialize())
    } catch (error) {
      console.error('Error di show:', error)
      return response.internalServerError({
        message: 'Terjadi kesalahan pada server.',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const { id_or_uuid } = params
      let conversation: Conversation | null

      if (!isNaN(Number(id_or_uuid))) {
        conversation = await Conversation.find(id_or_uuid)
      } else {
        conversation = await Conversation.findBy('sessionId', id_or_uuid)
      }

      if (!conversation) {
        return response.notFound({ message: 'Percakapan tidak ditemukan.' })
      }

      await conversation.delete()
      return response.noContent()
    } catch (error) {
      console.error('Error di destroy:', error)
      return response.internalServerError({
        message: 'Terjadi kesalahan pada server.',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  public async deleteMessage({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      const message = await Message.find(id)

      if (!message) {
        return response.notFound({ message: 'Pesan tidak ditemukan.' })
      }

      const conversation = await Conversation.findBy('sessionId', message.conversationId)

      if (conversation && conversation.lastMessageId === message.id) {
        const newLastMessage = await Message.query()
          .where('conversationId', message.conversationId)
          .where('id', '<', message.id)
          .orderBy('id', 'desc')
          .first()

        conversation.lastMessageId = newLastMessage ? newLastMessage.id : null
        await conversation.save()
      }

      await message.delete()
      return response.noContent()
    } catch (error) {
      console.error('Error di deleteMessage:', error)
      return response.internalServerError({
        message: 'Terjadi kesalahan pada server.',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
}

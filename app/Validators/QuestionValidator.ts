import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class QuestionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    question: schema.string({ trim: true }, [
      rules.minLength(1),
      rules.maxLength(500),
    ]),
    sessionId: schema.string.optional({ trim: true }, [
      rules.uuid(),
    ]),
  })

  public messages = {
    'question.required': 'Pertanyaan tidak boleh kosong.',
    'question.minLength': 'Pertanyaan terlalu pendek.',
    'question.maxLength': 'Pertanyaan terlalu panjang (maksimal 500 karakter).',
    'sessionId.uuid': 'ID sesi harus dalam format UUID yang valid.',
  }
}

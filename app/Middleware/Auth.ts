import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const authorizationHeader = request.header('Authorization')
    const expectedToken = 'Bearer mysecrettoken123'

    if (!authorizationHeader || authorizationHeader !== expectedToken) {
      return response.unauthorized({ message: 'Tidak terautentikasi atau token tidak valid.' })
    }

    await next()
  }
}

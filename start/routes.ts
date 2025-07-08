import Route from '@ioc:Adonis/Core/Route'

Route.post('/questions', 'ConversationsController.store')

Route.get('/conversation', 'ConversationsController.index').middleware('auth')

Route.get('/conversation/:id_or_uuid', 'ConversationsController.show').middleware('auth')

Route.delete('/conversation/:id_or_uuid', 'ConversationsController.destroy').middleware('auth')

Route.delete('/messages/:id', 'ConversationsController.deleteMessage').middleware('auth')


import Env from '@ioc:Adonis/Core/Env'
import { driveConfig } from '@adonisjs/core/build/config'
import Application from '@ioc:Adonis/Core/Application'


export default driveConfig({
 
  disk: Env.get('DRIVE_DISK'),

  disks: {
    
    local: {
      driver: 'local',
      visibility: 'public',

      root: Application.tmpPath('uploads'),

    
      serveFiles: true,

  
      basePath: '/uploads',
    },

  },
})

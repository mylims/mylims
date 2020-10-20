import Event from '@ioc:Adonis/Core/Event';

Event.on('mylims:restart', 'RestartListener.handleRestart');

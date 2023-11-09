import { httpRouter, httpServer } from './infrastructure/api/rest';
import { Utils } from '@sovi-tech/shared/src';

async function main() {
  try {
    Utils.ExecutionTime.start('API');

    process.stdout.write('\n\r');

    await Utils.Environment.instance.load();

    Utils.TerminalLogger.log('⚙️  Variáveis de ambiente carregadas com sucesso.');

    const env = Utils.Environment.instance.env;

    await httpRouter.load();

    await httpServer.listen(env?.API_PORT as number);

    Utils.TerminalLogger.log(`🚀 API rodando em http://${env?.API_HOST}:${env?.API_PORT}`);

    Utils.ExecutionTime.end('API', '⏱  Tempo de inicialização da API:');
  } catch (error) {
    Utils.TerminalLogger.log(
      '❌ Erro ao iniciar a API',
      {
        level: 'ERROR',
        scope: 'MAIN',
      },
      (error as Error)?.stack ?? '',
    );
  }
}

main();

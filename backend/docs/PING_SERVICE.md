# Serviço de Ping Automático

Este documento descreve o serviço de ping automático implementado para manter o servidor ativo no Render e evitar suspensão por inatividade.

## Visão Geral

O serviço de ping faz requisições periódicas para o próprio servidor a cada 10 minutos (configurável) para simular atividade e evitar que o Render suspenda o serviço por inatividade.

## Funcionamento

### Quando é Ativado
- **Produção**: Ativado automaticamente quando `NODE_ENV=production`
- **Desenvolvimento**: Desativado por padrão para evitar logs desnecessários
- **Configurável**: Pode ser desativado com `PING_ENABLED=false`

### Configuração

Variáveis de ambiente disponíveis:

```env
# Ativar/desativar o serviço
PING_ENABLED=true

# URL para fazer ping (padrão: http://localhost:PORT/health)
PING_URL=http://localhost:3001/health

# Intervalo entre pings em milissegundos (padrão: 600000 = 10 minutos)
PING_INTERVAL_MS=600000

# Timeout para cada requisição em milissegundos (padrão: 30000 = 30 segundos)
PING_TIMEOUT_MS=30000
```

### Logs

O serviço registra as seguintes informações:

- ✅ **Sucesso**: Status HTTP e tempo de resposta
- ⚠️ **Aviso**: Status HTTP diferente de 200
- ❌ **Erro**: Falhas de conexão, timeout ou outros erros

Exemplo de logs:
```
🚀 Starting ping service:
   URL: http://localhost:3001/health
   Interval: 10 minutes
   Timeout: 30 seconds
✅ Ping successful - 200 (45ms)
```

## Endpoint de Health Check

O endpoint `/health` foi atualizado para incluir informações do serviço de ping:

```json
{
  "status": "OK",
  "timestamp": "2025-10-09T16:37:13.516Z",
  "uptime": 9.2575539,
  "pingService": {
    "running": false,
    "config": {
      "url": "http://localhost:3001/health",
      "intervalMs": 600000,
      "timeoutMs": 30000,
      "enabled": false
    }
  }
}
```

## Testando o Serviço

### Teste Local
```bash
# Testar em modo desenvolvimento (serviço desativado)
npm run test:ping

# Testar em modo produção (serviço ativado)
NODE_ENV=production npm start
```

### Teste no Render
1. Faça deploy do código
2. Verifique os logs do Render
3. Procure por mensagens como "🚀 Starting ping service"
4. Monitore os logs para confirmar pings periódicos

## Arquivos Relacionados

- `src/services/pingService.ts` - Implementação do serviço
- `src/server.ts` - Integração com o servidor principal
- `scripts/test-ping-service.js` - Script de teste
- `env.example` - Variáveis de configuração

## Considerações Importantes

1. **Recursos**: O serviço consome recursos mínimos (uma requisição HTTP a cada 10 minutos)
2. **Logs**: Gera logs informativos para monitoramento
3. **Graceful Shutdown**: Para automaticamente quando o servidor é encerrado
4. **Timeout**: Configurável para evitar travamentos em caso de problemas de rede
5. **Identificação**: Usa header `X-Ping-Service: true` para identificar requisições do próprio serviço

## Troubleshooting

### Serviço não inicia
- Verifique se `NODE_ENV=production`
- Confirme se `PING_ENABLED` não está definido como `false`

### Pings falhando
- Verifique se a URL está correta
- Confirme se o servidor está respondendo no endpoint `/health`
- Ajuste o `PING_TIMEOUT_MS` se necessário

### Logs excessivos
- O serviço só gera logs em produção
- Para reduzir ainda mais, ajuste o intervalo de ping

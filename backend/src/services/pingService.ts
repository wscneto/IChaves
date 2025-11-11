import axios from 'axios';

interface PingConfig {
  url: string;
  intervalMs: number;
  timeoutMs: number;
  enabled: boolean;
}

class PingService {
  private intervalId: NodeJS.Timeout | null = null;
  private config: PingConfig;
  private isRunning: boolean = false;

  constructor() {
    this.config = {
      url: process.env.PING_URL || `http://localhost:${process.env.PORT || 3001}/health`,
      intervalMs: parseInt(process.env.PING_INTERVAL_MS || '600000'), // 10 minutos padrão
      timeoutMs: parseInt(process.env.PING_TIMEOUT_MS || '30000'), // 30 segundos timeout
      enabled: process.env.NODE_ENV === 'production' && process.env.PING_ENABLED !== 'false'
    };
  }

  /**
   * Inicia o serviço de ping automático
   */
  public start(): void {
    if (!this.config.enabled) {
      console.log('🔕 Ping service disabled');
      return;
    }

    if (this.isRunning) {
      console.log('⚠️ Ping service already running');
      return;
    }

    console.log(`🚀 Starting ping service:`);
    console.log(`   URL: ${this.config.url}`);
    console.log(`   Interval: ${this.config.intervalMs / 1000 / 60} minutes`);
    console.log(`   Timeout: ${this.config.timeoutMs / 1000} seconds`);

    // Primeiro ping imediato
    this.performPing();

    // Configurar ping periódico
    this.intervalId = setInterval(() => {
      this.performPing();
    }, this.config.intervalMs);

    this.isRunning = true;
  }

  /**
   * Para o serviço de ping
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🛑 Ping service stopped');
  }

  /**
   * Executa um ping para o servidor
   */
  private async performPing(): Promise<void> {
    try {
      const startTime = Date.now();
      
      const response = await axios.get(this.config.url, {
        timeout: this.config.timeoutMs,
        headers: {
          'User-Agent': 'IChaves-Backend-PingService/1.0.0',
          'X-Ping-Service': 'true'
        }
      });

      const duration = Date.now() - startTime;
      
      if (response.status === 200) {
        console.log(`✅ Ping successful - ${response.status} (${duration}ms)`);
      } else {
        console.log(`⚠️ Ping warning - ${response.status} (${duration}ms)`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          console.log('❌ Ping failed - Connection refused (server may be starting)');
        } else if (error.code === 'ETIMEDOUT') {
          console.log('❌ Ping failed - Timeout');
        } else {
          console.log(`❌ Ping failed - ${error.message}`);
        }
      } else {
        console.log(`❌ Ping failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * Retorna o status do serviço
   */
  public getStatus(): { running: boolean; config: PingConfig } {
    return {
      running: this.isRunning,
      config: this.config
    };
  }

  /**
   * Atualiza a configuração do ping
   */
  public updateConfig(newConfig: Partial<PingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Ping service configuration updated');
  }
}

// Instância singleton
const pingService = new PingService();

export default pingService;

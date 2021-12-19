import { getMetadataArgsStorage } from 'typeorm';

export const Config = () => ({
  nodeConfiguration: {
    environment: process.env.NODE_ENV || 'development',
    port: Number(process.env.NODE_PORT) || 3000,
  },
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'database',
    schema: process.env.DB_SCHEMA || 'public',
    synchronize: process.env.DB_SYNCHRONIZATION || false,
    retryAttempts: 10,
    retryDelay: 3000,
    keepConnectionAlive: false,
    entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  },
  cryptoCompareApiKey: process.env.CRYPTOCOMPARE_API_KEY,
  cryptoCompareUrl:
    process.env.CRYPTOCOMPARE_URL ||
    'https://min-api.cryptocompare.com/data/pricemulti?fsyms={fsyms}&tsyms={tsyms}',
  ratesRetrievalInterval:
    process.env.RATES_RETRIEVAL_INTERVAL || 'EVERY_MINUTE',
  baseCurrencyPairs: process.env.BASE_CURRENCY_PAIRS || 'BTC,ETH,LTC,DOGE',
  targetCurrencyPairs: process.env.TARGET_CURRENCY_PAIRS || 'USD,EUR',
});

export { Config as default };

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import config from '../config';
import logger from '../utils/logger';

let otelSDK: NodeSDK | null = null;

export const startTracing = async () => {
  if (config.isTest) {
    logger.debug('Tracing disabled in test environment');
    return;
  }

  if (!config.otel.endpoint) {
    logger.warn('OpenTelemetry endpoint not configured, tracing disabled');
    return;
  }

  try {
    const traceExporter = new OTLPTraceExporter({
      url: config.otel.endpoint,
    });

    otelSDK = new NodeSDK({
      serviceName: config.otel.serviceName,
      traceExporter,
      instrumentations: [getNodeAutoInstrumentations()],
    });

    await otelSDK.start();
    logger.info('OpenTelemetry tracing initialized');
  } catch (error) {
    logger.error('Failed to initialize OpenTelemetry tracing:', error);
  }
};

export const stopTracing = async () => {
  if (otelSDK) {
    try {
      await otelSDK.shutdown();
      logger.info('OpenTelemetry tracing stopped');
    } catch (error) {
      logger.error('Error stopping OpenTelemetry tracing:', error);
    }
  }
};

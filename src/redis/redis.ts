import { Redis } from '@upstash/redis';
const redis = new Redis({
  url: 'https://settled-ghost-32735.upstash.io',
  token: 'AX_fAAIncDJhYWI2YTM3NTBkOTk0YzcxODRkNTFmNmFjNjE2MDI2OHAyMzI3MzU',
});
export default redis;

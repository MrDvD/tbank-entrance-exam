import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
});

fastify.register(await import('@fastify/static'), {
  root: path.join(__dirname, 'dist'),
});

fastify.get('/', function(_, reply) {
  return reply.sendFile('index.html', 'dist/main');
});

fastify.get('/generate-pdf', async function(_, reply) {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle2',
  });
  const pdfBuffer = await page.pdf({
    printBackground: true,
  });
  await browser.close();

  reply.header('Content-Type', 'application/pdf');
  reply.header('Content-Disposition', 'attachment; filename="resume.pdf"');
  return pdfBuffer;
});

try {
  await fastify.listen({
    port: 3000,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import { getElementIdentifier } from './src/resources/js/editable.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function validateEnvironment() {
  if (process.env.APP_SECRET === undefined) {
    throw new Error("APP_SECRET environment variable is not set.");
  }
  console.log("Environment validation passed.");
}

validateEnvironment();

const fastify = Fastify({
  logger: true,
});

fastify.register(await import('fastify-cookie'), {
  secret: process.env.APP_SECRET,
  parseOptions: {},
})

fastify.register(await import('@fastify/static'), {
  root: path.join(__dirname, 'dist'),
});

fastify.get('/', function(_, reply) {
  return reply.sendFile('index.html', 'dist/main');
});

async function getCookies(request, browser) {
  const cookies = request.cookies ?? {};

  const cookieArray = Object.entries(cookies).map(([name, value]) => ({
    name,
    value,
    domain: 'localhost',
    path: '/',
  }));
  if (cookieArray.length > 0) {
    const context = browser.defaultBrowserContext();
    await context.setCookie(...cookieArray);
  }
}

fastify.get('/generate-pdf', async function(request, reply) {
  const puppeteer = (await import('puppeteer')).default;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await getCookies(request, browser);

  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle2',
  });

  await page.evaluate(() => {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll("h1, h2, h3, h4, p").forEach(element => {
        const key = getElementIdentifier(element);
        const match = document.cookie.match(new RegExp('(^| )' + encodeURIComponent(key) + '=([^;]+)'));
        if (match) {
          element.textContent = decodeURIComponent(match[2]);
        }
      });
    });
  });

  const pdfBuffer = await page.pdf({
    printBackground: true,
    format: 'A4',
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
const puppeteer = require('puppeteer');
const fs = require('fs');

async function debugWeb(url, outputPath) {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[ERROR] ${err.toString()}`));

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: outputPath });
    
    const dom = await page.evaluate(() => document.body.innerHTML.substring(0, 1000)); // Lấy 1000 ký tự đầu của HTML

    console.log(JSON.stringify({
      url: url,
      logs: logs,
      screenshot: outputPath,
      dom_snippet: dom
    }));
  } catch (e) {
    console.log(JSON.stringify({ error: e.message }));
  } finally {
    await browser.close();
  }
}

const url = process.argv[2] || 'http://localhost:3000';
const output = process.argv[3] || 'debug.png';
debugWeb(url, output);

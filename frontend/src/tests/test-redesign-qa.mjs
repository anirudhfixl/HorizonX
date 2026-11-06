import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:\\Users\\aniru\\.gemini\\antigravity\\brain\\04ad1883-e6d6-4865-be73-207d97769a72\\qa_screenshots';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:4173';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runRedesignQA() {
  console.log('======================================================');
  console.log('HORIZONX — REDESIGNED WALLET MODAL & REOWN APPKIT QA');
  console.log('======================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  try {
    // 1. Desktop Viewport (1440x900)
    console.log('Testing 1: Desktop Viewport (1440x900)...');
    const pageDesktop = await browser.newPage();
    await pageDesktop.setViewport({ width: 1440, height: 900 });
    await pageDesktop.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    // Click "Connect Wallet"
    await pageDesktop.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Connect Wallet'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Verify modal elements
    const desktopInfo = await pageDesktop.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return { found: false };

      const rect = modal.getBoundingClientRect();
      const hasHeader = !!modal.querySelector('h2');
      const headerText = modal.querySelector('h2')?.textContent;
      const svgs = modal.querySelectorAll('svg');
      const buttons = Array.from(modal.querySelectorAll('button')).map(b => b.textContent?.trim());
      const hasSepolia = !!Array.from(modal.querySelectorAll('*')).find(el => el.textContent?.includes('Sepolia'));
      const hasDevnet = !!Array.from(modal.querySelectorAll('*')).find(el => el.textContent?.includes('Devnet'));
      const hasTon = !!Array.from(modal.querySelectorAll('*')).find(el => el.textContent?.includes('TON Testnet'));
      const hasShasta = !!Array.from(modal.querySelectorAll('*')).find(el => el.textContent?.includes('TRON Shasta') || el.textContent?.includes('Shasta'));

      return {
        found: true,
        width: rect.width,
        height: rect.height,
        hasHeader,
        headerText,
        svgCount: svgs.length,
        buttons,
        hasSepolia,
        hasDevnet,
        hasTon,
        hasShasta
      };
    });

    console.log('Desktop Modal Inspection:', JSON.stringify(desktopInfo, null, 2));
    await pageDesktop.screenshot({ path: path.join(SCREENSHOT_DIR, '26_redesigned_modal_desktop.png') });
    console.log('Saved 26_redesigned_modal_desktop.png');

    // Test AppKit button if available in modal
    console.log('\nTesting 2: Reown AppKit trigger...');
    const appKitClicked = await pageDesktop.evaluate(() => {
      const appKitBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.textContent && (b.textContent.includes('AppKit') || b.textContent.includes('Reown'))
      );
      if (appKitBtn) {
        appKitBtn.click();
        return true;
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 1000));
    const appKitModalInfo = await pageDesktop.evaluate(() => {
      const w3mModal = document.querySelector('w3m-modal, appkit-modal, [id^="w3m"]');
      return {
        foundW3m: !!w3mModal,
        tagName: w3mModal?.tagName || null
      };
    });
    console.log('AppKit trigger result:', { appKitClicked, ...appKitModalInfo });
    await pageDesktop.screenshot({ path: path.join(SCREENSHOT_DIR, '29_reown_appkit_modal.png') });
    console.log('Saved 29_reown_appkit_modal.png');

    await pageDesktop.close();

    // 2. Tablet Viewport (768x1024)
    console.log('\nTesting 3: Tablet Viewport (768x1024)...');
    const pageTablet = await browser.newPage();
    await pageTablet.setViewport({ width: 768, height: 1024 });
    await pageTablet.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    await pageTablet.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Connect Wallet'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    await pageTablet.screenshot({ path: path.join(SCREENSHOT_DIR, '27_redesigned_modal_tablet.png') });
    console.log('Saved 27_redesigned_modal_tablet.png');
    await pageTablet.close();

    // 3. Mobile Viewport (390x844)
    console.log('\nTesting 4: Mobile Viewport (390x844)...');
    const pageMobile = await browser.newPage();
    await pageMobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await pageMobile.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    // On mobile, find Connect Wallet button (either directly or via mobile nav)
    await pageMobile.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Connect Wallet'));
      if (btn) {
        btn.click();
        return;
      }
      // If menu button exists
      const menuBtn = document.querySelector('button[aria-label*="menu" i], button svg.lucide-menu');
      if (menuBtn) (menuBtn.closest('button') || menuBtn).click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Try again in case it was in mobile drawer
    await pageMobile.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (!modal) {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Connect Wallet'));
        if (btn) btn.click();
      }
    });
    await new Promise(r => setTimeout(r, 600));

    await pageMobile.screenshot({ path: path.join(SCREENSHOT_DIR, '28_redesigned_modal_mobile.png') });
    console.log('Saved 28_redesigned_modal_mobile.png');
    await pageMobile.close();

    // 4. Check Account Wallets and Connections with SVG Logos
    console.log('\nTesting 5: Account Wallets and Connections Pages...');
    const pageAccount = await browser.newPage();
    await pageAccount.setViewport({ width: 1440, height: 900 });
    await pageAccount.goto(`${BASE_URL}/account/wallets`, { waitUntil: 'networkidle0' });
    await pageAccount.screenshot({ path: path.join(SCREENSHOT_DIR, '30_account_wallets_svg_logos.png') });
    console.log('Saved 30_account_wallets_svg_logos.png');

    await pageAccount.goto(`${BASE_URL}/account/connections`, { waitUntil: 'networkidle0' });
    await pageAccount.screenshot({ path: path.join(SCREENSHOT_DIR, '31_account_connections_svg_logos.png') });
    console.log('Saved 31_account_connections_svg_logos.png');
    await pageAccount.close();

    console.log('\nAll redesign QA tests executed successfully!');
  } catch (err) {
    console.error('QA Runner error:', err);
  } finally {
    await browser.close();
  }
}

runRedesignQA();


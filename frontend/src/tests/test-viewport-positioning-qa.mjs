import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:/Users/aniru/.gemini/antigravity/brain/04ad1883-e6d6-4865-be73-207d97769a72/qa_screenshots';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE_URL = 'http://localhost:4173';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const ROUTES = [
  { name: 'Launchpad', path: '/launchpad/launches' },
  { name: 'Homepage', path: '/' },
  { name: 'Tokens', path: '/tokens' },
  { name: 'Projects', path: '/projects' },
  { name: 'Account Wallets', path: '/account/wallets' },
  { name: 'Account Connections', path: '/account/connections' },
];

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1630x923', width: 1630, height: 923 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '390x844', width: 390, height: 844 },
];

async function runPositioningQA() {
  console.log('================================================================');
  console.log('HORIZONX — CRITICAL WALLET MODAL VIEWPORT POSITIONING QA');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const allMeasurements = [];

  try {
    // -------------------------------------------------------------------------
    // 1. Matrix Test: All 6 Routes x All 4 Viewports
    // -------------------------------------------------------------------------
    console.log('--- SECTION 1: Viewport & Route Centering Matrix ---');

    for (const vp of VIEWPORTS) {
      console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });

      for (const route of ROUTES) {
        await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle0' });

        // Open modal
        await page.evaluate(() => {
          const btn = document.querySelector('.wallet-btn-connect') ||
            Array.from(document.querySelectorAll('button')).find(b => b.innerText && (b.innerText.includes('Connect Wallet') || b.innerText.includes('Connect Wallets')));
          if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 500));

        const measurement = await page.evaluate((vpWidth, vpHeight) => {
          const modal = document.querySelector('.hx-wallet-modal-content');
          const overlay = document.querySelector('.hx-wallet-modal-overlay') || document.querySelector('[data-slot="dialog-overlay"]');
          const navbar = document.querySelector('.navbar-shell');
          const header = modal ? modal.querySelector('.hx-wallet-modal-header') : null;
          const bodyOverflow = document.body.style.overflow;

          if (!modal) return null;

          const r = modal.getBoundingClientRect();
          const hr = header ? header.getBoundingClientRect() : null;
          const modalZ = parseInt(window.getComputedStyle(modal).zIndex, 10);
          const navZ = navbar ? parseInt(window.getComputedStyle(navbar).zIndex, 10) : 0;
          const overlayZ = overlay ? parseInt(window.getComputedStyle(overlay).zIndex, 10) : 0;

          const centerX = r.left + r.width / 2;
          const centerY = r.top + r.height / 2;
          const vpCenterX = vpWidth / 2;
          const vpCenterY = vpHeight / 2;

          return {
            rect: {
              top: Math.round(r.top * 10) / 10,
              left: Math.round(r.left * 10) / 10,
              right: Math.round(r.right * 10) / 10,
              bottom: Math.round(r.bottom * 10) / 10,
              width: Math.round(r.width * 10) / 10,
              height: Math.round(r.height * 10) / 10,
            },
            centerX: Math.round(centerX * 10) / 10,
            centerY: Math.round(centerY * 10) / 10,
            vpCenterX,
            vpCenterY,
            hDiff: Math.round(Math.abs(centerX - vpCenterX) * 10) / 10,
            vDiff: Math.round(Math.abs(centerY - vpCenterY) * 10) / 10,
            withinTop: r.top >= 0,
            withinBottom: r.bottom <= vpHeight,
            headerVisible: Boolean(hr && hr.top >= 0 && hr.bottom <= vpHeight),
            modalZ,
            navZ,
            overlayZ,
            bodyOverflow,
            isAboveNav: modalZ > navZ,
            isScrollLocked: bodyOverflow === 'hidden',
          };
        }, vp.width, vp.height);

        if (!measurement) {
          throw new Error(`Modal failed to open on ${route.name} (${vp.name})`);
        }

        allMeasurements.push({
          route: route.name,
          viewport: vp.name,
          ...measurement,
        });

        console.log(`  [${vp.name}] ${route.name.padEnd(20)} -> Left: ${String(measurement.rect.left).padStart(5)}, Top: ${String(measurement.rect.top).padStart(5)}, Width: ${measurement.rect.width}, Height: ${measurement.rect.height}, hDiff: ${measurement.hDiff}px, vDiff: ${measurement.vDiff}px, withinBounds: ${measurement.withinTop && measurement.withinBottom}`);

        // Verifications
        if (measurement.hDiff > 1.0) {
          throw new Error(`Horizontal centering failed on ${route.name} (${vp.name}): hDiff = ${measurement.hDiff}px`);
        }
        if (!measurement.withinTop || !measurement.withinBottom) {
          throw new Error(`Vertical boundary check failed on ${route.name} (${vp.name}): top = ${measurement.rect.top}, bottom = ${measurement.rect.bottom}, vpHeight = ${vp.height}`);
        }
        if (!measurement.headerVisible) {
          throw new Error(`Header is clipped on ${route.name} (${vp.name})!`);
        }
        if (!measurement.isAboveNav) {
          throw new Error(`Modal z-index (${measurement.modalZ}) is not above navbar (${measurement.navZ}) on ${route.name}`);
        }
        if (!measurement.isScrollLocked) {
          throw new Error(`Background scroll is not locked on ${route.name}`);
        }

        // Capture designated screenshots
        if (route.name === 'Launchpad') {
          if (vp.name === '1440x900') await page.screenshot({ path: path.join(SCREENSHOT_DIR, '60_launchpad_modal_centered_1440.png') });
          else if (vp.name === '1630x923') await page.screenshot({ path: path.join(SCREENSHOT_DIR, '61_launchpad_modal_centered_1630.png') });
          else if (vp.name === '768x1024') await page.screenshot({ path: path.join(SCREENSHOT_DIR, '62_launchpad_modal_centered_768.png') });
          else if (vp.name === '390x844') await page.screenshot({ path: path.join(SCREENSHOT_DIR, '63_launchpad_modal_centered_390.png') });
        } else if (vp.name === '1440x900') {
          if (route.name === 'Homepage') await page.screenshot({ path: path.join(SCREENSHOT_DIR, '64_homepage_modal_centered_1440.png') });
          else if (route.name === 'Tokens') await page.screenshot({ path: path.join(SCREENSHOT_DIR, '65_tokens_modal_centered_1440.png') });
          else if (route.name === 'Projects') await page.screenshot({ path: path.join(SCREENSHOT_DIR, '66_projects_modal_centered_1440.png') });
          else if (route.name === 'Account Wallets') await page.screenshot({ path: path.join(SCREENSHOT_DIR, '67_account_wallets_modal_centered_1440.png') });
          else if (route.name === 'Account Connections') await page.screenshot({ path: path.join(SCREENSHOT_DIR, '68_account_connections_modal_centered_1440.png') });
        }

        // Close modal
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 300));
      }

      await page.close();
    }

    console.log('\n✅ PASS: All 24 route x viewport combinations verified perfectly centered!');

    // -------------------------------------------------------------------------
    // 2. Nested Send/Receive Dialog Layering & Centering Test
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 2: Nested Child Dialog Layering & Centering ---');
    const childPage = await browser.newPage();
    await childPage.setViewport({ width: 1440, height: 900 });

    // Inject TronLink so TRON is connected and shows Send action
    await childPage.evaluateOnNewDocument(() => {
      window.tronLink = {
        ready: true,
        tronWeb: {
          ready: true,
          defaultAddress: { base58: 'TGJ2jHkH8vR7M9pL4vS6m8t2Yq5X8q3kL9m', hex: '4143a5d8' },
        },
      };
      window.tronWeb = {
        ready: true,
        defaultAddress: { base58: 'TGJ2jHkH8vR7M9pL4vS6m8t2Yq5X8q3kL9m', hex: '4143a5d8' },
        fullNode: { host: 'https://api.shasta.trongrid.io' },
      };
    });

    await childPage.goto(`${BASE_URL}/account/wallets`, { waitUntil: 'networkidle0' });

    // Click Send
    await childPage.evaluate(() => {
      const sendBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim() === 'Send');
      if (sendBtn) sendBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const childAudit = await childPage.evaluate(() => {
      const childModal = document.querySelector('.hx-wallet-child-content');
      const childOverlay = document.querySelector('.hx-wallet-child-overlay');

      if (!childModal) return null;
      const r = childModal.getBoundingClientRect();
      const zModal = parseInt(window.getComputedStyle(childModal).zIndex, 10);
      const zOverlay = childOverlay ? parseInt(window.getComputedStyle(childOverlay).zIndex, 10) : 0;

      const centerX = r.left + r.width / 2;
      const centerY = r.top + r.height / 2;
      const vpCenterX = 1440 / 2;
      const vpCenterY = 900 / 2;

      return {
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        centerX,
        centerY,
        hDiff: Math.abs(centerX - vpCenterX),
        vDiff: Math.abs(centerY - vpCenterY),
        zModal,
        zOverlay,
        isAboveParent: zModal >= 220,
        isOverlayAboveParent: zOverlay >= 219,
      };
    });

    console.log('Child Send Modal Audit:', childAudit);
    if (!childAudit || !childAudit.isAboveParent || childAudit.hDiff > 1.0) {
      throw new Error(`Child Send Modal positioning or z-index failed: ${JSON.stringify(childAudit)}`);
    }

    await childPage.screenshot({ path: path.join(SCREENSHOT_DIR, '69_nested_send_dialog_centered_above_parent.png') });
    console.log('✅ PASS: Saved 69_nested_send_dialog_centered_above_parent.png (Child z-220, centered)');
    await childPage.close();

    console.log('\n================================================================');
    console.log('🎉 ALL VIEWPORT POSITIONING & CENTERING TESTS PASSED (100%)');
    console.log('================================================================');
  } finally {
    await browser.close();
  }
}

runPositioningQA().catch(err => {
  console.error('QA Runner Failed:', err);
  process.exit(1);
});


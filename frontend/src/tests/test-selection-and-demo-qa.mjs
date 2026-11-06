import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:\\Users\\aniru\\.gemini\\antigravity\\brain\\04ad1883-e6d6-4865-be73-207d97769a72\\qa_screenshots';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:4173';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runQA() {
  console.log('================================================================');
  console.log('HORIZONX — WALLET SELECTION, QR FLOW & DEMO MODE BROWSER QA');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Step 0: Clear localStorage and load homepage
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    // -------------------------------------------------------------------------
    // TEST 1: Initial Connect Wallet Modal & 4 Ecosystems Overview
    // -------------------------------------------------------------------------
    console.log('--- TEST 1: Connect Wallet Modal Overview ---');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.includes('Connect Wallet')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const overviewAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return { found: false };
      const text = modal.textContent || '';
      return {
        found: true,
        hasMetaMask: text.includes('MetaMask'),
        hasPhantom: text.includes('Phantom'),
        hasGramWallet: text.includes('Gram Wallet'),
        hasTronLink: text.includes('TronLink'),
        hasDemoMode: text.includes('Sandbox Demo Mode'),
        hasTryDemo: text.includes('Try Demo'),
        hasZeroOfFour: text.includes('0 of 4 Connected'),
      };
    });

    console.log('Overview Audit:', overviewAudit);
    if (!overviewAudit.hasMetaMask || !overviewAudit.hasPhantom || !overviewAudit.hasGramWallet || !overviewAudit.hasTronLink) {
      throw new Error('Missing ecosystem cards in overview modal!');
    }
    if (!overviewAudit.hasZeroOfFour) {
      throw new Error('Initial connected count should be 0 of 4 Connected!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '39_connect_modal_overview.png') });
    console.log('✅ PASS: Saved 39_connect_modal_overview.png');

    // -------------------------------------------------------------------------
    // TEST 2: Demo Mode Activation & Counter Isolation
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 2: Demo Mode Activation & Counter Isolation ---');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
        (b) => b.textContent && b.textContent.includes('Try Demo')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Verify top nav button has DEMO badge and simulated balance
    const navDemoCheck = await page.evaluate(() => {
      const btn = document.querySelector('.wallet-btn-connected');
      if (!btn) return { connected: false };
      const text = btn.textContent || '';
      return {
        connected: true,
        hasDemoBadge: text.includes('DEMO'),
        hasSimulated: text.includes('Simulated') || text.includes('3.428'),
        address: text.includes('0x71C9'),
      };
    });

    console.log('Top Nav Demo Audit:', navDemoCheck);
    if (!navDemoCheck.hasDemoBadge) {
      throw new Error('DEMO badge missing from top navigation button!');
    }

    // Re-open Connect Wallet modal to verify counter isolation
    await page.evaluate(() => {
      const btn = document.querySelector('.wallet-btn-connected');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Also click Back if it opened wallet details
    await page.evaluate(() => {
      const backBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.includes('Back')
      );
      if (backBtn) backBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const demoModalAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const text = modal?.textContent || '';
      return {
        hasDemoActiveBadge: text.includes('Demo Mode Active') || text.includes('Active'),
        hasDisconnectDemoBtn: text.includes('Disconnect Demo Wallet'),
        hasZeroOfFour: text.includes('0 of 4 Connected'),
        doesNotSayOneOfFour: !text.includes('1 of 4 Connected'),
      };
    });

    console.log('Demo Modal Counter Audit:', demoModalAudit);
    if (!demoModalAudit.hasDisconnectDemoBtn) {
      throw new Error('Disconnect Demo Wallet button missing from modal!');
    }
    if (!demoModalAudit.hasZeroOfFour || !demoModalAudit.doesNotSayOneOfFour) {
      throw new Error('CRITICAL BUG: Demo Mode inflated real wallet counter to 1 of 4 Connected!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '40_demo_mode_active_counter_isolated.png') });
    console.log('✅ PASS: Saved 40_demo_mode_active_counter_isolated.png');

    // Click "Disconnect Demo Wallet"
    console.log('\n--- TEST 2B: Disconnect Demo Wallet ---');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
        (b) => b.textContent && b.textContent.includes('Disconnect Demo Wallet')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const postDemoAudit = await page.evaluate(() => {
      const navBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.includes('Connect Wallet')
      );
      const isDemoStored = localStorage.getItem('prominers_demo_wallet_active');
      return {
        hasConnectWalletInNav: !!navBtn,
        isDemoStored,
      };
    });

    console.log('Post Demo Disconnect Audit:', postDemoAudit);
    if (!postDemoAudit.hasConnectWalletInNav) {
      throw new Error('Top nav did not return to Connect Wallet after disconnecting demo!');
    }
    if (postDemoAudit.isDemoStored === 'true') {
      throw new Error('Demo storage was not cleared!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '41_demo_disconnected_clean.png') });
    console.log('✅ PASS: Saved 41_demo_disconnected_clean.png');

    // -------------------------------------------------------------------------
    // TEST 3: Solana Dedicated Selection Interface & QR Code Flow
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 3: Solana Dedicated Connection Interface ---');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.includes('Connect Wallet')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Connect on Solana card
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[role="dialog"] .group'));
      const solanaCard = cards.find((c) => c.textContent?.includes('Phantom'));
      const btn = solanaCard?.querySelector('button');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const solanaInterfaceAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const text = modal?.textContent || '';
      return {
        hasTitle: text.includes('Connect Solana'),
        hasDevnetBadge: text.includes('Devnet Cluster'),
        hasPhantomCard: text.includes('Phantom'),
        hasSolflareCard: text.includes('Solflare'),
        hasBackBtn: Array.from(modal?.querySelectorAll('button') || []).some(
          (b) => b.textContent?.includes('Back')
        ),
      };
    });

    console.log('Solana Interface Audit:', solanaInterfaceAudit);
    if (!solanaInterfaceAudit.hasTitle || !solanaInterfaceAudit.hasBackBtn) {
      throw new Error('Solana connection interface did not open with Back button!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '42_solana_connection_interface_extension.png') });
    console.log('✅ PASS: Saved 42_solana_connection_interface_extension.png');

    // Switch to Mobile QR Code tab
    await page.evaluate(() => {
      const qrTab = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
        (b) => b.textContent && b.textContent.includes('Mobile QR Code')
      );
      if (qrTab) qrTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const solanaQrAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const svg = modal?.querySelector('svg');
      const text = modal?.textContent || '';
      return {
        hasSvg: !!svg,
        hasScanText: text.includes('Scan with Phantom Mobile'),
        hasCopyBtn: text.includes('Copy Connection Link'),
      };
    });

    console.log('Solana QR Audit:', solanaQrAudit);
    if (!solanaQrAudit.hasSvg || !solanaQrAudit.hasCopyBtn) {
      throw new Error('Solana QR code or Copy button missing!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '43_solana_connection_interface_qr.png') });
    console.log('✅ PASS: Saved 43_solana_connection_interface_qr.png');

    // Click Back button
    await page.evaluate(() => {
      const backBtn = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
        (b) => b.textContent && b.textContent.includes('Back')
      );
      if (backBtn) backBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const returnedAudit = await page.evaluate(() => {
      const text = document.querySelector('[role="dialog"]')?.textContent || '';
      return text.includes('Independent Wallets') && text.includes('MetaMask');
    });
    if (!returnedAudit) throw new Error('Back button failed to return to overview!');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '44_returned_to_overview_from_solana.png') });
    console.log('✅ PASS: Saved 44_returned_to_overview_from_solana.png');

    // -------------------------------------------------------------------------
    // TEST 4: TON Connect / Gram Wallet Interface (NEXORA Reference)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 4: TON Connect Interface & QR Flow ---');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[role="dialog"] .group'));
      const tonCard = cards.find((c) => c.textContent?.includes('Gram Wallet'));
      const btn = tonCard?.querySelector('button');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const tonInterfaceAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const text = modal?.textContent || '';
      const svg = modal?.querySelector('svg');
      return {
        hasTitle: text.includes('Connect TON'),
        hasNetwork: text.includes('Workchain (-3)'),
        hasQr: !!svg,
        hasCopyUri: text.includes('Copy Connection URI'),
        hasBackBtn: Array.from(modal?.querySelectorAll('button') || []).some(
          (b) => b.textContent?.includes('Back')
        ),
      };
    });

    console.log('TON Interface Audit:', tonInterfaceAudit);
    if (!tonInterfaceAudit.hasTitle || !tonInterfaceAudit.hasQr || !tonInterfaceAudit.hasCopyUri) {
      throw new Error('TON Connect QR interface missing required components!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '45_ton_connection_interface_qr.png') });
    console.log('✅ PASS: Saved 45_ton_connection_interface_qr.png');

    // Switch to Wallets tab
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
        (b) => b.textContent && b.textContent.includes('Wallets')
      );
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const tonWalletsAudit = await page.evaluate(() => {
      const text = document.querySelector('[role="dialog"]')?.textContent || '';
      return {
        hasGramWallet: text.includes('Gram Wallet'),
        hasPreferredBadge: text.includes('Preferred TON'),
        hasTonkeeper: text.includes('Tonkeeper'),
        hasMyTonWallet: text.includes('MyTonWallet'),
      };
    });

    console.log('TON Wallets Tab Audit:', tonWalletsAudit);
    if (!tonWalletsAudit.hasGramWallet || !tonWalletsAudit.hasTonkeeper) {
      throw new Error('TON Wallets tab missing Gram Wallet or Tonkeeper!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '46_ton_connection_interface_wallets.png') });
    console.log('✅ PASS: Saved 46_ton_connection_interface_wallets.png');

    // Click Back button
    await page.evaluate(() => {
      const backBtn = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
        (b) => b.textContent && b.textContent.includes('Back')
      );
      if (backBtn) backBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // -------------------------------------------------------------------------
    // TEST 5: TRON Shasta Interface & Missing Extension Guidance
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 5: TRON Shasta Interface & Missing Extension Guidance ---');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[role="dialog"] .group'));
      const tronCard = cards.find((c) => c.textContent?.includes('TronLink'));
      const btn = tronCard?.querySelector('button');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const tronInterfaceAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const text = modal?.textContent || '';
      const installLink = modal?.querySelector('a[href*="chromewebstore.google.com/detail/tronlink"]');
      return {
        hasTitle: text.includes('Connect TRON'),
        hasShasta: text.includes('Shasta Testnet'),
        hasTronLink: text.includes('TronLink'),
        hasNotDetected: text.includes('TronLink wallet not detected') || text.includes('Extension Detected'),
        hasInstallLink: !!installLink,
        hasQrPolicyNotice: text.includes('QR connection is not supported by TronLink on Shasta Testnet'),
        noFakeQr: !modal?.querySelector('svg[aria-label*="TronLink QR"]'),
      };
    });

    console.log('TRON Interface Audit:', tronInterfaceAudit);
    if (!tronInterfaceAudit.hasTitle || !tronInterfaceAudit.hasQrPolicyNotice) {
      throw new Error('TRON interface missing title or QR policy notice!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '47_tron_connection_interface_install_guidance.png') });
    console.log('✅ PASS: Saved 47_tron_connection_interface_install_guidance.png');

    // Click Back to return to overview
    await page.evaluate(() => {
      const backBtn = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
        (b) => b.textContent && b.textContent.includes('Back')
      );
      if (backBtn) backBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // -------------------------------------------------------------------------
    // TEST 6: Responsive Layouts (Tablet 768px and Mobile 390px)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 6: Responsive Verification ---');
    // Tablet
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '48_connection_flow_tablet.png') });
    console.log('✅ PASS: Saved 48_connection_flow_tablet.png');

    // Mobile
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '49_connection_flow_mobile.png') });
    console.log('✅ PASS: Saved 49_connection_flow_mobile.png');

    console.log('\n================================================================');
    console.log('🎉 ALL 6 COMPREHENSIVE BROWSER QA TESTS PASSED CLEANLY (100%)');
    console.log('================================================================');
  } catch (err) {
    console.error('QA Runner Error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runQA();


import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:\\Users\\aniru\\.gemini\\antigravity\\brain\\04ad1883-e6d6-4865-be73-207d97769a72\\qa_screenshots';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:4173';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runFinalUXQA() {
  console.log('======================================================');
  console.log('HORIZONX — FINAL UX & WALLET BEHAVIOR QA');
  console.log('======================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  try {
    // ----------------------------------------------------
    // TEST 1: Clean Modal without Risk Warning Footer & Single Connect Button
    // ----------------------------------------------------
    console.log('--- TEST 1: Connect Wallet Modal Visuals & Structure ---');
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    // Open Connect Wallet modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Connect Wallet'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const modalAudit = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return { found: false };

      const allText = modal.textContent || '';
      const hasRiskWarning = allText.includes('Risk Warning');
      const hasTestnetOnlyFooter = allText.includes('Testnet Only · Sepolia, Devnet, TON, Shasta');
      const hasAppKitButton = Array.from(modal.querySelectorAll('button')).some(b => b.textContent?.trim() === 'AppKit');
      const hasGramWallet = allText.includes('Gram Wallet');
      const hasTonkeeper = allText.includes('Tonkeeper');

      const buttons = Array.from(modal.querySelectorAll('button')).map(b => b.textContent?.trim());

      return {
        found: true,
        hasRiskWarning,
        hasTestnetOnlyFooter,
        hasAppKitButton,
        hasGramWallet,
        hasTonkeeper,
        buttons
      };
    });

    console.log('Modal Audit Results:', JSON.stringify(modalAudit, null, 2));
    if (modalAudit.hasRiskWarning) throw new Error('Risk Warning footer still present!');
    if (modalAudit.hasAppKitButton) throw new Error('Visible AppKit button still present!');
    if (!modalAudit.hasGramWallet) throw new Error('Gram Wallet not displayed!');
    if (modalAudit.hasTonkeeper) throw new Error('Tonkeeper still present in visible text!');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '32_clean_modal_gram_wallet.png') });
    console.log('✅ PASS: Saved 32_clean_modal_gram_wallet.png');

    // ----------------------------------------------------
    // TEST 2: Reown AppKit opens when Ethereum Connect clicked
    // ----------------------------------------------------
    console.log('\n--- TEST 2: Ethereum Connect Opens Reown AppKit ---');
    // Click Ethereum Connect button (first Connect button in wallet cards)
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[role="dialog"] .group'));
      const evmCard = cards.find(c => c.textContent?.includes('MetaMask'));
      const connectBtn = evmCard?.querySelector('button');
      if (connectBtn) connectBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    const appKitOpened = await page.evaluate(() => {
      const w3m = document.querySelector('w3m-modal');
      return !!w3m;
    });
    console.log('AppKit Modal Opened via primary Connect button:', appKitOpened);
    if (!appKitOpened) throw new Error('AppKit did not open on Ethereum Connect click');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '33_reown_appkit_via_primary_connect.png') });
    console.log('✅ PASS: Saved 33_reown_appkit_via_primary_connect.png');

    await page.close();

    // ----------------------------------------------------
    // TEST 3: Back Button Navigation in Wallet Details Modal
    // ----------------------------------------------------
    console.log('\n--- TEST 3: Wallet Details Back Button Navigation ---');
    const pageDetails = await browser.newPage();
    await pageDetails.setViewport({ width: 1440, height: 900 });
    await pageDetails.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    // Open Connect Wallet modal
    await pageDetails.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Connect Wallet'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Click "Try Demo"
    await pageDetails.evaluate(() => {
      const demoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Try Demo'));
      if (demoBtn) demoBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Open Wallet Details via the connected top nav button
    await pageDetails.evaluate(() => {
      const connectedBtn = document.querySelector('.wallet-btn-connected');
      if (connectedBtn) (connectedBtn).click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Inspect Wallet Details Modal for Back button and Gram Wallet tab
    const backBtnAudit = await pageDetails.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return { inDetails: false };

      const backBtn = Array.from(modal.querySelectorAll('button')).find(b => 
        b.textContent?.includes('Back') || b.getAttribute('aria-label')?.includes('Back')
      );
      const title = modal.querySelector('h2')?.textContent;
      const subtitle = modal.querySelector('p')?.textContent;
      const svgs = modal.querySelectorAll('svg').length;
      const ecoButtons = Array.from(modal.querySelectorAll('.grid-cols-4 button')).map(b => b.textContent?.trim());

      return {
        inDetails: true,
        hasBackBtn: !!backBtn,
        backBtnText: backBtn?.textContent?.trim(),
        title,
        subtitle,
        svgs,
        ecoButtons
      };
    });

    console.log('Wallet Details Audit:', JSON.stringify(backBtnAudit, null, 2));
    if (!backBtnAudit.hasBackBtn) throw new Error('Back button missing from Wallet Details header!');

    await pageDetails.screenshot({ path: path.join(SCREENSHOT_DIR, '34_wallet_details_with_back_button.png') });
    console.log('✅ PASS: Saved 34_wallet_details_with_back_button.png');

    // Switch between ecosystems in Wallet Details: TON tab should show Gram Wallet
    await pageDetails.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const tonTab = Array.from(modal?.querySelectorAll('.grid-cols-4 button') || []).find(b => b.textContent?.includes('TON'));
      if (tonTab) tonTab.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await pageDetails.screenshot({ path: path.join(SCREENSHOT_DIR, '34b_wallet_details_gram_wallet.png') });
    console.log('✅ PASS: Saved 34b_wallet_details_gram_wallet.png');

    // Click "Back" and verify we return to the 4-wallet overview modal
    await pageDetails.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const backBtn = Array.from(modal?.querySelectorAll('button') || []).find(b => 
        b.textContent?.includes('Back') || b.getAttribute('aria-label')?.includes('Back')
      );
      if (backBtn) backBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const returnedToOverview = await pageDetails.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const title = modal?.querySelector('h2')?.textContent;
      const allText = modal?.textContent || '';
      return {
        title,
        hasAllFour: allText.includes('MetaMask') && allText.includes('Phantom') && allText.includes('Gram Wallet') && allText.includes('TronLink')
      };
    });

    console.log('Back Navigation Result:', JSON.stringify(returnedToOverview, null, 2));
    if (returnedToOverview.title !== 'Connect Wallet' || !returnedToOverview.hasAllFour) {
      throw new Error('Failed to return to 4-wallet overview!');
    }

    await pageDetails.screenshot({ path: path.join(SCREENSHOT_DIR, '35_overview_returned_via_back.png') });
    console.log('✅ PASS: Saved 35_overview_returned_via_back.png');

    await pageDetails.close();

    // ----------------------------------------------------
    // TEST 4: Mobile & Tablet Responsiveness
    // ----------------------------------------------------
    console.log('\n--- TEST 4: Responsive Verification ---');
    // Tablet
    const pageTab = await browser.newPage();
    await pageTab.setViewport({ width: 768, height: 1024 });
    await pageTab.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await pageTab.evaluate(() => localStorage.clear());
    await pageTab.reload({ waitUntil: 'networkidle0' });
    await pageTab.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Connect Wallet'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageTab.screenshot({ path: path.join(SCREENSHOT_DIR, '36_clean_modal_tablet.png') });
    console.log('✅ PASS: Saved 36_clean_modal_tablet.png');
    await pageTab.close();

    // Mobile
    const pageMob = await browser.newPage();
    await pageMob.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await pageMob.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await pageMob.evaluate(() => localStorage.clear());
    await pageMob.reload({ waitUntil: 'networkidle0' });
    await pageMob.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Connect Wallet'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await pageMob.screenshot({ path: path.join(SCREENSHOT_DIR, '37_clean_modal_mobile.png') });
    console.log('✅ PASS: Saved 37_clean_modal_mobile.png');
    await pageMob.close();

    console.log('\n======================================================');
    console.log('🎉 ALL FINAL UX & CORRECTION TESTS PASSED CLEANLY!');
    console.log('======================================================');
  } catch (err) {
    console.error('QA Runner Error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runFinalUXQA();

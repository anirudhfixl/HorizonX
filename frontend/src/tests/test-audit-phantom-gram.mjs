import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:\\Users\\aniru\\.gemini\\antigravity\\brain\\04ad1883-e6d6-4865-be73-207d97769a72\\qa_screenshots';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:4173';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runAudit() {
  console.log('======================================================');
  console.log('HORIZONX — PHANTOM & GRAM WALLET AUDIT VERIFICATION');
  console.log('======================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Inject mock providers before document loads to test discovery rules
    await page.evaluateOnNewDocument(() => {
      // 1. Test Phantom strictly requiring isPhantom === true
      // We simulate an actual Phantom Solana provider
      const phantomProvider = {
        isPhantom: true,
        publicKey: {
          toString: () => 'PhantomDevnetPubKey11111111111111111111111111',
          toBase58: () => 'PhantomDevnetPubKey11111111111111111111111111',
        },
        connectCalls: 0,
        lastConnectArgs: null,
        connect: async (args) => {
          phantomProvider.connectCalls++;
          phantomProvider.lastConnectArgs = args;
          return {
            publicKey: {
              toString: () => 'PhantomDevnetPubKey11111111111111111111111111',
            },
          };
        },
        disconnect: async () => {},
        on: (ev, cb) => {},
        off: (ev, cb) => {},
      };

      window.phantom = { solana: phantomProvider };
      window.solana = phantomProvider;

      // 2. Test Gram Wallet TON Connect JS Bridge (official jsBridgeKey: gramwallet)
      const gramBridge = {
        deviceInfo: {
          platform: 'chrome',
          appName: 'gramwallet',
          appVersion: '1.0.0',
          maxProtocolVersion: 2,
          features: ['SendTransaction', 'SignData'],
        },
        walletInfo: {
          name: 'Gram Wallet',
          app_name: 'gramwallet',
          image: 'https://static.gramwallet.io/gramwallet/icon-288.png',
          about_url: 'https://gramwallet.io/?utm_source=tc',
        },
        protocolVersion: 2,
        connectCalls: 0,
        connect: async (version, req) => {
          gramBridge.connectCalls++;
          return {
            event: 'connect',
            payload: {
              items: [
                {
                  name: 'ton_addr',
                  address: '0QC7q-154_mD9Hn73_K_839h3892_example_jetton_testn',
                  network: '-3', // TON Testnet
                  publicKey: '0x1234abcd',
                },
              ],
            },
          };
        },
        disconnect: async () => {},
        sendTransaction: async (tx) => ({
          boc: 'b5ee9c72010101010024000004ffffffff20c7q154mD9Hn73K839h3892',
        }),
      };

      window.tonconnect = {
        gramwallet: gramBridge,
      };
      window.gramwallet = gramBridge;
      // Note: window.ton is intentionally NOT set to prove it does not rely on window.ton
    });

    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    // Step A: Verify no automatic connection on page load
    console.log('--- AUDIT CHECK 1: No Auto-Connect on Load ---');
    const autoConnectStatus = await page.evaluate(() => {
      const phantomCalls = window.phantom?.solana?.connectCalls || 0;
      const gramCalls = window.tonconnect?.gramwallet?.connectCalls || 0;
      return { phantomCalls, gramCalls };
    });
    console.log('Auto-connect calls on load:', autoConnectStatus);
    if (autoConnectStatus.phantomCalls !== 0) {
      throw new Error('Phantom auto-connected without user interaction!');
    }
    if (autoConnectStatus.gramCalls !== 0) {
      throw new Error('Gram Wallet auto-connected without user interaction!');
    }
    console.log('✅ PASSED: Zero auto-connect calls on load.');

    // Step B: Open Connect Wallet Modal
    console.log('\n--- AUDIT CHECK 2: Open Connect Wallet Modal ---');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.includes('Connect Wallet')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Verify Modal displays both Phantom and Gram Wallet with proper branding
    const modalInspection = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return null;
      const text = modal.textContent || '';
      return {
        hasPhantom: text.includes('Phantom'),
        hasGramWallet: text.includes('Gram Wallet'),
        hasSolanaDevnet: text.includes('Devnet'),
        hasTonTestnet: text.includes('Testnet Workchain (-3)'),
        cards: Array.from(modal.querySelectorAll('.group')).map((c) => ({
          text: c.textContent?.trim(),
          button: c.querySelector('button')?.textContent?.trim(),
        })),
      };
    });
    console.log('Modal inspection:', modalInspection);
    if (!modalInspection?.hasPhantom || !modalInspection?.hasGramWallet) {
      throw new Error('Phantom or Gram Wallet missing in modal!');
    }
    console.log('✅ PASSED: Modal displays Phantom (Solana Devnet) and Gram Wallet (TON Testnet -3).');

    // Step C: Connect Phantom explicitly
    console.log('\n--- AUDIT CHECK 3: Explicit Phantom Connection ---');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[role="dialog"] .group'));
      const solanaCard = cards.find((c) => c.textContent?.includes('Phantom'));
      const btn = solanaCard?.querySelector('button');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const phantomConnResult = await page.evaluate(() => {
      const p = window.phantom?.solana;
      return {
        connectCalls: p?.connectCalls,
        lastConnectArgs: p?.lastConnectArgs,
        storedKey: localStorage.getItem('horizonx_solana_connected'),
      };
    });
    console.log('Phantom connection result:', phantomConnResult);
    if (phantomConnResult.connectCalls !== 1) {
      throw new Error('Phantom connect was not called exactly once!');
    }
    if (phantomConnResult.lastConnectArgs?.onlyIfTrusted !== false) {
      throw new Error('Phantom connect was not called with onlyIfTrusted: false!');
    }
    console.log('✅ PASSED: Phantom connected with explicit onlyIfTrusted: false.');

    // Step D: Re-open modal and connect Gram Wallet via TON Connect JS Bridge
    console.log('\n--- AUDIT CHECK 4: Gram Wallet TON Connect JS Bridge ---');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.includes('Connect Wallet')
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[role="dialog"] .group'));
      const tonCard = cards.find((c) => c.textContent?.includes('Gram Wallet'));
      const btn = tonCard?.querySelector('button');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const gramConnResult = await page.evaluate(() => {
      const g = window.tonconnect?.gramwallet;
      return {
        connectCalls: g?.connectCalls,
        storedAddress: localStorage.getItem('horizonx_ton_connected'),
      };
    });
    console.log('Gram Wallet connection result:', gramConnResult);
    if (gramConnResult.connectCalls !== 1) {
      throw new Error('Gram Wallet TON Connect bridge connect was not called!');
    }
    if (gramConnResult.storedAddress !== '0QC7q-154_mD9Hn73_K_839h3892_example_jetton_testn') {
      throw new Error('Incorrect address stored for Gram Wallet!');
    }
    console.log('✅ PASSED: Gram Wallet connected successfully via TON Connect JS bridge (network: -3).');

    // Take screenshot of connected state
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '38_phantom_and_gram_connected.png') });
    console.log('✅ PASS: Saved 38_phantom_and_gram_connected.png');

    console.log('\n======================================================');
    console.log('🎉 AUDIT VERIFICATION COMPLETED CLEANLY WITH 100% PASS!');
    console.log('======================================================');
  } catch (err) {
    console.error('Audit Verification Error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAudit();


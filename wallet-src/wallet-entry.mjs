import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { HDKey } from '@scure/bip32';
import { p2wpkh, TEST_NETWORK, Transaction } from '@scure/btc-signer';
import { hex } from '@scure/base';
import { decode as decodeBolt11 } from 'light-bolt11-decoder';
import QRCode from 'qrcode';

const STORE_KEY = 'learnsats-real-wallet-v1';
const PATH = "m/84'/1'/0'/0/0";
const ESPLORA = ['https://blockstream.info/signet/api', 'https://mempool.space/signet/api'];

function derive(mnemonic) {
  return bip39.mnemonicToSeed(mnemonic).then(seed => {
    const root = HDKey.fromMasterSeed(seed);
    const child = root.derive(PATH);
    const pay = p2wpkh(child.publicKey, TEST_NETWORK);
    return { child, pay, address: pay.address };
  });
}
async function fetchTimeout(url, opts, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(function() { ctrl.abort(); }, ms || 15000);
  try {
    return await fetch(url, Object.assign({}, opts || {}, { signal: ctrl.signal }));
  } finally { clearTimeout(timer); }
}
async function esplora(path) {
  let lastErr = null;
  for (const base of ESPLORA) {
    try {
      const r = await fetchTimeout(base + path, undefined, 15000);
      if (!r.ok) throw new Error('Esplora ' + r.status);
      return await r.json();
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('Esplora unreachable');
}
async function esploraText(path, method, body) {
  let lastErr = null;
  for (const base of ESPLORA) {
    try {
      const r = await fetchTimeout(base + path, method ? { method, body, headers: { 'Content-Type': 'text/plain' } } : undefined, 15000);
      if (!r.ok) throw new Error('Esplora ' + r.status + ' ' + (await r.text()).slice(0, 200));
      return await r.text();
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('Esplora unreachable');
}
async function lowestFeeRate() {
  const rates = [];
  for (const base of ESPLORA) {
    try {
      const r = await fetchTimeout(base + '/fee-estimates', undefined, 15000);
      if (!r.ok) continue;
      const f = await r.json();
      const v = Number(f['6'] || f['3'] || f['1']);
      if (Number.isFinite(v) && v > 0) rates.push(v);
    } catch (e) {}
  }
  if (!rates.length) return 1;
  return Math.max(1, Math.ceil(Math.min(...rates)));
}
window.LearnSatsWallet = {
  async create() {
    const mnemonic = bip39.generateMnemonic(wordlist, 128);
    const d = await derive(mnemonic);
    localStorage.setItem(STORE_KEY, JSON.stringify({ mnemonic, address: d.address }));
    return { mnemonic, address: d.address };
  },
  load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      const v = JSON.parse(raw);
      if (!v || !v.mnemonic || !v.address) return null;
      return v;
    } catch (e) { return null; }
  },
  wipe() { localStorage.removeItem(STORE_KEY); },
  async qr(address) {
    const svg = await QRCode.toString(address, { type: 'svg', margin: 1, width: 200 });
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  },
  async refresh(address) {
    const [info, utxos, txs, height, fees] = await Promise.all([
      esplora('/address/' + address),
      esplora('/address/' + address + '/utxo'),
      esplora('/address/' + address + '/txs'),
      esploraText('/blocks/tip/height'),
      lowestFeeRate()
    ]);
    const confirmed = info.chain_stats.funded_txo_sum - info.chain_stats.spent_txo_sum;
    const mempool = info.mempool_stats.funded_txo_sum - info.mempool_stats.spent_txo_sum;
    return { confirmed, mempool, balance: confirmed + mempool, txCount: info.chain_stats.tx_count, utxos, txs: (txs || []).slice(0, 10), height: Number(height), feeRate: fees };
  },
  decodeInvoice(text) {
    const s = String(text || '').trim().toLowerCase();
    if (!s.startsWith('ln')) throw new Error('That does not look like a Lightning invoice. It must start with ln.');
    const d = decodeBolt11(s);
    const get = n => { const f = d.sections.find(x => x.name === n); return f ? f.value : null; };
    const amountMsat = get('amount');
    const prefix = s.slice(0, 4);
    const network = prefix === 'lntb' ? 'testnet' : prefix === 'lnbc' ? 'mainnet' : prefix === 'lnbcrt' ? 'regtest' : 'unknown';
    return { network, prefix, amountSats: amountMsat == null ? null : Math.floor(Number(amountMsat) / 1000), amountMsat, timestamp: get('timestamp'), expiry: get('expiry'), description: get('description'), paymentHash: get('payment_hash') };
  },
  async previewSend(dest, amountSats) {
    const w = this.load();
    if (!w) throw new Error('Create a real wallet first.');
    if (!dest || !dest.startsWith('tb1')) throw new Error('Destination must be a Signet address starting tb1.');
    const amount = BigInt(amountSats);
    if (amount <= 0n) throw new Error('Amount must be more than 0 sats.');
    const utxos = await esplora('/address/' + w.address + '/utxo');
    if (!utxos.length) throw new Error('This wallet has no testnet sats yet. Get test coins from the Signet faucet first, then try again.');
    const rate = await lowestFeeRate();
    const picked = [];
    let total = 0n;
    for (const u of utxos) { picked.push(u); total += BigInt(u.value); if (total >= amount + BigInt(500)) break; }
    const nOut = 2;
    const estVsize = 10 + 68 * picked.length + 31 * nOut;
    const fee = BigInt(Math.ceil(rate * estVsize * 1.1));
    if (total < amount + fee) throw new Error('Not enough testnet sats. Balance in UTXOs is ' + total.toString() + ' sats, need ' + (amount + fee).toString() + ' sats including a fee of about ' + fee.toString() + ' sats.');
    const change = total - amount - fee;
    if (change < 0n) throw new Error('Not enough testnet sats after the fee.');
    return { dest, amount: amount.toString(), fee: fee.toString(), feeRate: rate, change: change.toString(), total: total.toString(), inputs: picked.length, address: w.address };
  },
  async send(dest, amountSats) {
    const w = this.load();
    if (!w) throw new Error('Create a real wallet first.');
    const preview = await this.previewSend(dest, amountSats);
    const d = await derive(w.mnemonic);
    const utxos = await esplora('/address/' + w.address + '/utxo');
    const picked = [];
    let total = 0n;
    const need = BigInt(preview.amount) + BigInt(preview.fee);
    for (const u of utxos) { picked.push(u); total += BigInt(u.value); if (total >= need) break; }
    const tx = new Transaction();
    for (const u of picked) {
      tx.addInput({ txid: hex.decode(u.txid), index: u.vout, witnessUtxo: { amount: BigInt(u.value), script: d.pay.script } });
    }
    tx.addOutputAddress(dest, BigInt(preview.amount), TEST_NETWORK);
    const change = total - BigInt(preview.amount) - BigInt(preview.fee);
    if (change > 546n) tx.addOutputAddress(w.address, change, TEST_NETWORK);
    tx.sign(d.child.privateKey);
    tx.finalize();
    const raw = tx.extract();
    let rawHex = '';
    for (let i = 0; i < raw.length; i++) rawHex += raw[i].toString(16).padStart(2, '0');
    const txid = await esploraText('/tx', 'POST', rawHex);
    return { txid: String(txid).trim(), fee: preview.fee, amount: preview.amount, dest };
  }
};

# LearnSats

Learn Bitcoin in plain English. Earn demo sats. Try a wallet, safely.

Live demo: https://learnsats.vercel.app

Built for the Dakar Bitcoin Hack by BTrust, November 2026. Devpost: https://dakar-bitcoin-hack-2026.devpost.com

## Problem

Many Nigerians hear about Bitcoin but have no simple safe place to learn it and try a wallet.

## How it works

LearnSats is one loop, end to end, in the browser.

1. Read a short lesson. There are 5 lessons, each about 3 minutes, each with a Nigerian example.
2. Take its quiz. Each quiz has 3 questions. Get 2 or more right to pass.
3. Earn 100 demo sats for each quiz you pass, once per lesson. That is 500 demo sats in total if you pass all 5. Get all 3 questions right in a row in a quiz for a 25 demo sats streak bonus, once per lesson. Pass the Quick challenge with 4 or more of 5 correct for a 50 demo sats bonus, once per day.
4. Practise in the demo wallet. Create a demo invoice to receive, or send demo sats to a demo address, with a confirm screen first.
5. Ask Sats, the on-device tutor, for help in simple English.
6. Try the Quick challenge, earn badges, climb levels, and check the sample leaderboard.
7. Open the Real Wallet tab to create a real Bitcoin Signet testnet wallet, get test coins from the faucet, and send a real testnet transaction. See the Real Wallet section below.

## Lessons

1. What is Bitcoin? Money without a bank, fixed supply of 21 million, anyone can use it.
2. Your wallet and keys. What a wallet is, what a seed phrase is, never share it, demo wallet only here.
3. Lightning Network. Fast small payments, sats are tiny parts of a bitcoin, 100 million sats make 1 bitcoin.
4. Sending and receiving sats. Invoices, QR codes, checking the amount before you confirm.
5. Stay safe. Common scams, verify addresses, start small, keep your seed phrase offline.

Each lesson has 3 to 4 short sections, a key takeaway box, a short Pidgin takeaway line labelled Pidgin, and a 3 question quiz. Wrong answers show the correct simple explanation, with no shaming.

## Levels, badges, streaks, and challenge

Levels are based on lessons passed: 0 lessons is Newcomer, 1 is Sats Scholar, 2 or 3 is Lightning Learner, 4 or 5 is Bitcoin Builder. Each passed lesson earns a badge, shown on the lesson card and in a badges row: Bitcoin Basics, Key Keeper, Lightning Fast, Sats Sender, and Safety Star. A streak counter tracks consecutive correct quiz answers in a row, saved in the browser. Quiz answers animate right away, with progress dots for the 3 questions and a small confetti burst on a pass. The wallet balance counts up when demo sats are earned, and a send shows steps for invoice, route, and confirm, then a success state.

Earn amounts, all demo sats, not real BTC: 100 base per passed lesson quiz, once per lesson, 25 streak bonus for 3 correct in a row inside a quiz, once per lesson, 50 Quick challenge bonus for 4 or more of 5 correct, once per day. The Quick challenge draws 5 random questions from all lessons, with 30 seconds per question.

The sample leaderboard is labelled Sample learners and is sample only. It shows 4 sample names with sample demo sats totals, beside your current demo sats total. These are not real users, and no real user data is used.

## Real Wallet, Bitcoin Signet testnet

The Real Wallet tab is a real Bitcoin wallet on Signet, the Bitcoin test network. Its coins are test coins, worth nothing. No real money is used, and no real Bitcoin is ever sent.

How it works, in the browser only:

* Create a wallet: 12 words are generated in the browser, and a real Signet P2WPKH address starting tb1 is derived from them, using BIP39 and BIP84. The words and the address are saved in the browser only, in localStorage. Write the 12 words on paper and keep them offline. Never share them, and never send real Bitcoin to this testnet address.
* Real balance: the balance, unspent outputs, and recent transactions are read live from the Blockstream and mempool.space Signet Esplora APIs, with the current block height and fee rate shown. Nothing is invented. If the API cannot be reached, the app shows the error instead of a made up balance.
* Get test coins: paste only the address at the Signet faucet at https://signetfaucet.com/ , which sends 1,000 to 10,000 test sats per request. The faucet never needs the 12 words.
* Real send: enter a Signet address and an amount in test sats, review the fee and change first, then confirm. The app builds a real transaction from the real unspent outputs, signs it in the browser with the stored key, and broadcasts it through the Esplora API. The real transaction ID is shown with a link to the explorer.
* Lightning invoice check: paste a BOLT11 invoice to read its network, amount, description, expiry, and payment hash. A testnet invoice starting lntb is labelled testnet. A mainnet invoice starting lnbc is flagged with a warning not to pay it here. This only reads the invoice. It does not pay it, because this wallet has no Lightning node.

Libraries, bundled into wallet.bundle.js with esbuild: @scure/bip39 2.4.0, @scure/bip32 1.4.0, @scure/btc-signer 2.4.1, light-bolt11-decoder 3.2.0, and qrcode 1.5.4 for the address QR code. The source is in wallet-src/wallet-entry.mjs. Verified in testing: address generation matches the known BIP84 test vector, a fresh address reads a 0 balance at Signet height 331409, a testnet BOLT11 invoice for 1,500 sats decodes correctly, and a send with no funds is blocked with a clear error. Verified live on Signet on Nov 18 2026: the wallet at tb1qvvapr4uw9k95ypvg9ktc0mdavrm7n2k46y46k0 received 2,000 test sats in transaction d42f5caced47026149b57f5b9c0ef514a272f8905b195a5323f935ee2dbea7d7, then sent 1,000 test sats from inside the app for a fee of 154 test sats, transaction cf8076ecfab8cbe4c3d9c3a1077eb09b0a94e00dc8291586555f548904047724, leaving 846 test sats. Both transactions are on the Signet explorer at mempool.space/signet/tx/. The two Signet faucets were both down when we tried to fund the wallet, so the 2,000 test sats came from the public BIP39 test vector address, whose key is published in every BIP39 test suite. Test coins only, worth nothing.

## Demo wallet warning

Demo sats are not real BTC. No real money is used in LearnSats.

The built in wallet starts at 0 demo sats. It is not connected to Bitcoin or Lightning. It makes no real payment and creates no real transaction. Demo invoice codes and demo references are practice codes only, not real Lightning invoices and not real transaction hashes. The demo label appears on the home screen, in the wallet, in the footer, and in this README.

## Quick challenge

A practice challenge in its own tab. 5 random questions from all 5 lessons, 30 seconds per question, one question at a time. Pass with 4 or more correct to earn 50 demo sats, once per day. The date of the last earned bonus is saved in the browser, so a second pass on the same day is practice only, with no extra bonus.

## Ask Sats tutor

Ask Sats is labelled On-device tutor in the app. It runs in the browser using keyword matching and the lesson content. It is not a live large model and it is not connected to any API. It answers common questions about Bitcoin, sats, Lightning, seed phrases, sending sats, real money, and staying safe. It suggests the next lesson based on quiz mistakes and on lessons not yet passed. It says plainly when it does not know.

## Setup

No build step. No backend. No API key.

Option A, open the file directly: open index.html in a browser.

Option B, serve it statically: run python3 -m http.server 8000 in this folder, then open http://localhost:8000 in a browser.

All progress, balance, and history stay in the browser, in localStorage. Use the Reset demo button in the Wallet tab to clear them.

## Architecture

Static app with no backend. index.html holds the layout, the styles, and the lesson and demo wallet script, so it loads fast on a mid-range phone and on low bandwidth. wallet.bundle.js holds the real testnet wallet code, bundled from wallet-src/wallet-entry.mjs.

The script holds the lesson content as data, the quiz logic, the demo wallet state, the receive and send flows, and the on-device tutor. State is saved to localStorage under learnsats-v1. The visual code on the receive screen is a simple 7 by 7 pattern made from the demo invoice code, for practice only. It is not a real QR code.

Files:

* index.html, the full app
* wallet.bundle.js, the bundled real testnet wallet code, loaded by index.html
* wallet-src/wallet-entry.mjs, the source for wallet.bundle.js
* README.md, this file

## Judging criteria

* Usefulness and social impact: a plain English path for students, market traders, and families in Nigeria to learn Bitcoin safely before they use real money.
* Security by design: the demo wallet has no real money, the seed phrase lesson teaches never to share it, the send flow has a confirm screen with amount and fee 0, and no personal data leaves the browser. The Real Wallet is testnet only, its key stays in the browser, its balance and transactions come from the public Esplora API, and a mainnet invoice is flagged, never paid.
* UX and UI quality: mobile first, clean layout, one warm gold accent for Bitcoin, clear labels, helpful errors, accessible contrast, simple copy free of jargon.
* Working MVP: the full loop works in the browser. Learn, quiz, earn, receive, send, history, reset, tutor, challenge, levels, badges, and streaks all run with no backend. The Real Wallet creates a real Signet address, reads a real balance from Esplora, and sends a real testnet transaction.
* Clear pitch: the Pitch tab in the app states the problem, how it works, who it helps, what is demo, and what is next.

## What is next

Add full Pidgin lesson versions, add offline lesson packs for low data areas, and test with students and traders to improve the wording. The Lightning testnet mode is now built as the Real Wallet tab, with a BOLT11 invoice check and a real Signet wallet.

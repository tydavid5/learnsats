# LearnSats

Learn Bitcoin in plain English. Earn demo sats. Try a wallet, safely.

Built for the Dakar Bitcoin Hack by BTrust, November 2026. Devpost: https://dakar-bitcoin-hack-2026.devpost.com

## Problem

Many Nigerians hear about Bitcoin but have no simple safe place to learn it and try a wallet.

## How it works

LearnSats is one loop, end to end, in the browser.

1. Read a short lesson. There are 5 lessons, each about 3 minutes, each with a Nigerian example.
2. Take its quiz. Each quiz has 3 questions. Get 2 or more right to pass.
3. Earn 100 demo sats for each quiz you pass, once per lesson. That is 500 demo sats in total if you pass all 5.
4. Practise in the demo wallet. Create a demo invoice to receive, or send demo sats to a demo address, with a confirm screen first.
5. Ask Sats, the on-device tutor, for help in simple English.

## Lessons

1. What is Bitcoin? Money without a bank, fixed supply of 21 million, anyone can use it.
2. Your wallet and keys. What a wallet is, what a seed phrase is, never share it, demo wallet only here.
3. Lightning Network. Fast small payments, sats are tiny parts of a bitcoin, 100 million sats make 1 bitcoin.
4. Sending and receiving sats. Invoices, QR codes, checking the amount before you confirm.
5. Stay safe. Common scams, verify addresses, start small, keep your seed phrase offline.

Each lesson has 3 to 4 short sections, a key takeaway box, and a 3 question quiz. Wrong answers show the correct simple explanation, with no shaming.

## Demo wallet warning

Demo sats are not real BTC. No real money is used in LearnSats.

The built in wallet starts at 0 demo sats. It is not connected to Bitcoin or Lightning. It makes no real payment and creates no real transaction. Demo invoice codes and demo references are practice codes only, not real Lightning invoices and not real transaction hashes. The demo label appears on the home screen, in the wallet, in the footer, and in this README.

## Ask Sats tutor

Ask Sats is labelled On-device tutor in the app. It runs in the browser using keyword matching and the lesson content. It is not a live large model and it is not connected to any API. It answers common questions about Bitcoin, sats, Lightning, seed phrases, sending sats, real money, and staying safe. It suggests the next lesson based on quiz mistakes and on lessons not yet passed. It says plainly when it does not know.

## Setup

No build step. No backend. No API key.

Option A, open the file directly: open index.html in a browser.

Option B, serve it statically: run python3 -m http.server 8000 in this folder, then open http://localhost:8000 in a browser.

All progress, balance, and history stay in the browser, in localStorage. Use the Reset demo button in the Wallet tab to clear them.

## Architecture

Single page static app. One file, index.html, holds the layout, the styles, and the script, so it loads fast on a mid-range phone and on low bandwidth.

The script holds the lesson content as data, the quiz logic, the demo wallet state, the receive and send flows, and the on-device tutor. State is saved to localStorage under learnsats-v1. The visual code on the receive screen is a simple 7 by 7 pattern made from the demo invoice code, for practice only. It is not a real QR code.

Files:

* index.html, the full app
* README.md, this file

## Judging criteria

* Usefulness and social impact: a plain English path for students, market traders, and families in Nigeria to learn Bitcoin safely before they use real money.
* Security by design: the demo wallet has no real money, the seed phrase lesson teaches never to share it, the send flow has a confirm screen with amount and fee 0, and no personal data leaves the browser.
* UX and UI quality: mobile first, clean layout, one warm gold accent for Bitcoin, clear labels, helpful errors, accessible contrast, simple copy free of jargon.
* Working MVP: the full loop works in the browser. Learn, quiz, earn, receive, send, history, reset, and tutor all run with no backend.
* Clear pitch: the Pitch tab in the app states the problem, how it works, who it helps, what is demo, and what is next.

## What is next

Add more lessons in Nigerian Pidgin, add a practice Lightning testnet mode with clear warnings, add offline lesson packs for low data areas, and test with students and traders to improve the wording.

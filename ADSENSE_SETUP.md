# Apni Website Par Ad Lagana (Google AdSense)

Tumhari website me ad lagane ki jagah pehle se bani hui hai — bas apna AdSense code paste karna hai.

## Ad wali jaghein (index.html me)

1. **Top banner** — `id="ad-top"` (header ke neeche, sab se bara ad)
2. **Sidebar box 1** — `id="ad-side-1"` (right side)
3. **Sidebar box 2** — `id="ad-side-2"` (right side, neeche)
4. **In-feed ads** — `app.js` me har 6 khabron ke baad khud lagta hai

Har jagah ye comment likha hai:
`<!-- APNA ADSENSE CODE YAHAN PASTE KARO -->`

## AdSense account kaise banayein

1. https://www.google.com/adsense par jao aur "Get started" dabao.
2. Apni website ka URL do (jo Render se milega).
3. Google tumhari site check karega (1-2 hafte lag sakte hain). Site par asli khabrein aur pages (About, Contact, Privacy Policy) hone se approval asaan hota hai.
4. Approval ke baad AdSense dashboard se **Ad units** banao (Display ads).
5. Jo code milega, usko copy karke upar wali jaghon par placeholder ki jagah paste kar do.

## Example

Placeholder:
```html
<div class="ad-slot ad-leaderboard" id="ad-top">
  <span class="ad-label">Advertisement</span>
  <p>Apna ad yahan lagao (Google AdSense code)</p>
</div>
```

AdSense code lagane ke baad:
```html
<div class="ad-slot ad-leaderboard" id="ad-top">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-TUMHARA-ID" crossorigin="anonymous"></script>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-TUMHARA-ID"
       data-ad-slot="TUMHARA-SLOT"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>
```

**Note:** Jab tak AdSense approve nahi hota, placeholder wale dabbe khaali nazar aayenge — ye normal hai. Approval ke baad ads khud chalne lagenge aur earning AdSense dashboard me dikhegi.

# SSRF Defense Lab

> **Preface:**
>
> 🔫 In 1765, the people of Gévaudan fired silver bullets at a beast. They believed it would stop what ordinary lead could not. But the monster didn’t die. The myth of the silver bullet — a single, simple fix to vanquish evil — is centuries old. It lives on in cybersecurity, where we still chase “one clean line of code” to stop complex threats. But just like in the 18th century: it doesn’t exist.
>
> 🕵️‍♂️ More: [Silver Bullet – Archive.org](https://archive.org/details/SilverBullet)
>
> 🧪 I reviewed recent SSRF “fixes” shared across the web. From popular blog posts to GitHub advisories — many had one thing in common: they failed.
> - `startsWith()` checks? → ✅ Bypassed via `@` tricks
> - `new URL()` hostname validation? → ❌ Doesn’t block redirects
> - Lambda metadata endpoints? → 💥 Still reachable
> - IP allowlists? → ⚠️ Often misconfigured or too broad
> Even “patched” code left critical paths exposed.
>
> So I built a better testbed for SSRF defense:
> - 🔧 Domain-based validation
> - 🔒 Redirect prevention
> - 🛠️ Interceptors with enforced hostname whitelists
> - 🔗 Examples from the wild:
>     - [Snyk Blog: Preventing SSRF in Node.js](https://snyk.io/blog/preventing-ssrf-node-js/)
>     - [GitHub Patch (NextChat)](https://github.com/Chanzhaoyu/chatgpt-next-web/pull/5799)
>     - [GHSA Advisory](https://github.com/advisories/GHSA-2p68-f74v-9wc6)
>
> 📌 There is no silver bullet. Not in folklore. Not in security. We must stop treating patching as a checkbox. Security isn’t a one-liner — it’s a process: Think. Test. Break. Fix. Repeat.
>
> 📘 Full writeup: [windshock.github.io SSRF defense post](https://windshock.github.io/posts/2025-06-25-ssrf-defense/)
>
> #SSRF #AppSec #DevSecOps #NoSilverBullet #axios #SecureCoding

---

A minimal, self-contained SSRF (Server-Side Request Forgery) defense test lab for Node.js/Express.

This repository provides reusable security test utilities, a secure router example, a vulnerable router example, and minimal test code to verify SSRF defenses in file download endpoints.

## Project Structure

- `testUtils/testDownloadSecurity.js`: Reusable SSRF defense test utility
- `routers/secureRouter.js`: Example of a secure file download router
- `routers/secureRouter.test.js`: SSRF defense tests for the secure router
- `routers/vulnerableRouter.js`: Example of a vulnerable file download router (for comparison)
- `routers/vulnerableRouter.test.js`: SSRF defense tests for the vulnerable router
- `package.json`: Dependencies and scripts

## Installation & Usage

```bash
npm install
npm test
```

## What does it test?
- CDN/domain whitelisting
- Redirect bypass attempts (e.g., via `@` tricks)
- Direct access to non-whitelisted domains
- Redirects from whitelisted domains to malicious targets

## References
- [Silver Bullet – Archive.org](https://archive.org/details/SilverBullet)
- [windshock.github.io SSRF defense post](https://windshock.github.io/posts/ssrf-defense/)
- [Snyk Blog: Preventing SSRF in Node.js](https://snyk.io/blog/preventing-ssrf-node-js/)
- [GitHub Patch (NextChat)](https://github.com/Chanzhaoyu/chatgpt-next-web/pull/5799)
- [GHSA Advisory](https://github.com/advisories/GHSA-2p68-f74v-9wc6)

---

MIT License

## Test Description
- Automatically verifies SSRF defense scenarios including CDN whitelisting, redirect bypass attempts, and non-whitelisted domain access.
- All tests must pass for a router to be considered secure.

## More Info
- Source & updates: https://github.com/windshock/ssrf-defense-lab
- Questions/feedback: Open a GitHub issue or contact windshock.

---

MIT License

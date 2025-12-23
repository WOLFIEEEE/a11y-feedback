# Security Policy

## Supported Versions

We actively support the following versions of a11y-feedback with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue in a11y-feedback, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email**: Send details to [theaccessibleteam@gmail.com](mailto:theaccessibleteam@gmail.com)
2. **GitHub Security Advisories**: Use the [private vulnerability reporting](https://github.com/WOLFIEEEE/a11y-feedback/security/advisories/new) feature

### What to Include

Please include the following information in your report:

- **Type of issue** (e.g., XSS, injection, denial of service)
- **Full paths of source file(s)** related to the issue
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours of submission
- **Status Update**: Within 7 days with an assessment
- **Resolution Target**: Within 30 days for critical issues, 90 days for non-critical

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt of your report
2. **Assessment**: We will assess the vulnerability and determine its severity
3. **Updates**: We will keep you informed about our progress
4. **Fix**: We will develop and test a fix
5. **Disclosure**: We will coordinate disclosure timing with you
6. **Credit**: We will credit you in the release notes (unless you prefer anonymity)

## Security Best Practices for Users

### Content Security Policy (CSP)

a11y-feedback supports CSP through nonce-based style injection. Configure your CSP header:

```http
Content-Security-Policy: style-src 'self' 'nonce-<your-nonce>';
```

Then pass the nonce to the library:

```typescript
import { configureFeedback } from '@theaccessibleteam/a11y-feedback'

configureFeedback({
  visual: true,
  cspNonce: 'your-nonce-value',
})
```

### DOM Sanitization

All user-provided messages are safely escaped before insertion into the DOM. The library does not use `innerHTML` for user content.

### Dependencies

We regularly audit our dependencies for known vulnerabilities:

```bash
npm audit
```

We recommend users also run `npm audit` in their projects to catch any transitive vulnerabilities.

## Security Features

### Built-in Protections

1. **No eval()**: The library never uses `eval()` or `Function()` constructors
2. **No innerHTML for user content**: User messages are text-only
3. **Strict TypeScript**: Compile-time type checking prevents many classes of bugs
4. **Minimal dependencies**: Zero runtime dependencies reduce attack surface

### Accessibility Security

The library is designed to prevent accessibility-related security issues:

- Focus management rules prevent focus trapping attacks
- Screen reader announcements are rate-limited to prevent audio denial-of-service
- Visual feedback respects user preferences (reduced motion)

## Vulnerability Disclosure Policy

We follow a coordinated disclosure process:

1. Reporter submits vulnerability
2. We confirm receipt and begin investigation
3. We develop and test a fix
4. We prepare a security advisory
5. We release the fix and publish the advisory
6. We credit the reporter (if desired)

We ask that reporters:
- Allow us reasonable time to address the issue before public disclosure
- Make a good faith effort to avoid privacy violations, data destruction, and service disruption
- Not access or modify data belonging to others

## Contact

For any security-related questions, contact [theaccessibleteam@gmail.com](mailto:theaccessibleteam@gmail.com).


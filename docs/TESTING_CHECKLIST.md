# TESTING_CHECKLIST.md

> **Baseline version:** 1.0 | **Architecture decisions:** 1.1 | **Last updated:** 2026-10-30

---

## Build and static checks (run after every task)

| Check | Command | Status |
|---|---|---|
| Production build | `npm run build` | NOT RUN |
| TypeScript type-check | `npm run type-check` | NOT RUN |
| ESLint | `npm run lint` | NOT RUN |
| Unit tests | `npm run test` | NOT CONFIGURED |

---

## Module acceptance criteria

For each module to be marked COMPLETE, the following must pass:

- [ ] Dashboard, listing, detail and create/manage views exist
- [ ] All navigation entry points lead to canonical routes
- [ ] Every modal has trigger, fields, validation, loading, success, error and dismissal behavior documented and tested
- [ ] No visible dead buttons, fake success or misleading placeholder data
- [ ] Public and wallet-gated experiences behave as specified
- [ ] Database and on-chain facts are distinguished and attributed
- [ ] Forms handle invalid, boundary, duplicate submission, cancellation and network failure
- [ ] Loading, empty, stale, disconnected, unsupported-network and error states tested
- [ ] Responsive behavior (mobile/tablet/desktop) reviewed
- [ ] Keyboard accessibility reviewed
- [ ] Build, type-check, lint pass; exceptions recorded
- [ ] No unresolved critical/high-severity defect without explicit release approval
- [ ] Progress, module and modal inventories updated

---

## Responsive coverage targets

| Viewport | Width | Test method |
|---|---|---|
| Mobile S | 375px | Browser dev tools |
| Mobile L | 430px | Browser dev tools |
| Tablet | 768px | Browser dev tools |
| Desktop | 1280px | Direct |
| Wide | 1440px | Direct |

---

## Browser coverage targets

| Browser | Version |
|---|---|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest (macOS/iOS) |
| Edge | Latest |

---

## Known defects (link to KNOWN_ISSUES.md)

See [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) for current defect list.

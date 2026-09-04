# AI Mental Wellness App - Professional Refactoring Plan

## Steps

### Phase 1: Core Infrastructure
- [ ] 1. Create favicon.ico for PWA
- [ ] 2. Expand styles.css with ALL missing component CSS classes
- [ ] 3. Fix Journal.jsx - migrate from styled-jsx to CSS classes
- [ ] 4. Fix Biofeedback.jsx - add onClose prop support + modal wrapper
- [ ] 5. Fix Gamification.jsx - proper CSS classes + modal wrapper
- [ ] 6. Fix Dashboard.jsx - ensure correct CSS class references
- [ ] 7. Fix MeditationPlayer.jsx - add modal CSS classes
- [ ] 8. Fix App.jsx - integrate Gamification, Biofeedback modals correctly, theme toggle
- [ ] 9. Fix mlService.js - proper TensorFlow integration with fallback
- [ ] 10. Add service worker for PWA offline support

### Phase 2: Test
- [ ] 11. Run `npm run start` and verify
- [ ] 12. Test full flow: Onboarding → Dashboard → Journal → Meditation → Biofeedback → Gamification


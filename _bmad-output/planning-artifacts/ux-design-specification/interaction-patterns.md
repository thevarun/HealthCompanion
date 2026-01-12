# Interaction Patterns

## Micro-interactions

**Button States:**
- **Hover:** Subtle color shift or elevation change
- **Active:** Pressed state with scale or shadow adjustment
- **Loading:** Spinner or skeleton state, disabled interaction
- **Success:** Brief checkmark or color change confirmation

**Form Interactions:**
- **Focus:** Clear outline or border color change
- **Validation:** Real-time for format issues, on-blur for required fields
- **Error:** Red border + clear error message below field
- **Success:** Green checkmark or subtle positive feedback

**Navigation:**
- **Active State:** Background highlight or border accent
- **Hover:** Subtle background color change
- **Transition:** Smooth page transitions, no jarring shifts

## Loading & Feedback States

**Page Loading:**
- **Skeleton Screens:** Content-shaped placeholders during load
- **Progressive Loading:** Show what's ready while rest loads
- **Timeouts:** Error messages if loading exceeds reasonable time

**Action Feedback:**
- **Immediate:** Visual acknowledgment on click/tap
- **Progress:** Loading spinners for operations > 1 second
- **Completion:** Success toast or inline confirmation
- **Errors:** Clear error messages with recovery actions

## Animations & Transitions

**Principles:**
- **Subtle:** Enhance, don't distract
- **Fast:** 150-300ms for most transitions
- **Purposeful:** Guide attention or provide feedback
- **Accessible:** Respect prefers-reduced-motion

**Common Animations:**
- **Modal/Dialog:** Fade in + scale up entrance
- **Toast Notifications:** Slide in from corner
- **List Items:** Stagger entrance for visual interest
- **Page Transitions:** Fade or subtle slide between routes

## Error Handling

**Error Display Patterns:**
- **Form Errors:** Inline below field, red border, clear fix instructions
- **Page Errors:** Error boundary with recovery options
- **API Errors:** Toast notifications with specific error messages
- **404/403:** Full-page states with navigation back to safety

**Error Message Guidelines:**
- **Be Specific:** "Email already exists" not "Error occurred"
- **Be Helpful:** "Try 'example@email.com' format" not "Invalid email"
- **Be Actionable:** Provide recovery steps or alternatives
- **Be Friendly:** Avoid technical jargon, use plain language

---

import { profile } from '../data/profile'

const socialUrl = (label: string) =>
  profile.socials.find((social) => social.label === label)?.url ?? '#'

/**
 * ── EDIT YOUR CONTACT DETAILS HERE ─────────────────────────────────────
 * Single source for the contact milestone + modal. Email / phone / socials
 * default to the values in src/data/profile.ts; swap the Instagram link
 * for your own before launch.
 */
export const CONTACT_CONFIG = {
  resumeUrl: profile.resumeUrl,
  email: profile.email,
  phone: profile.phone,
  instagram: 'https://www.instagram.com/', // ← replace with your profile URL
  linkedin: socialUrl('LinkedIn'),
  github: socialUrl('GitHub'),
  thanksLine: "Thanks for scrolling this far. Let's talk.",
} as const

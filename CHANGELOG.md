# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-16

### Added
- **Animated Login Background** - Complete rewrite of login page left panel with GSAP and Framer Motion animations
  - 12 unique avatar cards with professional headshots (no duplicates)
  - GSAP floating animations with random x/y drift and rotation
  - Framer Motion entrance animations (scale/opacity with back.out easing)
  - Random chat bubbles appearing above avatars with friendly messages
  - Pulsing green online indicators on each avatar
  - Subtle floating particle effects in the background
  - Teal gradient background

### Changed
- Removed ReactQueryDevtools from production and development builds
- Removed "Welcome to Auzmor Office" text from login background

### Technical
- Added GSAP (^3.14.2) for high-performance animations
- Added Framer Motion (^11.18.2) for React component animations
- Animations properly cleanup on component unmount

## [1.0.0] - 2026-01-15

### Added
- Initial v1 clone from main office_frontend repository
- Project setup with TypeScript, TailwindCSS, and PWA support
- Vercel deployment configuration

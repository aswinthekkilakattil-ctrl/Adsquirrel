import { Fragment, Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { onValue, ref as dbRef, set } from 'firebase/database'
import './App.css'
import ChromaKeyVideo from './components/ChromaKeyVideo.jsx'
import { auth, database, isFirebaseConfigured } from './firebase.js'
import { defaultSiteContent } from './siteContent.js'

const AdminPanel = lazy(() => import('./components/AdminPanel.jsx'))

const CONTACT_FORM_CREDENTIALS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  notificationEmail: import.meta.env.VITE_CONTACT_NOTIFICATION_EMAIL || '',
}

const SITE_ORIGIN = 'https://www.adsquirrel.in'

const LANDING_PAGES = {
  '/advertising-company-kerala': {
    seo: {
      title: 'Best Advertising Company in Kerala | AdSquirrel',
      description:
        'AdSquirrel is a Kerala advertising company for creative campaigns, digital advertising, branding, SEO, AEO, video production, and performance marketing.',
      ogTitle: 'Best Advertising Company in Kerala | AdSquirrel',
      ogDescription:
        'Creative advertising and digital marketing support for Kerala brands that want sharper campaigns and measurable growth.',
      canonical: `${SITE_ORIGIN}/advertising-company-kerala`,
    },
    eyebrow: 'Advertising Company in Kerala',
    title: 'Creative advertising for Kerala brands ready to be remembered',
    intro:
      'AdSquirrel blends campaign strategy, bold creative, digital advertising, SEO, AEO, branding, social media, and video production for businesses across Kerala.',
    sections: [
      ['Campaign Strategy', 'Positioning, messaging, creative direction, channel planning, and campaign execution built around your business goals.'],
      ['Digital Advertising', 'Meta, Google, social, and performance-led campaigns designed to reach the right audience and improve enquiry quality.'],
      ['Brand & Content', 'Identity systems, campaign assets, videos, and social content that make your brand easier to trust and easier to remember.'],
    ],
    faq: [
      ['What makes AdSquirrel an advertising company in Kerala?', 'The agency supports Kerala-focused businesses with advertising strategy, creative campaigns, digital marketing, branding, SEO, AEO, and video-led content.'],
      ['Do you handle both creative and performance marketing?', 'Yes. AdSquirrel combines brand thinking with measurable campaign execution so creative work is connected to business outcomes.'],
    ],
  },
  '/advertising-agency-kochi': {
    seo: {
      title: 'Advertising Agency in Kochi | AdSquirrel',
      description:
        'AdSquirrel helps Kochi and Kerala businesses with advertising campaigns, social media marketing, branding, SEO, AEO, video production, and performance marketing.',
      ogTitle: 'Advertising Agency in Kochi | AdSquirrel',
      ogDescription:
        'Advertising, branding, SEO, AEO, social media, and performance marketing for Kochi and Kerala businesses.',
      canonical: `${SITE_ORIGIN}/advertising-agency-kochi`,
    },
    eyebrow: 'Advertising Agency in Kochi',
    title: 'Advertising, branding, and digital growth support for Kochi businesses',
    intro:
      'For Kochi brands, AdSquirrel brings together local market understanding, creative campaign ideas, and practical digital execution without claiming a separate physical office beyond the business details shown on this site.',
    sections: [
      ['Social Media & Paid Campaigns', 'Content calendars, ad creatives, targeting, testing, and campaign reporting for businesses that need consistent visibility.'],
      ['SEO & AEO', 'Search-friendly content, answer-led page structure, technical fixes, and service messaging that make your business easier to discover.'],
      ['Video & Brand Identity', 'Short-form videos, campaign visuals, identity systems, and brand assets made for digital-first customer attention.'],
    ],
    faq: [
      ['Can AdSquirrel work with Kochi businesses?', 'Yes. The current business information includes Kochi, and the agency can support Kochi businesses with advertising, branding, SEO, AEO, and performance marketing.'],
      ['Do you claim a separate Kochi office?', 'No. This page only uses the business information already present in the website content and avoids inventing unsupported locations.'],
    ],
  },
}

function cloneDefaultContent() {
  return JSON.parse(JSON.stringify(defaultSiteContent))
}

function normalizeContent(content) {
  const nextContent = cloneDefaultContent()
  const mergedContent = mergeWithDefaults(nextContent, content)
  const legacyCopy = {
    originalHeroSubtitle: "AdSquirrel is the wildest marketing agency that cracks the nut of digital growth. We bring viral campaigns, insane creativity, and results that'll make you do a backflip.",
    heroSubtitle: "AdSquirrel is a results-driven marketing agency that unlocks digital growth. We bring viral campaigns, insane creativity, and results that'll make you do a backflip.",
    targetingDescription: 'We find your audience like a squirrel finds nuts, with laser focus and pure instinct.',
    seoDescription: 'We climb search rankings like squirrels climb trees, fast and all the way to the top.',
    aboutDescriptionOne: 'AdSquirrel was founded by a bunch of marketing maniacs who believed that advertising should be fun, fearless, and freaking effective.',
    aboutDescriptionTwo: "We're not your typical buttoned-up agency. We're the ones who bring confetti cannons to brainstorming sessions and turn Monday meetings into creative explosions.",
    contactSubtitle: "Drop us a message and let's turn your brand into the next big thing. No boring meetings, we promise.",
    messagePlaceholder: 'Tell us about your wildest marketing dreams...',
  }
  const oldTestimonialAuthors = ['Sarah Chen', 'Marcus Johnson', 'Priya Patel']

  if (
    mergedContent.hero?.badge === '\uD83D\uDE80 #1 Nutty Marketing Agency' ||
    mergedContent.hero?.badge === '🚀 #1 Nutty Marketing Agency'
  ) {
    mergedContent.hero.badge = 'Nexston'
  }

  if (mergedContent.hero?.titleBounce === 'NUTS!' || mergedContent.hero?.titleBounce === 'Further.') {
    mergedContent.hero.titleBounce = 'Nuts.'
  }

  if (
    mergedContent.hero?.subtitle === legacyCopy.originalHeroSubtitle ||
    mergedContent.hero?.subtitle === legacyCopy.heroSubtitle
  ) {
    mergedContent.hero.subtitle = nextContent.hero.subtitle
  }

  if (mergedContent.testimonials?.gradientWord === 'Nutty Clients') {
    mergedContent.testimonials.gradientWord = 'Clients'
  }

  if (
    mergedContent.services?.title === 'Services That Go' &&
    (mergedContent.services?.gradientWord === 'Beyond Nuts' || mergedContent.services?.gradientWord === 'Further')
  ) {
    mergedContent.services.title = nextContent.services.title
    mergedContent.services.gradientWord = nextContent.services.gradientWord
  }

  if (mergedContent.services?.items?.[0]?.desc === legacyCopy.targetingDescription) {
    mergedContent.services.items[0].desc = nextContent.services.items[0].desc
  }

  if (mergedContent.services?.items?.[5]?.desc === legacyCopy.seoDescription) {
    mergedContent.services.items[5].desc = nextContent.services.items[5].desc
  }

  if (mergedContent.services?.items?.[3]?.title === 'Growth Hacking') {
    mergedContent.services.items[3].title = 'AEO Services'
  }

  if (mergedContent.services?.items?.[3]?.desc === 'Unconventional strategies that multiply your growth exponentially.') {
    mergedContent.services.items[3].desc = nextContent.services.items[3].desc
  }

  if (mergedContent.about?.descriptionOne === legacyCopy.aboutDescriptionOne) {
    mergedContent.about.descriptionOne = nextContent.about.descriptionOne
  }

  if (mergedContent.about?.descriptionTwo === legacyCopy.aboutDescriptionTwo) {
    mergedContent.about.descriptionTwo = nextContent.about.descriptionTwo
  }

  if (mergedContent.about?.features?.[0]?.text === 'Campaigns launched at squirrel speed') {
    mergedContent.about.features[0] = nextContent.about.features[0]
  }

  if (
    Array.isArray(mergedContent.testimonials?.items) &&
    mergedContent.testimonials.items.some((item) => oldTestimonialAuthors.includes(item.author))
  ) {
    mergedContent.testimonials.items = cloneDefaultContent().testimonials.items
  }

  if (mergedContent.contact?.submitLabel === "Let's Go Nuts Together!") {
    mergedContent.contact.submitLabel = 'Send Your Enquiry'
  }

  if (mergedContent.contact?.title === 'Ready to Go') {
    mergedContent.contact.title = 'Ready to Grow'
  }

  if (mergedContent.contact?.gradientWord === 'Absolutely Nuts?') {
    mergedContent.contact.gradientWord = 'Your Brand?'
  }

  if (mergedContent.contact?.subtitle === legacyCopy.contactSubtitle) {
    mergedContent.contact.subtitle = nextContent.contact.subtitle
  }

  if (mergedContent.contact?.messagePlaceholder === legacyCopy.messagePlaceholder) {
    mergedContent.contact.messagePlaceholder = nextContent.contact.messagePlaceholder
  }

  const oldOfficeLines = [
    'No. 4/61, 2nd Floor, Suite #697,',
    'Valamkottil Towers, Judgemukku,',
    'Kakkanad, Kochi - 682021',
  ]

  if (
    Array.isArray(mergedContent.footer?.officeLines) &&
    mergedContent.footer.officeLines.join('|') === oldOfficeLines.join('|')
  ) {
    mergedContent.footer.officeLines = nextContent.footer.officeLines
  }

  if (mergedContent.footer?.email === 'adsquirrelbynexston@gmail.com') {
    mergedContent.footer.email = nextContent.footer.email
  }

  if (mergedContent.footer?.phone === '+91 8301981869') {
    mergedContent.footer.phone = nextContent.footer.phone
  }

  if (Array.isArray(mergedContent.faq?.items)) {
    const currentQuestions = new Set(mergedContent.faq.items.map((item) => item.question))
    const newAeoQuestions = nextContent.faq.items.filter(
      (item) => item.question.includes('AEO') && !currentQuestions.has(item.question),
    )
    mergedContent.faq.items = [...mergedContent.faq.items, ...newAeoQuestions]
  }

  if (mergedContent.nav?.ctaLabel === 'Go Nuts!') {
    mergedContent.nav.ctaLabel = 'Get Started'
  }

  return mergedContent
}

function mergeWithDefaults(defaultValue, incomingValue) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(incomingValue) ? incomingValue : defaultValue
  }

  if (defaultValue && typeof defaultValue === 'object') {
    const merged = { ...defaultValue }
    const source = incomingValue && typeof incomingValue === 'object' ? incomingValue : {}

    Object.keys(source).forEach((key) => {
      merged[key] = key in defaultValue
        ? mergeWithDefaults(defaultValue[key], source[key])
        : source[key]
    })

    return merged
  }

  return incomingValue ?? defaultValue
}

function seededValue(seed) {
  const value = Math.sin(seed * 9301 + 49297) * 233280
  return value - Math.floor(value)
}

function applySeo(seo) {
  if (!seo) return

  const canonicalUrl = seo.canonical || `${SITE_ORIGIN}${window.location.pathname === '/' ? '/' : window.location.pathname}`
  document.title = seo.title || defaultSiteContent.seo.title

  const ensureMeta = (name, value, attr = 'name') => {
    let meta = document.head.querySelector(`meta[${attr}="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attr, name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', value || '')
  }

  ensureMeta('description', seo.description || '')
  ensureMeta('keywords', seo.keywords || '')
  ensureMeta('robots', window.location.pathname === '/cpanel' ? 'noindex, nofollow' : 'index, follow')
  ensureMeta('og:title', seo.ogTitle || seo.title || '', 'property')
  ensureMeta('og:description', seo.ogDescription || seo.description || '', 'property')
  ensureMeta('og:url', canonicalUrl, 'property')
  ensureMeta('og:type', seo.ogType || 'website', 'property')
  ensureMeta('twitter:card', seo.ogImage ? 'summary_large_image' : 'summary')
  ensureMeta('twitter:title', seo.ogTitle || seo.title || '')
  ensureMeta('twitter:description', seo.ogDescription || seo.description || '')

  if (seo.ogImage) {
    ensureMeta('og:image', seo.ogImage, 'property')
    ensureMeta('twitter:image', seo.ogImage)
  }

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', canonicalUrl)
}

function applyStructuredData(content) {
  const scriptId = 'adsquirrel-structured-data'
  document.getElementById(scriptId)?.remove()

  const siteUrl = SITE_ORIGIN
  const organizationId = `${siteUrl}/#organization`
  const aeoService = content.services?.items?.find((service) => service.title === 'AEO Services')
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: content.footer?.companyName || 'Nexston Corporations Pvt Ltd',
        url: siteUrl,
        logo: `${siteUrl}/nexston.png`,
        email: content.footer?.email,
        telephone: content.footer?.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1st Floor, Kinfra Hi-Tech Park',
          addressLocality: 'Kalamassery',
          addressRegion: 'Kerala',
          postalCode: '683503',
          addressCountry: 'IN',
        },
        sameAs: content.footer?.socialLinks
          ?.map((social) => social.href)
          .filter((href) => href && href !== '#' && !href.startsWith('mailto:')),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'AdSquirrel',
        url: siteUrl,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'Service',
        name: aeoService?.title || 'AEO Services',
        description: aeoService?.desc,
        provider: { '@id': organizationId },
        areaServed: { '@type': 'Country', name: 'India' },
        serviceType: 'Answer Engine Optimization',
      },
    ],
  }

  const script = document.createElement('script')
  script.id = scriptId
  script.type = 'application/ld+json'
  script.text = JSON.stringify(schema)
  document.head.appendChild(script)
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isInView]
}

function ParticleField() {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: seededValue(i + 1) * 100,
    size: seededValue(i + 41) * 6 + 2,
    delay: seededValue(i + 81) * 8,
    duration: seededValue(i + 121) * 10 + 8,
    opacity: seededValue(i + 161) * 0.4 + 0.1,
  })), [])

  return (
    <div className="particle-field">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  )
}

function FloatingAcorns() {
  const acorns = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: seededValue(i + 201) * 100,
    top: seededValue(i + 221) * 100,
    size: seededValue(i + 241) * 30 + 15,
    delay: seededValue(i + 261) * 6,
    duration: seededValue(i + 281) * 8 + 6,
  })), [])

  return (
    <div className="floating-acorns">
      {acorns.map((acorn) => (
        <div
          key={acorn.id}
          className="acorn"
          style={{
            left: `${acorn.left}%`,
            top: `${acorn.top}%`,
            fontSize: `${acorn.size}px`,
            animationDelay: `${acorn.delay}s`,
            animationDuration: `${acorn.duration}s`,
          }}
        >
          {'\u{1F330}'}
        </div>
      ))}
    </div>
  )
}

function Navbar({ nav }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const homePrefix = window.location.pathname === '/' ? '' : '/'

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handler = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY
      const pastTop = currentScrollY > 120

      setScrolled(currentScrollY > 50)

      if (menuOpen) {
        setHidden(false)
      } else if (scrollingDown && pastTop) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [menuOpen])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${hidden ? 'navbar--hidden' : ''}`} id="navbar">
      <div className="navbar__inner">
        <a href={`${homePrefix}#hero`} className="navbar__logo" id="nav-logo">
          <img src="/squirrel-wave.png" alt="AdSquirrel" className="navbar__logo-img" />
          <span className="navbar__logo-text">
            Ad<span className="navbar__logo-highlight">Squirrel</span>
          </span>
        </a>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`} id="primary-navigation">
          <a href={`${homePrefix}#services`} className="navbar__link" onClick={() => setMenuOpen(false)}>
            {nav.servicesLabel}
          </a>
          <a href={`${homePrefix}#about`} className="navbar__link" onClick={() => setMenuOpen(false)}>
            {nav.aboutLabel}
          </a>
          <a href={`${homePrefix}#stats`} className="navbar__link" onClick={() => setMenuOpen(false)}>
            {nav.resultsLabel}
          </a>
          <a href={`${homePrefix}#testimonials`} className="navbar__link" onClick={() => setMenuOpen(false)}>
            {nav.reviewsLabel}
          </a>
          <a href={`${homePrefix}#contact`} className="navbar__cta-btn" id="nav-cta" onClick={() => setMenuOpen(false)}>
            {nav.ctaLabel}
          </a>
        </div>

        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          id="nav-burger"
          aria-label="Toggle navigation menu"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}

function HeroSection({ hero }) {
  const [loaded, setLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 300)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      <ParticleField />
      <FloatingAcorns />
      <div className="hero__orb hero__orb--1"></div>
      <div className="hero__orb hero__orb--2"></div>
      <div className="hero__orb hero__orb--3"></div>

      <div className={`hero__content ${loaded ? 'hero__content--loaded' : ''}`}>
        <h1 className="hero__title">
          <span className="hero__title-line hero__title-line--1">{hero.titleLine1}</span>
          <span className="hero__title-line hero__title-line--2">
            <span className="hero__title-gradient">{hero.titleGradient}</span>
          </span>
          <span className="hero__title-line hero__title-line--3">
            {hero.titleLine3Prefix}{' '}
            <span className="hero__title-bounce">{hero.titleBounce}</span>{' '}
            <span className="hero__title-acorn">{'\u{1F330}'}</span>
          </span>
        </h1>

        {isMobile && (
          <div className="hero__video-inline">
            <ChromaKeyVideo src="/squirrel.mp4" similarity={30} smoothness={15} />
          </div>
        )}

        <p className="hero__subtitle">{hero.subtitle}</p>

        <div className="hero__actions">
          <a href="#contact" className="btn btn--primary btn--3d" id="hero-cta">
            <span>{hero.primaryCta}</span>
            <span className="btn__icon">{'\u{1F680}'}</span>
          </a>
          <a href="#testimonials" className="btn btn--glass" id="hero-secondary">
            <span>{hero.secondaryCta}</span>
            <span className="btn__icon">{'\u{1F4AC}'}</span>
          </a>
        </div>

        <div className="hero__stats-mini">
          {hero.stats.map((item, index) => (
            <Fragment key={item.label}>
              <div className="hero__stat-mini">
                <span className="hero__stat-number">{item.number}</span>
                <span className="hero__stat-label">{item.label}</span>
              </div>
              {index < hero.stats.length - 1 && <div className="hero__stat-divider"></div>}
            </Fragment>
          ))}
        </div>
      </div>

      {!isMobile && <ChromaKeyVideo src="/squirrel.mp4" similarity={30} smoothness={15} />}

      <div className="hero__scroll-indicator">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}

function MarqueeBanner({ items }) {
  return (
    <div className="marquee" id="marquee">
      <div className="marquee__track">
        {[...items, ...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} className="marquee__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function ServicesSection({ services }) {
  const [ref, inView] = useInView()

  return (
    <section className="services" id="services" ref={ref}>
      <div className="section__header">
        <span className="section__badge">{services.badge}</span>
        <h2 className="section__title">
          {services.title} <span className="text-gradient">{services.gradientWord}</span> {'\u{1F525}'}
        </h2>
        <p className="section__subtitle">{services.subtitle}</p>
      </div>

      <div className={`services__grid ${inView ? 'services__grid--visible' : ''}`}>
        {services.items.map((service, index) => (
          <div
            key={service.title}
            className="service-card"
            style={{ animationDelay: `${index * 0.12}s`, '--accent': service.color }}
          >
            <div className="service-card__icon-wrap">
              <span className="service-card__icon">{service.icon}</span>
              <div className="service-card__icon-ring"></div>
            </div>
            <h3 className="service-card__title">{service.title}</h3>
            <p className="service-card__desc">{service.desc}</p>
            <div className="service-card__shine"></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function AboutSection({ about }) {
  const [ref, inView] = useInView()

  return (
    <section className="about" id="about" ref={ref}>
      <div className={`about__content ${inView ? 'about__content--visible' : ''}`}>
        <div className="about__text">
          <span className="section__badge">{about.badge}</span>
          <h2 className="section__title">
            {about.title} <span className="text-gradient">{about.gradientWord}</span> {'\u{1F98A}'}
          </h2>
          <p className="about__description">{about.descriptionOne}</p>
          <p className="about__description">{about.descriptionTwo}</p>

          <div className="about__features">
            {about.features.map((feature) => (
              <div key={feature.title} className="about__feature">
                <div className="about__feature-icon">{feature.icon}</div>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about__visual">
          <div className="about__img-wrapper">
            <img src="/squirrel-working.png" alt="AdSquirrel working hard" className="about__img" />
            <div className="about__img-border"></div>
            <div className="about__img-dots"></div>
          </div>
          <div className="about__floating-badge about__floating-badge--1">{about.awardBadge}</div>
          <div className="about__floating-badge about__floating-badge--2">{about.passionBadge}</div>
        </div>
      </div>
    </section>
  )
}

function AeoSection({ aeo }) {
  const [ref, inView] = useInView()

  return (
    <section className="aeo" id="aeo" ref={ref}>
      <div className="section__header">
        <span className="section__badge">{aeo.badge}</span>
        <h2 className="section__title">
          {aeo.title} <span className="text-gradient">{aeo.gradientWord}</span>
        </h2>
        <p className="section__subtitle">{aeo.description}</p>
      </div>

      <div className={`aeo__grid ${inView ? 'aeo__grid--visible' : ''}`}>
        {aeo.items.map((item, index) => (
          <article className="aeo__card" key={item.title} style={{ animationDelay: `${index * 0.1}s` }}>
            <span className="aeo__number">0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function StatsSection({ results }) {
  const [ref, inView] = useInView()

  return (
    <section className="stats" id="stats" ref={ref}>
      <div className="stats__bg-text">{results.bgText}</div>
      <div className={`stats__grid ${inView ? 'stats__grid--visible' : ''}`}>
        {results.items.map((stat, index) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <span className="stat-card__icon">{stat.icon}</span>
            <span className="stat-card__number">{stat.number}</span>
            <span className="stat-card__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function TestimonialsSection({ testimonials }) {
  const [ref, inView] = useInView()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const prefersReducedMotion = useMemo(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    [],
  )

  useEffect(() => {
    if (paused || prefersReducedMotion || testimonials.items.length < 2) return undefined

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.items.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [paused, prefersReducedMotion, testimonials.items.length])

  return (
    <section className="testimonials" id="testimonials" ref={ref}>
      <div className="section__header">
        <span className="section__badge">{testimonials.badge}</span>
        <h2 className="section__title">
          {testimonials.title} <span className="text-gradient">{testimonials.gradientWord}</span> Say {'\u{1F499}'}
        </h2>
      </div>

      <div className={`testimonials__carousel ${inView ? 'testimonials__carousel--visible' : ''}`}>
        {testimonials.items.map((item, index) => (
          <div
            key={`${item.author}-${index}`}
            className={`testimonial-card ${index === active ? 'testimonial-card--active' : ''}`}
          >
            <div className="testimonial-card__quote">"</div>
            <p className="testimonial-card__text">{item.text}</p>
            <div className="testimonial-card__author">
              <span className="testimonial-card__avatar">{item.avatar}</span>
              <div>
                <strong>{item.author}</strong>
                <span>{item.role}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="testimonials__dots">
          <button
            className="testimonials__pause"
            type="button"
            onClick={() => setPaused((current) => !current)}
            aria-label={paused ? 'Resume testimonial autoplay' : 'Pause testimonial autoplay'}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
          {testimonials.items.map((item, index) => (
            <button
              key={`${item.author}-dot`}
              className={`testimonials__dot ${index === active ? 'testimonials__dot--active' : ''}`}
              onClick={() => setActive(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection({ faq }) {
  const [ref, inView] = useInView()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="faq" id="faq" ref={ref}>
      <div className="section__header">
        <span className="section__badge">{faq.badge}</span>
        <h2 className="section__title">
          {faq.title} <span className="text-gradient">{faq.gradientWord}</span>
        </h2>
      </div>

      <div className={`faq__list ${inView ? 'faq__list--visible' : ''}`}>
        {faq.items.map((item, index) => {
          const isOpen = openIndex === index
          const answerId = `faq-answer-${index}`

          return (
            <article className={`faq__item ${isOpen ? 'faq__item--open' : ''}`} key={item.question}>
              <button
                type="button"
                className="faq__question"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span>{item.question}</span>
                <span className="faq__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              <div className="faq__answer-wrap" id={answerId} hidden={!isOpen}>
                <p className="faq__answer">{item.answer}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function CTASection({ contact }) {
  const [ref, inView] = useInView()
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleFieldChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return 'Name, email, and message are required.'
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(form.email.trim())) {
      return 'Please enter a valid email address.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setStatus('error')
      setError(validationError)
      return
    }

    setStatus('sending')

    try {
      if (
        !CONTACT_FORM_CREDENTIALS.serviceId ||
        !CONTACT_FORM_CREDENTIALS.templateId ||
        !CONTACT_FORM_CREDENTIALS.publicKey
      ) {
        throw new Error('Contact form is not configured. Add EmailJS VITE_* values before publishing.')
      }

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: CONTACT_FORM_CREDENTIALS.serviceId,
          template_id: CONTACT_FORM_CREDENTIALS.templateId,
          user_id: CONTACT_FORM_CREDENTIALS.publicKey,
          template_params: {
            name: form.name.trim(),
            email: form.email.trim(),
            company: form.company.trim(),
            message: form.message.trim(),
            from_name: form.name.trim(),
            from_email: form.email.trim(),
            context: form.message.trim(),
            to_email: CONTACT_FORM_CREDENTIALS.notificationEmail || undefined,
          },
        }),
      })

      if (!response.ok) {
        const responseText = await response.text()
        throw new Error(responseText || 'Failed to send message.')
      }

      setStatus('success')
      setForm({ name: '', email: '', company: '', message: '' })
    } catch (submitError) {
      setStatus('error')
      setError(submitError instanceof Error ? submitError.message : 'Failed to send message.')
    }
  }

  return (
    <section className="cta-section" id="contact" ref={ref}>
      <div className={`cta-section__inner ${inView ? 'cta-section__inner--visible' : ''}`}>
        <div className="cta-section__bg-shapes">
          <div className="cta-shape cta-shape--1"></div>
          <div className="cta-shape cta-shape--2"></div>
          <div className="cta-shape cta-shape--3"></div>
        </div>
        <img src="/squirrel-wave.png" alt="AdSquirrel waving" className="cta-section__mascot" />

        <h2 className="cta-section__title">
          {contact.title} <span className="text-gradient">{contact.gradientWord}</span> {'\u{1F330}'}
        </h2>
        <p className="cta-section__subtitle">{contact.subtitle}</p>

        <form className="cta-section__form" id="contact-form" onSubmit={handleSubmit}>
          <div className="cta-form__row">
            <label className="cta-form__label">
              <span>Name</span>
              <input
                type="text"
                placeholder={contact.namePlaceholder}
                className="cta-form__input"
                value={form.name}
                onChange={handleFieldChange('name')}
                autoComplete="name"
                required
              />
            </label>
            <label className="cta-form__label">
              <span>Email</span>
              <input
                type="email"
                placeholder={contact.emailPlaceholder}
                className="cta-form__input"
                value={form.email}
                onChange={handleFieldChange('email')}
                autoComplete="email"
                required
              />
            </label>
          </div>
          <label className="cta-form__label">
            <span>Company</span>
            <input
              type="text"
              placeholder={contact.companyPlaceholder}
              className="cta-form__input"
              value={form.company}
              onChange={handleFieldChange('company')}
              autoComplete="organization"
            />
          </label>
          <label className="cta-form__label">
            <span>Project message</span>
            <textarea
              placeholder={contact.messagePlaceholder}
              className="cta-form__textarea"
              rows="4"
              value={form.message}
              onChange={handleFieldChange('message')}
              required
            ></textarea>
          </label>
          {status === 'error' && error && (
            <p className="cta-form__feedback cta-form__feedback--error" role="alert">{error}</p>
          )}
          {status === 'success' && (
            <p className="cta-form__feedback cta-form__feedback--success" role="status">{contact.successMessage}</p>
          )}
          <button type="submit" className="btn btn--primary btn--3d btn--large" disabled={status === 'sending'}>
            <span>{status === 'sending' ? 'Sending...' : contact.submitLabel}</span>
            <span className="btn__icon">{'\u{1F48C}'}</span>
          </button>
        </form>
      </div>
    </section>
  )
}

function Footer({ footer }) {
  const hasVerificationHref = footer.verificationHref && footer.verificationHref !== '#'

  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <h3 className="footer__company-name">{footer.companyName}</h3>
          <p className="footer__tagline">{footer.description}</p>
        </div>

        <div className="footer__links-group footer__office">
          <h4>{footer.officeHeading}</h4>
          {footer.officeLines.map((line) => (
            <p key={line} className="footer__office-line">
              {line}
            </p>
          ))}
        </div>

        <div className="footer__links-group footer__connect">
          <h4>{footer.connectHeading}</h4>
          <div className="footer__socials">
            {footer.socialLinks.map((social) => (
              <a key={social.label} href={social.href} className="footer__social" aria-label={social.label}>
                {social.icon}
              </a>
            ))}
          </div>
          <div className="footer__contact-list">
            <p className="footer__contact-item"><strong>Email:</strong> {footer.email}</p>
            <p className="footer__contact-item"><strong>Phone:</strong> {footer.phone}</p>
          </div>
          {hasVerificationHref ? (
            <a href={footer.verificationHref} className="footer__verification-btn">
              {footer.verificationLabel}
            </a>
          ) : (
            <span className="footer__verification-btn footer__verification-btn--disabled" aria-disabled="true">
              {footer.verificationLabel} unavailable
            </span>
          )}
        </div>
      </div>

      <div className="footer__bottom">
        <p>{footer.copyright}</p>
      </div>
    </footer>
  )
}

function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const moveCursor = (event) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${event.clientX}px`
        cursorRef.current.style.top = `${event.clientY}px`
      }
      if (followerRef.current) {
        setTimeout(() => {
          if (followerRef.current) {
            followerRef.current.style.left = `${event.clientX}px`
            followerRef.current.style.top = `${event.clientY}px`
          }
        }, 80)
      }
    }

    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  return (
    <>
      <div className="custom-cursor" ref={cursorRef}></div>
      <div className="custom-cursor-follower" ref={followerRef}></div>
    </>
  )
}

function FooterPoweredBy() {
  return (
    <a
      href="https://www.nexston.in"
      target="_blank"
      rel="noreferrer"
      className="footer-powered-by"
      aria-label="Powered by Nexston"
    >
      <span className="footer-powered-by__label">Powered by</span>
      <img src="/nexston.png" alt="Nexston" className="footer-powered-by__logo" />
    </a>
  )
}

function FloatingWhatsAppButton({ phone }) {
  const whatsappNumber = String(phone || '').replace(/\D/g, '')

  if (!whatsappNumber) return null

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp"
      aria-label="Chat with AdSquirrel on WhatsApp"
    >
      <span className="floating-whatsapp__shine" aria-hidden="true"></span>
      <svg
        className="floating-whatsapp__icon"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M16.01 4.8c-6.19 0-11.2 5-11.2 11.18 0 1.98.52 3.92 1.49 5.62L4.8 27.2l5.77-1.5a11.18 11.18 0 0 0 5.43 1.39c6.17 0 11.2-5.01 11.2-11.18 0-2.97-1.16-5.77-3.27-7.88A11.08 11.08 0 0 0 16.01 4.8Zm0 20.39h-.01c-1.75 0-3.46-.47-4.95-1.35l-.35-.21-3.42.89.91-3.34-.22-.34a9.26 9.26 0 0 1-1.5-5.03c0-5.13 4.2-9.32 9.36-9.32 2.49 0 4.82.97 6.58 2.73a9.24 9.24 0 0 1 2.74 6.59c0 5.14-4.19 9.38-9.14 9.38Zm5.13-6.99c-.28-.14-1.65-.81-1.91-.9-.25-.09-.44-.14-.62.15-.18.27-.72.89-.88 1.08-.16.18-.32.2-.59.07-.28-.14-1.16-.43-2.22-1.37-.82-.73-1.38-1.63-1.55-1.91-.16-.27-.02-.42.12-.56.12-.12.27-.3.4-.45.13-.16.18-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.46h-.53c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.37 1 2.69 1.12 2.88.14.18 1.95 2.97 4.73 4.16.66.29 1.19.46 1.59.59.67.21 1.28.18 1.76.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.53-.32Z"
        />
      </svg>
    </a>
  )
}

function SeoLandingPage({ page, content }) {
  return (
    <main className="landing-page">
      <Navbar nav={content.nav} />
      <section className="landing-hero">
        <span className="section__badge">{page.eyebrow}</span>
        <h1 className="landing-hero__title">{page.title}</h1>
        <p className="landing-hero__intro">{page.intro}</p>
        <div className="hero__actions landing-hero__actions">
          <a href="/#contact" className="btn btn--primary btn--3d">Start a Project</a>
          <a href="/#services" className="btn btn--glass">Explore Services</a>
        </div>
      </section>

      <section className="landing-section">
        <h2>How AdSquirrel Helps</h2>
        <div className="landing-grid">
          {page.sections.map(([title, text]) => (
            <article className="landing-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-section--links">
        <h2>Connected Services</h2>
        <div className="landing-links">
          {content.services.items.map((service) => (
            <a key={service.title} href="/#services">{service.title}</a>
          ))}
          <a href="/#aeo">Answer Engine Optimization</a>
          <a href="/#testimonials">Client stories</a>
          <a href="/#contact">Contact AdSquirrel</a>
        </div>
      </section>

      <section className="landing-section">
        <h2>Questions Businesses Ask</h2>
        <div className="faq__list faq__list--visible">
          {page.faq.map(([question, answer], index) => (
            <article className="faq__item" key={question}>
              <button className="faq__question" type="button" aria-expanded="true" aria-controls={`landing-faq-${index}`}>
                <span>{question}</span>
              </button>
              <div className="faq__answer-wrap" id={`landing-faq-${index}`}>
                <p className="faq__answer">{answer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTASection contact={content.contact} />
      <FooterPoweredBy />
      <Footer footer={content.footer} />
    </main>
  )
}

function App() {
  const [content, setContent] = useState(cloneDefaultContent())
  const [adminUser, setAdminUser] = useState(null)
  const isCpanelRoute = window.location.pathname === '/cpanel'
  const landingPage = LANDING_PAGES[window.location.pathname]

  useEffect(() => {
    if (!database) {
      return undefined
    }

    const contentRef = dbRef(database, 'siteContent')
    const unsubscribeContent = onValue(contentRef, (snapshot) => {
      if (snapshot.exists()) {
        try {
          setContent(normalizeContent(snapshot.val()))
        } catch {
          setContent(cloneDefaultContent())
        }
      } else {
        setContent(cloneDefaultContent())
      }
    }, () => {
      setContent(cloneDefaultContent())
    })

    return () => {
      unsubscribeContent()
    }
  }, [])

  useEffect(() => {
    if (!auth) {
      return undefined
    }

    return onAuthStateChanged(auth, (user) => {
      setAdminUser(user)
    })
  }, [])

  useEffect(() => {
    applySeo(landingPage?.seo || content.seo)
  }, [content, landingPage])

  useEffect(() => {
    applyStructuredData(content)
  }, [content])

  useEffect(() => {
    if (isCpanelRoute) return

    window.history.scrollRestoration = 'manual'
    const nextUrl = `${window.location.pathname}${window.location.search}`
    if (window.location.hash) {
      window.history.replaceState(null, '', nextUrl)
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    requestAnimationFrame(() => {
      document.getElementById('hero')?.scrollIntoView({ block: 'start' })
    })

    return () => {
      window.history.scrollRestoration = 'auto'
    }
  }, [isCpanelRoute])

  const saveContent = async (nextContent) => {
    if (!database || !isFirebaseConfigured) {
      throw new Error('Firebase is not configured for saving. Add VITE_FIREBASE_* env values and Realtime Database rules.')
    }

    await set(dbRef(database, 'siteContent'), nextContent)
    setContent(nextContent)
  }

  const resetContent = () => {
    const resetValue = cloneDefaultContent()
    setContent(resetValue)
    return resetValue
  }

  if (isCpanelRoute) {
    return (
      <Suspense fallback={<div className="admin-panel-loading">Loading admin panel...</div>}>
        <AdminPanel
          content={content}
          onSave={saveContent}
          onReset={resetContent}
          isAuthenticated={Boolean(adminUser)}
          onLogin={setAdminUser}
          onLogout={() => setAdminUser(null)}
        />
      </Suspense>
    )
  }

  if (landingPage) {
    return <SeoLandingPage page={landingPage} content={content} />
  }

  return (
    <div className="app">
      <CustomCursor />
      <Navbar nav={content.nav} />
      <HeroSection hero={content.hero} />
      <MarqueeBanner items={content.marquee} />
      <ServicesSection services={content.services} />
      <AeoSection aeo={content.aeo} />
      <AboutSection about={content.about} />
      <StatsSection results={content.results} />
      <TestimonialsSection testimonials={content.testimonials} />
      <CTASection contact={content.contact} />
      <FaqSection faq={content.faq} />
      <FloatingWhatsAppButton phone={content.footer.whatsapp || content.footer.phone} />
      <FooterPoweredBy />
      <Footer footer={content.footer} />
    </div>
  )
}

export default App




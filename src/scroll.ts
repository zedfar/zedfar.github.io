export function initScrollProgress(): void {
  const bar = document.getElementById('scroll-progress') as HTMLDivElement

  function update(): void {
    const scrolled = window.scrollY
    const total = document.documentElement.scrollHeight - window.innerHeight
    bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%'
  }

  window.addEventListener('scroll', update, { passive: true })
  update()
}

export function initScrollReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  )

  document.querySelectorAll<HTMLElement>('.node').forEach((node, i) => {
    node.style.transitionDelay = `${i * 60}ms`
    observer.observe(node)
  })
}

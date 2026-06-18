import './style.css'
import { initCanvasAnimation } from './canvas'
import { initScrollProgress, initScrollReveal } from './scroll'

window.addEventListener('load', () => {
  initCanvasAnimation()
  initScrollProgress()
  initScrollReveal()
})

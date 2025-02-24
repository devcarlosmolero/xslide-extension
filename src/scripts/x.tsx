import XCarouselButton from '@/components/XCarouselButton'
import DOMUtils from '@/lib/utils/DOM'
import React from 'react'
import { render } from 'react-dom'
import '../tailwind.css'

DOMUtils.asyncQuerySelector("button[aria-label='Más opciones']").then(
  (target: HTMLElement) => {
    const parent = target.parentElement
    if (parent) {
      const root = document.createElement('div')
      parent.insertAdjacentElement('beforebegin', root)
      parent.parentElement!.style.display = 'flex'
      parent.parentElement!.style.flexDirection = 'row'
      render(<XCarouselButton />, root)
    }
  },
)

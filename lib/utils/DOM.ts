async function asyncQuerySelector(
  query: string,
  ms = 1e3,
): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const i = setInterval(() => {
      const element = document.querySelector(query)
      if (element) {
        clearInterval(i)
        resolve(element as HTMLElement)
      }
    }, ms)
  })
}

const DOMUtils = {
  asyncQuerySelector,
}

export default DOMUtils

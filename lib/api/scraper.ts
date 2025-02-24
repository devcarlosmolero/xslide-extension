import { IPostAuthor } from '../@types/post'

function getPostAuthor(element: HTMLElement | null): IPostAuthor {
  const root =
    element?.parentElement?.parentElement?.parentElement?.parentElement?.querySelector(
      'div',
    )?.nextElementSibling

  const author: IPostAuthor = {
    image: (root?.querySelector("img[draggable='true']") as HTMLImageElement)
      .src,
    name: Array.from(
      root
        ?.querySelector("div[data-testid='User-Name']")
        ?.querySelectorAll('a')[0]
        ?.querySelectorAll("div[dir='ltr']")[0]
        ?.querySelector('span')?.childNodes,
    )
      .map(getContentFromNodes)
      .join(' '),
    username:
      root
        ?.querySelector("div[data-testid='User-Name']")
        ?.querySelectorAll('a')[1]
        ?.querySelector('span')?.innerText || '',
  }

  return author
}

function getPosts(): NodeListOf<Element> {
  return document.querySelectorAll("div[data-testid='tweetText']")
}

function getPostTopParent(
  post: HTMLElement | null,
): HTMLElement | null | undefined {
  return post?.parentElement?.parentElement?.parentElement
}

function getPostImage(topParent: HTMLElement | null): string {
  return (
    topParent?.querySelector(
      "div[data-testid='tweetPhoto'] > img[draggable=true]",
    ) as HTMLImageElement
  )?.src
}

function getContentFromNodes(node: ChildNode): HTMLElement | string | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent
  } else if (node.nodeName === 'SPAN') {
    return (node as HTMLSpanElement).innerText
  } else if (node.nodeName === 'IMG') {
    return (node as HTMLImageElement).alt
  }
  return ''
}

function generatePostId(postText: string): string {
  return `tweet-${postText.slice(0, 20).replace(/\s+/g, '-')}`
}

const Scraper = {
  getPostAuthor,
  getPosts,
  getPostTopParent,
  getContentFromNodes,
  getPostImage,
  generatePostId,
}

export default Scraper

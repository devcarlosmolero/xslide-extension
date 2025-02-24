import { IThreadDataItem } from '@/lib/@types/common'
import { IPostAuthor } from '@/lib/@types/post'
import Scraper from '@/lib/api/scraper'
import React from 'react'
import { Linkedin } from 'react-bootstrap-icons'
import CSSContainer from './CSSContainer'

export default function XCarouselButton(): JSX.Element {
  async function scrollAndCollectPosts(
    author: IPostAuthor,
  ): Promise<IThreadDataItem[]> {
    const data: IThreadDataItem[] = []
    const savedPosts: string[] = []

    return new Promise<IThreadDataItem[] | never>((resolve) => {
      const scrollInterval = setInterval(async () => {
        const posts = Array.from(Scraper.getPosts())

        for (const post of posts) {
          const postAuthor = Scraper.getPostAuthor(post as HTMLElement)
          const hasLinks = post.querySelector('a') !== null

          if (postAuthor.username !== author.username) {
            clearInterval(scrollInterval)
            resolve(data)
            return
          }

          if (hasLinks) {
            return
          }

          const topParent = Scraper.getPostTopParent(post as HTMLElement)

          const postContent = Array.from(post.childNodes)
            .map(Scraper.getContentFromNodes)
            .join('')

          const tweetId = Scraper.generatePostId(postContent)

          if (!savedPosts.includes(tweetId)) {
            savedPosts.push(tweetId)
            data.push({
              id: tweetId,
              text: postContent,
              image: Scraper.getPostImage(topParent as HTMLElement),
            })
          }
        }

        window.scrollBy(0, window.innerHeight)

        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
          clearInterval(scrollInterval)
          resolve(data)
        }
      }, 1000)
    })
  }

  async function handleClick() {
    const author = Scraper.getPostAuthor(
      document.querySelector("div[data-testid='tweetText']"),
    )

    const threadData = await scrollAndCollectPosts(author)

    const url = chrome.runtime.getURL('./pages/carousel/index.html')
    const a = document.createElement('a')
    a.href = `${url}?threadData=${encodeURIComponent(
      JSON.stringify(threadData),
    )}&author=${encodeURIComponent(JSON.stringify(author))}`
    a.target = '_blank'
    a.click()
  }
  return (
    <CSSContainer>
      <button
        onClick={handleClick}
        className="bg-transparent border-white border-2 rounded p-1 h-full mr-2"
      >
        <Linkedin className="size-4" />
      </button>
    </CSSContainer>
  )
}

import React from 'react';
import { Linkedin } from 'react-bootstrap-icons';
import CSSContainer from './CSSContainer';

export default function XCarouselButton(): JSX.Element {
    async function scrollToBottom() {
        return new Promise<void>((resolve) => {
            const scrollInterval = setInterval(() => {
                window.scrollBy(0, window.innerHeight);
                if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                }
            }, 1000);
        });
    }

    function generateTweetId(tweetText: string, index: number): string {
        return `tweet-${index}-${tweetText.slice(0, 20).replace(/\s+/g, "-")}`;
    }

    function getThreadData() {
        const data: any[] = [];
        const seenTweets = new Set();

        document.querySelectorAll("div[data-testid='tweetText']").forEach((tweetText, index) => {
            const topParent = tweetText?.parentElement?.parentElement?.parentElement;
            const tweetContent = Array.from(tweetText.querySelectorAll("span")).map((span: HTMLSpanElement) => span.innerText)
            const tweetId = generateTweetId(tweetContent.join(""), index);

            if (!seenTweets.has(tweetId)) {
                seenTweets.add(tweetId);
                data.push({
                    id: tweetId,
                    text: tweetContent.join(""),
                    image: (topParent?.querySelector("div[data-testid='tweetPhoto'] > img[draggable=true]") as HTMLImageElement)?.src,
                });
            }
        });

        return data;
    }

    async function handleClick() {
        await scrollToBottom();

        const threadData = getThreadData();

        const url = chrome.runtime.getURL("./pages/carousel/index.html");
        const a = document.createElement("a");
        a.href = `${url}?threadData=${encodeURIComponent(JSON.stringify(threadData))}`;
        a.target = "_blank";
        a.click();
    }

    return (
        <CSSContainer>
            <button onClick={handleClick} className="bg-transparent border-white border-2 rounded p-1 h-full ml-2">
                <Linkedin className="size-4" />
            </button>
        </CSSContainer>
    )
}

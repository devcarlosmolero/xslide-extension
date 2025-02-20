import React from 'react';
import { Linkedin } from 'react-bootstrap-icons';
import CSSContainer from './CSSContainer';

export default function XCarouselButton(): JSX.Element {
    function handleClick() {
        const url = chrome.runtime.getURL("./pages/carousel/index.html")
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.click()
    }

    return (
        <CSSContainer>
            <button onClick={handleClick} className="bg-transparent border-white border-2 rounded p-1 h-full ml-2">
                <Linkedin className="size-4" />
            </button>
        </CSSContainer>
    )
}

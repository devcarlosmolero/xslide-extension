import XCarouselButton from "@/components/XCarouselButton";
import DOMUtils from "@/lib/utils/DOM";
import React from "react";
import { render } from "react-dom";
import "../tailwind.css";

DOMUtils.asyncQuerySelector("button[aria-label='Acciones de Grok']").then((target: HTMLElement) => {
    const parent = target.parentElement;
    const root = document.createElement("div");
    parent?.insertAdjacentElement("beforeend", root)
    render(<XCarouselButton />, root)
})
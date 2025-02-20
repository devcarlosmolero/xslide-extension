import React, { ReactNode } from "react";

export default function CSSContainer({ children }: { children: ReactNode }): JSX.Element {
    return <div className="xslide" style={{ height: "100%" }}>
        {children}
    </div>
}
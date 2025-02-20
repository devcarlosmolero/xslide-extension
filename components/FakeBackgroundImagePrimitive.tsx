import cn from 'classnames';
import React, { Fragment, ReactNode } from "react";

function Container({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div style={{ borderRadius: "20px" }} className={cn('relative overflow-hidden', className)}>
            {children}
        </div>
    )
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    alt: string
    src: string
    useImageKit?: boolean
    className?: string
    children?: ReactNode
}

function Image({
    useImageKit = false,
    className,
    children,
    alt,
    ...props
}: ImageProps) {
    return (
        <Fragment>
            <img
                {...props}
                alt={alt}
                style={{ borderRadius: "20px" }}
                className={cn(
                    'absolute left-1/2 top-1/2 h-full max-h-none min-h-full w-auto min-w-full max-w-none -translate-x-1/2 -translate-y-1/2 transform object-cover',
                    className
                )}
            />
            {children}
        </Fragment>
    )
}

export const FakeBackgroundImagePrimitive = {
    Container,
    Image,
}
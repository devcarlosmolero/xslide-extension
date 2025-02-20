import CSSContainer from '@/components/CSSContainer';
import { FakeBackgroundImagePrimitive } from '@/components/FakeBackgroundImagePrimitive';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import React, { useEffect, useRef, useState } from 'react';
import '../../tailwind.css';

const formatTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((line: string, index: number) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));
};

const imageToDataURL = (url: string) => {
    return fetch(url)
        .then((response) => response.blob())
        .then(
            (blob) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                })
        );
};

const App = (): JSX.Element => {
    const [data, setData] = useState<{ text: string, image: string }[]>();

    useEffect(() => {
        const queryString = window.location.search;
        const objectString = queryString.split("=")[1]
        const decodedObject = JSON.parse(decodeURIComponent(objectString));
        setData(decodedObject)
    }, [])

    return (
        <CSSContainer>
            <div>
                {data && data.length > 0 && (
                    data.map(({ text, image }, index: number) => (
                        <CanvaDesign key={index} index={index} text={text} image={image} />
                    ))
                )}
            </div>
        </CSSContainer>
    )
}

const CanvaDesign = ({ text, image, index }: { text: string, index: number, image?: string }) => {
    console.log(text)
    const designRef = useRef(null);
    const [imageBase64, setImageBase64] = useState<string | undefined>();

    useEffect(() => {
        if (image) {
            imageToDataURL(image).then((base64) => setImageBase64(base64 as string));
        }
    }, [image]);

    const handleDownloadPDF = () => {
        if (designRef.current) {
            html2canvas(designRef.current, {
                scale: 2,
                useCORS: true,
                logging: true
            }).then((canvas: any) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "px", [1080, 1080]);

                pdf.addImage(imgData, "PNG", 0, 0, 1080, 1080);
                pdf.save("design.pdf");
            });
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div
                ref={designRef}
                className="w-[1080px] h-[1080px] bg-gradient-to-bl from-gray-900 to-gray-600 bg-gradient-to-r p-5 py-12 flex flex-col items-center justify-start"
            >
                <div className='max-w-[800px]'>
                    <div className='flex items-center justify-start'><div className='p-3 border border-white rounded-full text-white text-2xl min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] flex items-center justify-center'><span className='text-4xl'>{index + 1}</span></div></div>
                    <p className="text-2xl tracking-tighter text-white text-start mt-12">{formatTextWithLineBreaks(text)}</p>
                    {imageBase64 && (
                        <FakeBackgroundImagePrimitive.Container className='aspect-w-16 aspect-h-9 w-full h-[360px] mt-12'>
                            <FakeBackgroundImagePrimitive.Image src={imageBase64}
                                alt="Design" />
                        </FakeBackgroundImagePrimitive.Container>

                    )}
                </div>
            </div>
            <button
                onClick={handleDownloadPDF}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Descargar PDF
            </button>
        </div>
    );
};

export default App
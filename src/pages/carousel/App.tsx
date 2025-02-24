import CSSContainer from '@/components/CSSContainer'
import { FakeBackgroundImagePrimitive } from '@/components/FakeBackgroundImagePrimitive'
import { Button } from '@/components/ui/button'
import { IThreadDataItem } from '@/lib/@types/common'
import { IPostAuthor } from '@/lib/@types/post'
import cn from 'classnames'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { ArrowRight, Download } from 'lucide-react'
import React, { Fragment, useEffect, useState } from 'react'
import '../../tailwind.css'

const formatTextWithLineBreaks = (text: string) => {
  return text.split('\n').map((line: string, index: number) => (
    <React.Fragment key={index}>
      {index === 0 && line.length < 50 ? (
        <Fragment>
          <p
            className="text-xl bg-neutral-900 text-white w-fit px-4 py-2"
            style={{ borderRadius: '10px' }}
          >
            {line}
          </p>
          <div className="h-[12px] w-full"></div>
        </Fragment>
      ) : (
        <Fragment>
          <p>{line}</p>
          <div className="h-[8px] w-full"></div>
        </Fragment>
      )}
    </React.Fragment>
  ))
}

const imageToDataURL = (url: string) => {
  return fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        }),
    )
}

const App = (): JSX.Element => {
  const [data, setData] = useState<IThreadDataItem[]>([])
  const [imageResolution, setImageResolution] = useState({
    width: '256px',
    height: '144px',
  })
  const [author, setAuthor] = useState<IPostAuthor>()
  const [mode, setMode] = useState<'display' | 'print'>('display')

  useEffect(() => {
    const queryString = window.location.search
    const queryParams = new URLSearchParams(queryString)
    const threadData = queryParams.get('threadData')!
    const author = queryParams.get('author')!
    setData(JSON.parse(threadData))
    setAuthor(JSON.parse(author))
  }, [])

  const handleDownloadAllPDF = async () => {
    setMode('print')
    const pdf = new jsPDF('p', 'px', [800, 800])

    for (let i = 0; i < data!.length; i++) {
      const design = document.getElementById(`design-${i}`)
      if (design) {
        const canvas = await html2canvas(design, {
          scale: 2,
          useCORS: true,
          logging: true,
        })
        const imgData = canvas.toDataURL('image/png')

        if (i > 0) {
          pdf.addPage()
        }

        pdf.addImage(imgData, 'PNG', 0, 0, 800, 800)
      }
    }

    pdf.save(`${data![0].text.toLowerCase().split(' ').join('-')}.pdf`)
    setMode('display')
  }

  return (
    <CSSContainer>
      <div className="py-12 px-5">
        <div className="w-full flex justify-center items-center">
          <div
            className="fixed max-w-[500px] bg-white px-4 py-2 items-center shadow flex flex-row gap-5"
            style={{ borderRadius: '100px' }}
          >
            {data?.length} frames.
            <select
              onChange={(e) => {
                const value = (e.target as HTMLSelectElement).value
                const width = value.split('-')[0]
                const height = value.split('-')[1]
                const resolution = {
                  width,
                  height,
                }
                setImageResolution(resolution)
              }}
            >
              <option value="384px-216px">384x216</option>
              <option value="448px-252px">448x252</option>
              <option value="512px-288px">512x288</option>
            </select>
            <Button
              onClick={handleDownloadAllPDF}
              variant="outline"
              style={{ borderRadius: '20px' }}
              className="space-x-3"
            >
              Descargar <Download className="size-6" />
            </Button>
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-5 mt-12 justify-center items-center ">
          {data &&
            data.length > 0 &&
            data.map(({ text, image }, index: number) => (
              <CanvaDesign
                imageResolution={imageResolution}
                key={index}
                mode={mode}
                index={index}
                author={author as IPostAuthor}
                text={text}
                image={image}
              />
            ))}
        </div>
      </div>
    </CSSContainer>
  )
}

const CanvaDesign = ({
  text,
  image,
  index,
  author,
  imageResolution,
  mode,
}: {
  text: string
  index: number
  author: IPostAuthor
  imageResolution: { width: string; height: string }
  image?: string
  mode: 'display' | 'print'
}) => {
  const [imageBase64, setImageBase64] = useState<string | undefined>()

  useEffect(() => {
    if (image) {
      imageToDataURL(image).then((base64) => setImageBase64(base64 as string))
    }
  }, [image])

  return (
    <div id={`design-${index}`} className="flex flex-col items-center">
      <div
        className={cn(
          'w-[800px] h-[800px] bg-white py-12 flex flex-col items-center justify-start',
          mode === 'display' && 'border border-gray-100 shadow',
        )}
        style={mode === 'display' ? { borderRadius: '5px' } : {}}
      >
        <div className="max-w-[750px] min-w-[750px] h-full px-5">
          <div className="flex items-center justify-start">
            <div className="p-3 text-white flex items-center justify-start w-full">
              <span className="text-6xl text-gray-800/20">#{index + 1}</span>
            </div>
            <div className="flex items-center">
              <ArrowRight className="size-12 text-neutral-900" />
            </div>
          </div>
          <div className="w-full h-[22px]"></div>
          <p className="text-xl min-w-full tracking-tighter text-neutral-900 text-start">
            {formatTextWithLineBreaks(text)}
          </p>
          <div className="w-full h-[12px]"></div>
          {imageBase64 && (
            <FakeBackgroundImagePrimitive.Container
              style={{
                borderRadius: '5px',
                width: imageResolution.width,
                height: imageResolution.height,
              }}
              className={`aspect-w-16 aspect-h-9`}
            >
              <FakeBackgroundImagePrimitive.Image
                style={{ borderRadius: '5px' }}
                src={imageBase64}
                alt="Design"
              />
            </FakeBackgroundImagePrimitive.Container>
          )}
        </div>

        <div className="w-full flex justify-center items-center text-neutral-900">
          <div className="max-w-[750px] w-full px-5 flex flex-col">
            <div className="h-[1px] bg-gray-300 w-full my-8"></div>
            <div className="flex items-center">
              <div className="flex items-start gap-3 w-full">
                <img
                  style={{ borderRadius: '100px' }}
                  src={author.image}
                  className="w-[60px] h-[60px]"
                />
                <div>
                  <p>{author.name}</p>
                  <p className="text-gray-600 text-sm">{author.username}</p>
                </div>
              </div>
              <div className="text-gray-600 text-sm text-end">
                This carousel was autogenerated from an X thread using the&nbsp;
                <b>XSlide extension</b>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

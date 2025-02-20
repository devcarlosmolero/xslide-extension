import CSSContainer from '@/components/CSSContainer'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import '../../tailwind.css'

const App = (): JSX.Element => {
  return (
    <CSSContainer>
      <div className="p-5 min-w-[320px]">
        <Card>
          <CardHeader>
            <CardTitle>Popup</CardTitle>
            <CardDescription>If you see this, React is working!</CardDescription>
            <Separator />
            <pre>
              <code>{`process.env`}</code>
            </pre>
          </CardHeader>
        </Card>
      </div>
    </CSSContainer>
  )
}

export default App

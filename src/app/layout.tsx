import './globals.css'
import Providers from './Providers'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from './navbar'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Nyansapo Chat',
}

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html className="dark" lang="en">
        <Providers>
          <body className="h-[100dvh] overflow-y-auto flex flex-col">
            <Navbar />
            <Toaster />
            {children}
          </body>
        </Providers>
      </html>
    </ClerkProvider>
  )
}

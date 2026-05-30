import './globals.css'

export const metadata = {
  title: 'InsureIntel AI',
  description: 'Agentic Insurance RAG Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">{children}</body>
    </html>
  )
}
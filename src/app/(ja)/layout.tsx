import RootShell from '@/components/RootShell'
import { metadata as rootMetadata, viewport as rootViewport } from '@/lib/rootMetadata'

export const metadata = rootMetadata
export const viewport = rootViewport

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="ja">{children}</RootShell>
}

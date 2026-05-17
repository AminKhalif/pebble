import { notFound } from "next/navigation"
import { DemoWorksheetPage } from "@/components/pebble/demo-worksheet-page"
import { demoDomainsBySlug } from "@/lib/demo-examples"

type Props = {
  params: Promise<{
    demo: string
  }>
}

export default async function DemoPage({ params }: Props) {
  const { demo } = await params
  const domain = demoDomainsBySlug[demo]
  if (!domain) notFound()
  return <DemoWorksheetPage domain={domain} />
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// Live preview for local templates without media_url

import { useEffect, useState } from 'react'
import { getTemplateFile } from '@/service/templateLoader'
import { TemplateSummary } from '@/service/templateLoader'

const TemplatePreview = ({ tpl }: { tpl: TemplateSummary }) => {
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        // use localId so it always resolves to the local registry entry
        const mod = await getTemplateFile(tpl.category as any, String(tpl.localId))
        if (!cancelled && (mod as any)?.default) {
          setComp(() => (mod as any).default)
        }
      } catch {
        setComp(null)
      }
    }
    load()
    return () => { cancelled = true }
  }, [tpl.category, tpl.localId])

  if (!Comp) return <div className="w-full h-full bg-gray-50" />
  return (
    <div className="w-full h-full overflow-hidden bg-white">
      {/* scale down so it fits the 2:3 card nicely */}
      <div className="scale-[0.6] origin-top-left" style={{ width: '166.6667%', height: '166.6667%' }}>
        <Comp />
      </div>
    </div>
  )
}

export default TemplatePreview
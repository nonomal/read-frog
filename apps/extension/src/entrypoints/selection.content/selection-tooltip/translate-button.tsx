import { useAtomValue } from 'jotai'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { selectionContentAtom } from './atom'

export function TranslateButton() {
  const selectionContent = useAtomValue(selectionContentAtom)

  const handleClick = () => {
    logger.log('selectionContent', selectionContent)
  }

  return (
    <Button variant="ghost" size="iconSm" onClick={handleClick}>
      <Languages className="size-4" />
    </Button>
  )
}

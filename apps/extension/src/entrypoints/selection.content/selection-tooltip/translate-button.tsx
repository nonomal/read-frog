import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TranslateButton() {
  return (
    <Button variant="ghost" size="iconSm">
      <Languages className="size-4" />
    </Button>
  )
}

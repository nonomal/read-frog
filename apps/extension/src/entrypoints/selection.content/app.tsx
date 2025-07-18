import { NOTRANSLATE_CLASS } from '@/utils/constants/dom-labels'

export default function App() {
  return (
    <div className={cn('text-black dark:text-white', NOTRANSLATE_CLASS)}>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2147483647]">
        Hello World
      </div>
    </div>
  )
}

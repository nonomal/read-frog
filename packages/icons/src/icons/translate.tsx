import type { SVGProps } from 'react'
import { memo } from 'react'

function SvgTranslate(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      stroke={props.color || 'currentColor'}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <desc>Translate Streamline Icon: https://streamlinehq.com</desc>
      <path d="M3.333 10v1.333c0 .703.544 1.28 1.234 1.33l.1.004h2V14h-2A2.667 2.667 0 0 1 2 11.333V10zM12 6.667 14.933 14h-1.436l-.801-2H9.969l-.799 2H7.734l2.933-7.333zm-.667 1.923-.831 2.077h1.661zm-6-7.257v1.334H8v4.666H5.333v2H4v-2H1.333V2.667H4V1.333zm6 .667A2.667 2.667 0 0 1 14 4.667V6h-1.333V4.667c0-.737-.597-1.334-1.334-1.334h-2V2zM4 4H2.667v2H4zm2.667 0H5.333v2h1.334z" />
    </svg>
  )
}
const Memo = memo(SvgTranslate)
export default Memo

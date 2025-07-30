import type { Ref, SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
  strokeWidth?: number
  ref?: Ref<SVGSVGElement>
}

export function IconBase({
  size = 24,
  strokeWidth = 2,
  children,
  ref,
  ...rest
}: IconProps) {
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  )
}

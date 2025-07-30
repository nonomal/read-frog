import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const RAW_DIR = path.resolve(__dirname, '../raw')
const OUT_DIR = path.resolve(__dirname, '../src/icons')
fs.mkdirSync(OUT_DIR, { recursive: true })

// Helper function to convert PascalCase to kebab-case
function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

// 1. execute SVGR to convert .tsx (output to temporary directory)
execSync(
  [
    'pnpm',
    'svgr',
    '--out-dir',
    OUT_DIR,
    RAW_DIR,
  ].join(' '),
  { stdio: 'inherit' },
)

// 2. wrap to IconBase (very lightweight)
const files = fs
  .readdirSync(OUT_DIR)
  .filter(f => f.endsWith('.tsx'))

for (const file of files) {
  const componentName = path.basename(file, '.tsx') // Translate
  const kebabFileName = toKebabCase(componentName) // translate
  const newFileName = `${kebabFileName}.tsx` // translate.tsx
  const filePath = path.join(OUT_DIR, file)

  // Read the SVGR generated content
  const originalContent = fs.readFileSync(filePath, 'utf8')

  // Extract the JSX part from the SVGR component
  const svgMatch = originalContent.match(/<svg[\s\S]*?<\/svg>/)
  const svgContent = svgMatch ? svgMatch[0] : '<svg></svg>'

  // Create wrapper component
  const wrapped = `import { forwardRef } from "react";
import { IconBase, IconProps } from "../icon-base";

export const ${componentName} = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <IconBase ref={ref} {...props}>
    ${svgContent}
  </IconBase>
));
`

  // Write to kebab-case filename
  const finalPath = path.join(OUT_DIR, newFileName)
  fs.writeFileSync(finalPath, wrapped, 'utf8')

  // Remove original file if different name
  if (file !== newFileName) {
    fs.unlinkSync(filePath)
  }
}

// 3. generate barrel
const exportAll = files
  .map((f) => {
    const componentName = path.basename(f, '.tsx')
    const kebabFileName = toKebabCase(componentName)
    return `export * from "./${kebabFileName}";`
  })
  .join('\n')
fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), exportAll)

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement, type ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ChallengeReadmePageProps {
  params: {
    id: string
  }
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)

  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`

    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={key}>{token.slice(2, -2)}</strong>
    }

    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={key}>{token.slice(1, -1)}</code>
    }

    return token
  })
}

function renderMarkdown(markdown: string): ReactNode[] {
  const lines = markdown.replace(/\r/g, '').split('\n')
  const content: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = []
      index += 1
      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index])
        index += 1
      }
      index += 1
      content.push(
        <pre key={`code-${index}`}>
          <code>{codeLines.join('\n')}</code>
        </pre>,
      )
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      content.push(createElement(
        `h${level}`,
        { key: `heading-${index}` },
        renderInlineMarkdown(heading[2], `heading-${index}`),
      ))
      index += 1
      continue
    }

    if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(line)) {
      content.push(<hr key={`rule-${index}`} />)
      index += 1
      continue
    }

    const listItem = line.match(/^\s*([-*+] |\d+\. )(.+)$/)
    if (listItem) {
      const isOrdered = /^\d+\./.test(listItem[1])
      const items: string[] = []
      while (index < lines.length) {
        const item = lines[index].match(/^\s*([-*+] |\d+\. )(.+)$/)
        if (!item || /^\d+\./.test(item[1]) !== isOrdered) break
        items.push(item[2])
        index += 1
      }
      const List = isOrdered ? 'ol' : 'ul'
      content.push(
        <List key={`list-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`list-${index}-${itemIndex}`}>
              {renderInlineMarkdown(item, `list-${index}-${itemIndex}`)}
            </li>
          ))}
        </List>,
      )
      continue
    }

    const paragraphLines = [line]
    index += 1
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !lines[index].startsWith('```') &&
      !/^\s*([-*+] |\d+\. )/.test(lines[index]) &&
      !/^\s*(---+|\*\*\*+|___+)\s*$/.test(lines[index])
    ) {
      paragraphLines.push(lines[index])
      index += 1
    }
    content.push(
      <p key={`paragraph-${index}`}>
        {renderInlineMarkdown(paragraphLines.join(' '), `paragraph-${index}`)}
      </p>,
    )
  }

  return content
}

export default function ChallengeReadmePage({ params }: ChallengeReadmePageProps) {
  const challengesDirectory = join(process.cwd(), 'challenges')
  const challengeIds = readdirSync(challengesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  if (!challengeIds.includes(params.id)) {
    notFound()
  }

  let readme: string
  try {
    readme = readFileSync(
      join(challengesDirectory, params.id, 'README.md'),
      'utf-8',
    )
  } catch {
    notFound()
  }

  return (
    <main>
      <article style={{ maxWidth: 900, margin: '0 auto', padding: '2rem', lineHeight: 1.7 }}>
        <p><Link href="/">← Back to challenges</Link></p>
        {renderMarkdown(readme)}
      </article>
    </main>
  )
}

'use client';

// Builds a branded PDF from the advisor's Markdown and downloads it.
// Loaded on demand (dynamic import) so the PDF engine is not part of the page bundle.
import type { ReactNode } from 'react';
import { Document, Font, Link, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import { marked, type Token, type Tokens } from 'marked';

export interface PdfSection {
  /** Optional heading above the section (used when one PDF holds several deliverables). */
  heading?: string;
  /** Small line above the heading, e.g. "Etapa 2 de 8". */
  kicker?: string;
  markdown: string;
}

export interface DeliverablePdfOptions {
  title: string;
  /** Business name, shown under the title. */
  subtitle?: string;
  sections: PdfSection[];
  fileName: string;
  /** "Página" in the user's language. */
  pageLabel: string;
  /** Formatted date shown in the header. */
  dateLabel: string;
}

const COLORS = {
  ink: '#0f172a',
  body: '#1e293b',
  muted: '#64748b',
  line: '#e2e8f0',
  accent: '#2563eb',
  accentSoft: '#eff6ff',
  quote: '#f8fafc',
};

let fontsReady = false;
function registerFonts(base: string) {
  if (fontsReady) return;
  Font.register({
    family: 'Noto Sans',
    fonts: [
      { src: `${base}/NotoSans_400Regular.ttf`, fontWeight: 400 },
      { src: `${base}/NotoSans_400Regular_Italic.ttf`, fontWeight: 400, fontStyle: 'italic' },
      { src: `${base}/NotoSans_700Bold.ttf`, fontWeight: 700 },
      { src: `${base}/NotoSans_700Bold_Italic.ttf`, fontWeight: 700, fontStyle: 'italic' },
    ],
  });
  // Keep words whole instead of breaking them with hyphens.
  Font.registerHyphenationCallback((word) => [word]);
  fontsReady = true;
}

/** The embedded font has no emoji, check marks or arrows: replace or drop them. */
function clean(text: string): string {
  return text
    .replace(/[→⇒➜➡]/g, '›')
    .replace(/[←⇐⬅]/g, '‹')
    .replace(/[↑↓]/g, '·')
    .replace(/[✓✔✅☑]/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[‍︎️]/g, '')
    .replace(/[ \t]{2,}/g, ' ');
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Noto Sans',
    fontSize: 10.5,
    color: COLORS.body,
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 52,
  },
  // Line height lives on the content, not on the page: react-pdf drops the
  // page-number text when it inherits a line height.
  // Same font size as the page so the 1.55 ratio gives the intended spacing.
  content: { fontSize: 10.5, lineHeight: 1.55 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  brand: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: COLORS.ink },
  brandAccent: { color: COLORS.accent },
  date: { fontSize: 9, color: COLORS.muted },
  title: { fontSize: 22, fontWeight: 700, color: COLORS.ink, lineHeight: 1.25 },
  subtitle: { fontSize: 11, color: COLORS.muted, marginTop: 4 },
  rule: { height: 3, width: 48, backgroundColor: COLORS.accent, marginTop: 14, marginBottom: 22 },
  section: { marginBottom: 18 },
  sectionBreak: { borderTopWidth: 1, borderTopColor: COLORS.line, paddingTop: 18 },
  kicker: { fontSize: 8.5, fontWeight: 700, letterSpacing: 1, color: COLORS.accent, textTransform: 'uppercase' },
  sectionHeading: { fontSize: 16, fontWeight: 700, color: COLORS.ink, marginBottom: 10, marginTop: 2 },
  h1: { fontSize: 15, fontWeight: 700, color: COLORS.ink, marginTop: 12, marginBottom: 6 },
  h2: { fontSize: 13, fontWeight: 700, color: COLORS.ink, marginTop: 12, marginBottom: 5 },
  h3: { fontSize: 11.5, fontWeight: 700, color: COLORS.ink, marginTop: 10, marginBottom: 4 },
  paragraph: { marginBottom: 7 },
  listItem: { flexDirection: 'row', marginBottom: 3 },
  bullet: { width: 16, color: COLORS.accent, fontWeight: 700 },
  listBody: { flex: 1 },
  quote: {
    backgroundColor: COLORS.quote,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  code: {
    fontFamily: 'Noto Sans',
    backgroundColor: COLORS.quote,
    padding: 8,
    marginBottom: 8,
    fontSize: 9.5,
  },
  hr: { borderBottomWidth: 1, borderBottomColor: COLORS.line, marginVertical: 10 },
  table: { borderWidth: 1, borderColor: COLORS.line, marginBottom: 8 },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.line },
  th: { flex: 1, padding: 5, fontWeight: 700, backgroundColor: COLORS.accentSoft, fontSize: 9.5 },
  td: { flex: 1, padding: 5, fontSize: 9.5 },
  bold: { fontWeight: 700, color: COLORS.ink },
  italic: { fontStyle: 'italic' },
  link: { color: COLORS.accent, textDecoration: 'none' },
  footerLine: {
    position: 'absolute',
    bottom: 44,
    left: 52,
    right: 52,
    height: 1,
    backgroundColor: COLORS.line,
  },
  footerLeft: { position: 'absolute', bottom: 28, left: 52, right: 160, fontSize: 8.5, color: COLORS.muted },
  footerRight: { position: 'absolute', bottom: 28, right: 52, fontSize: 8.5, color: COLORS.muted },
});

function inline(tokens: Token[] | undefined, keyPrefix: string): ReactNode[] {
  if (!tokens) return [];
  return tokens.map((t, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (t.type) {
      case 'strong':
        return (
          <Text key={key} style={styles.bold}>
            {inline((t as Tokens.Strong).tokens, key)}
          </Text>
        );
      case 'em':
        return (
          <Text key={key} style={styles.italic}>
            {inline((t as Tokens.Em).tokens, key)}
          </Text>
        );
      case 'del':
        return <Text key={key}>{inline((t as Tokens.Del).tokens, key)}</Text>;
      case 'codespan':
        return <Text key={key}>{clean((t as Tokens.Codespan).text)}</Text>;
      case 'link': {
        const link = t as Tokens.Link;
        return (
          <Link key={key} src={link.href} style={styles.link}>
            {inline(link.tokens, key)}
          </Link>
        );
      }
      case 'br':
        return <Text key={key}>{'\n'}</Text>;
      case 'text': {
        const text = t as Tokens.Text;
        return text.tokens ? (
          <Text key={key}>{inline(text.tokens, key)}</Text>
        ) : (
          <Text key={key}>{clean(decode(text.text))}</Text>
        );
      }
      case 'escape':
        return <Text key={key}>{clean((t as Tokens.Escape).text)}</Text>;
      default:
        return 'text' in t && typeof t.text === 'string' ? <Text key={key}>{clean(decode(t.text))}</Text> : null;
    }
  });
}

/** marked escapes a few characters in raw text tokens. */
function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function blocks(tokens: Token[], keyPrefix: string): ReactNode[] {
  return tokens.map((t, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (t.type) {
      case 'heading': {
        const h = t as Tokens.Heading;
        const style = h.depth <= 1 ? styles.h1 : h.depth === 2 ? styles.h2 : styles.h3;
        return (
          <Text key={key} style={style} minPresenceAhead={40}>
            {inline(h.tokens, key)}
          </Text>
        );
      }
      case 'paragraph':
        return (
          <Text key={key} style={styles.paragraph}>
            {inline((t as Tokens.Paragraph).tokens, key)}
          </Text>
        );
      case 'text': {
        const text = t as Tokens.Text;
        return (
          <Text key={key} style={styles.paragraph}>
            {text.tokens ? inline(text.tokens, key) : clean(decode(text.text))}
          </Text>
        );
      }
      case 'list': {
        const list = t as Tokens.List;
        const start = typeof list.start === 'number' ? list.start : 1;
        return (
          <View key={key} style={{ marginBottom: 6 }}>
            {list.items.map((item, j) => (
              <View key={`${key}-${j}`} style={styles.listItem} wrap={false}>
                <Text style={styles.bullet}>{list.ordered ? `${start + j}.` : '•'}</Text>
                <View style={styles.listBody}>{listItemBody(item, `${key}-${j}`)}</View>
              </View>
            ))}
          </View>
        );
      }
      case 'blockquote':
        return (
          <View key={key} style={styles.quote}>
            {blocks((t as Tokens.Blockquote).tokens, key)}
          </View>
        );
      case 'code':
        return (
          <Text key={key} style={styles.code}>
            {clean((t as Tokens.Code).text)}
          </Text>
        );
      case 'hr':
        return <View key={key} style={styles.hr} />;
      case 'table': {
        const table = t as Tokens.Table;
        return (
          <View key={key} style={styles.table}>
            <View style={styles.tr}>
              {table.header.map((cell, j) => (
                <Text key={`${key}-h${j}`} style={styles.th}>
                  {inline(cell.tokens, `${key}-h${j}`)}
                </Text>
              ))}
            </View>
            {table.rows.map((row, r) => (
              <View key={`${key}-r${r}`} style={styles.tr} wrap={false}>
                {row.map((cell, j) => (
                  <Text key={`${key}-r${r}-${j}`} style={styles.td}>
                    {inline(cell.tokens, `${key}-r${r}-${j}`)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        );
      }
      default:
        return null;
    }
  });
}

function listItemBody(item: Tokens.ListItem, key: string): ReactNode[] {
  // Tight list items hold inline "text" tokens; loose ones hold paragraphs and nested lists.
  return item.tokens.map((t, i) => {
    const k = `${key}-${i}`;
    if (t.type === 'text') {
      const text = t as Tokens.Text;
      return <Text key={k}>{text.tokens ? inline(text.tokens, k) : clean(decode(text.text))}</Text>;
    }
    if (t.type === 'paragraph') {
      return <Text key={k}>{inline((t as Tokens.Paragraph).tokens, k)}</Text>;
    }
    return <View key={k}>{blocks([t], k)}</View>;
  });
}

/** The advisor starts deliverables with "✅ Entregable"; the PDF already has its own title. */
function withoutLeadingTitle(tokens: Token[]): Token[] {
  const first = tokens.findIndex((t) => t.type !== 'space');
  const head = tokens[first];
  if (head?.type === 'heading' && /[✅✔]/.test((head as Tokens.Heading).text)) {
    return tokens.slice(first + 1);
  }
  return tokens;
}

function DeliverableDocument({ options }: { options: DeliverablePdfOptions }) {
  const { title, subtitle, sections, pageLabel, dateLabel } = options;
  return (
    <Document title={clean(title)} author="LEVELGROW AI" creator="LEVELGROW AI" producer="LEVELGROW AI">
      <Page size="A4" style={styles.page} wrap>
        {/* Footer on every page: fixed elements go first so they repeat on each page. */}
        <Text
          style={styles.footerRight}
          fixed
          render={({ pageNumber, totalPages }) => `${pageLabel} ${pageNumber} / ${totalPages}`}
        />
        <View style={styles.footerLine} fixed />
        <Text style={styles.footerLeft} fixed>
          LEVELGROW AI · {clean(title)}
        </Text>
        <View style={styles.content}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>
              LEVELGROW <Text style={styles.brandAccent}>AI</Text>
            </Text>
            <Text style={styles.date}>{dateLabel}</Text>
          </View>
          <Text style={styles.title}>{clean(title)}</Text>
          {subtitle ? <Text style={styles.subtitle}>{clean(subtitle)}</Text> : null}
          <View style={styles.rule} />

          {sections.map((section, i) => (
            <View key={i} style={[styles.section, i > 0 ? styles.sectionBreak : {}]} break={false}>
              {section.kicker || section.heading ? (
                // Kicker and heading stay together, with some content after them.
                <View wrap={false} minPresenceAhead={60}>
                  {section.kicker ? <Text style={styles.kicker}>{clean(section.kicker)}</Text> : null}
                  {section.heading ? <Text style={styles.sectionHeading}>{clean(section.heading)}</Text> : null}
                </View>
              ) : null}
              {blocks(withoutLeadingTitle(marked.lexer(section.markdown)), `s${i}`)}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

/** Renders the PDF. `fontBase` defaults to this site's /fonts folder. */
export async function buildDeliverablePdf(options: DeliverablePdfOptions, fontBase?: string): Promise<Blob> {
  registerFonts(fontBase ?? `${window.location.origin}/fonts`);
  return pdf(<DeliverableDocument options={options} />).toBlob();
}

/** Generates the PDF in the browser and starts the download. */
export async function downloadDeliverablePdf(options: DeliverablePdfOptions): Promise<void> {
  const blob = await buildDeliverablePdf(options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = options.fileName.endsWith('.pdf') ? options.fileName : `${options.fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** "LEVELGROW AI - Cliente ideal - AURUM" -> "levelgrow-ai-cliente-ideal-aurum" */
export function pdfFileName(...parts: (string | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join(' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9Ѐ-ӿ]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

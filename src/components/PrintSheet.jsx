import { useRef, useState } from 'react'
import { exportarPng } from '../lib/exportImage.js'
import StickerCard from './StickerCard.jsx'
import './PrintSheet.css'

// A4 = 210 x 297 mm. Margem de impressão e espaçamento entre figurinhas.
const MARGEM = 8 // mm
const GAP = 4 // mm
const RATIO = 7 / 5 // altura / largura da figurinha

function calcularLayout(cols) {
  const areaW = 210 - MARGEM * 2
  const areaH = 297 - MARGEM * 2
  const cellW = (areaW - GAP * (cols - 1)) / cols
  const cellH = cellW * RATIO
  const rows = Math.max(1, Math.floor((areaH + GAP) / (cellH + GAP)))
  return { porPagina: cols * rows, cellW }
}

export default function PrintSheet({
  colecao,
  foils,
  resolverFundo,
  onQtd,
  onRemover,
  onEditar,
  onAdicionarAtual,
}) {
  const [cols, setCols] = useState(3)
  const [baixando, setBaixando] = useState(false)
  const pagesRef = useRef([])

  const { porPagina } = calcularLayout(cols)

  // Expande a coleção em uma lista plana (cada figurinha repetida pela qtd)
  const expandida = colecao.flatMap((item) =>
    Array.from({ length: item.qtd }, (_, i) => ({
      ...item,
      key: `${item.id}-${i}`,
    })),
  )

  // Divide em páginas A4
  const paginas = []
  for (let i = 0; i < expandida.length; i += porPagina) {
    paginas.push(expandida.slice(i, i + porPagina))
  }

  async function baixarFolhas() {
    setBaixando(true)
    try {
      for (let i = 0; i < pagesRef.current.length; i++) {
        const el = pagesRef.current[i]
        if (!el) continue
        const dataUrl = await exportarPng(el, { pixelRatio: 2 })
        const link = document.createElement('a')
        link.download =
          paginas.length > 1 ? `folha-a4-${i + 1}.png` : 'folha-a4.png'
        link.href = dataUrl
        link.click()
        await new Promise((r) => setTimeout(r, 250))
      }
    } catch (err) {
      console.error(err)
      alert('Não foi possível gerar a folha. Tente novamente.')
    } finally {
      setBaixando(false)
    }
  }

  if (colecao.length === 0) {
    return (
      <div className="sheet-empty">
        <h2>Nenhuma figurinha na folha ainda</h2>
        <p>
          Monte uma figurinha na aba <strong>Editor</strong> e clique em{' '}
          <em>"Adicionar à folha A4"</em>. Você pode adicionar várias diferentes
          e definir quantas cópias de cada.
        </p>
        <button className="btn btn--primary" onClick={onAdicionarAtual}>
          ＋ Adicionar a figurinha atual
        </button>
      </div>
    )
  }

  return (
    <div className="sheet">
      <div className="sheet__toolbar no-print">
        <div className="sheet__cols">
          <span>Figurinhas por linha:</span>
          {[3, 4, 5].map((c) => (
            <button
              key={c}
              className={'chip' + (c === cols ? ' chip--active' : '')}
              onClick={() => setCols(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="sheet__buttons">
          <button className="btn btn--ghost" onClick={() => window.print()}>
            🖨️ Imprimir
          </button>
          <button
            className="btn btn--primary"
            onClick={baixarFolhas}
            disabled={baixando}
          >
            {baixando ? 'Gerando…' : '↓ Baixar folha PNG'}
          </button>
        </div>
      </div>

      <div className="sheet__list no-print">
        {colecao.map((item) => (
          <div className="sheet__item" key={item.id}>
            <span className="sheet__item-name">
              {item.data.nome || 'Sem nome'}
            </span>
            <label className="sheet__qtd">
              cópias
              <input
                type="number"
                min={1}
                value={item.qtd}
                onChange={(e) => onQtd(item.id, parseInt(e.target.value, 10))}
              />
            </label>
            <button className="sheet__editar" onClick={() => onEditar(item)}>
              ✏️ editar
            </button>
            <button className="btn-clear" onClick={() => onRemover(item.id)}>
              remover
            </button>
          </div>
        ))}
      </div>

      <p className="hint no-print">
        {expandida.length} figurinha(s) · {paginas.length} folha(s) A4. Imprima em
        tamanho real (100%, sem "ajustar à página") e recorte.
      </p>

      <div className="sheet__pages print-area">
        {paginas.map((pagina, p) => (
          <div
            key={p}
            className="a4"
            ref={(el) => (pagesRef.current[p] = el)}
            style={{ '--cols': cols }}
          >
            <div className="a4__grid">
              {pagina.map((item) => (
                <div className="a4__cell" key={item.key}>
                  <StickerCard
                    data={item.data}
                    foto={item.foto}
                    emblema={item.emblema}
                    selo={item.selo}
                    fundoUrl={resolverFundo(item.data, item.bgImagem)}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

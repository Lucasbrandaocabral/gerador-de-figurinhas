import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import StickerCard from './components/StickerCard.jsx'
import PrintSheet from './components/PrintSheet.jsx'
import './App.css'

const PALETTES = [
  { name: 'Azul / Verde', primary: '#29abe2', secondary: '#1f9d4d' },
  { name: 'Verde', primary: '#0e7a4b', secondary: '#0a5c38' },
  { name: 'Roxo', primary: '#6a3fb5', secondary: '#4d2a8a' },
  { name: 'Vermelho', primary: '#d63a3a', secondary: '#a32626' },
  { name: 'Grafite', primary: '#26313f', secondary: '#161d26' },
  { name: 'Coral', primary: '#ef6b4f', secondary: '#c24a32' },
]

const INITIAL = {
  nome: 'MARIA SILVA',
  numero: '26',
  sigla: 'NSP',
  linhaDados: '5-2-1992 | 1,75m | 68 kg',
  grupo: 'NAISPD (SP)',
  iniciaisEmblema: 'NP',
  selo: '2026',
  primary: '#29abe2',
  secondary: '#1f9d4d',
}

let proximoId = 1

export default function App() {
  const [aba, setAba] = useState('editor')
  const [data, setData] = useState(INITIAL)
  const [foto, setFoto] = useState(null)
  const [emblema, setEmblema] = useState(null)
  const [selb, setSelo] = useState(null)
  const [baixando, setBaixando] = useState(false)
  const [colecao, setColecao] = useState([])
  const cardRef = useRef(null)

  function update(field, value) {
    setData((d) => ({ ...d, [field]: value }))
  }

  function lerArquivo(file, setter) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setter(e.target.result)
    reader.readAsDataURL(file)
  }

  function aplicarPaleta(p) {
    setData((d) => ({ ...d, primary: p.primary, secondary: p.secondary }))
  }

  function adicionarAFolha() {
    setColecao((c) => [
      ...c,
      { id: proximoId++, data: { ...data }, foto, emblema, selo: selb, qtd: 8 },
    ])
  }

  function atualizarQtd(id, qtd) {
    setColecao((c) =>
      c.map((item) =>
        item.id === id ? { ...item, qtd: Math.max(1, qtd || 1) } : item,
      ),
    )
  }

  function removerDaFolha(id) {
    setColecao((c) => c.filter((item) => item.id !== id))
  }

  async function baixarPng() {
    if (!cardRef.current) return
    setBaixando(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      })
      const link = document.createElement('a')
      const nomeArquivo = (data.nome || 'figurinha')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      link.download = `figurinha-${nomeArquivo || 'naispd'}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
      alert('Não foi possível gerar a imagem. Tente novamente.')
    } finally {
      setBaixando(false)
    }
  }

  const totalNaFolha = colecao.reduce((s, item) => s + item.qtd, 0)

  return (
    <div className="app">
      <header className="app__header">
        <h1>GERADOR DE FIGURINHAS</h1>
        <p>Estilo álbum de coleção · NAISPD</p>
      </header>

      <nav className="tabs">
        <button
          className={'tab' + (aba === 'editor' ? ' tab--active' : '')}
          onClick={() => setAba('editor')}
        >
          Editor
        </button>
        <button
          className={'tab' + (aba === 'folha' ? ' tab--active' : '')}
          onClick={() => setAba('folha')}
        >
          Folha A4 {totalNaFolha > 0 && <span className="tab__badge">{totalNaFolha}</span>}
        </button>
      </nav>

      {aba === 'editor' ? (
        <div className="layout">
          <section className="controls">
            <Field label="Foto da pessoa">
              <label className="upload">
                📷 Escolher / trocar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => lerArquivo(e.target.files[0], setFoto)}
                  hidden
                />
              </label>
            </Field>

            <Field label="Nome (em destaque)">
              <input
                value={data.nome}
                onChange={(e) => update('nome', e.target.value)}
              />
            </Field>

            <div className="grid-2">
              <Field label="Numerão de fundo">
                <input
                  value={data.numero}
                  onChange={(e) => update('numero', e.target.value)}
                />
              </Field>
              <Field label="Sigla (3 letras)">
                <input
                  maxLength={3}
                  value={data.sigla}
                  onChange={(e) => update('sigla', e.target.value.toUpperCase())}
                />
              </Field>
            </div>

            <Field label="Linha de dados">
              <input
                value={data.linhaDados}
                onChange={(e) => update('linhaDados', e.target.value)}
              />
            </Field>

            <Field label="Grupo / unidade">
              <input
                value={data.grupo}
                onChange={(e) => update('grupo', e.target.value)}
              />
            </Field>

            <div className="grid-2">
              <Field label="Iniciais do emblema (se sem imagem)">
                <input
                  maxLength={3}
                  value={data.iniciaisEmblema}
                  onChange={(e) =>
                    update('iniciaisEmblema', e.target.value.toUpperCase())
                  }
                />
              </Field>
              <Field label="Selo (canto) (se sem imagem)">
                <input
                  value={data.selo}
                  onChange={(e) => update('selo', e.target.value)}
                />
              </Field>
            </div>

            <Field label="Logo do emblema (canto superior — no lugar da FIFA)">
              <div className="upload-row">
                <label className="upload upload--sm">
                  🛡️ Enviar imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => lerArquivo(e.target.files[0], setEmblema)}
                    hidden
                  />
                </label>
                {emblema && (
                  <button className="btn-clear" onClick={() => setEmblema(null)}>
                    remover
                  </button>
                )}
              </div>
            </Field>

            <Field label="Selo do canto inferior (no lugar da Panini)">
              <div className="upload-row">
                <label className="upload upload--sm">
                  🏷️ Enviar imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => lerArquivo(e.target.files[0], setSelo)}
                    hidden
                  />
                </label>
                {selb && (
                  <button className="btn-clear" onClick={() => setSelo(null)}>
                    remover
                  </button>
                )}
              </div>
            </Field>

            <Field label="Paleta rápida">
              <div className="palette">
                {PALETTES.map((p) => (
                  <button
                    key={p.name}
                    title={p.name}
                    className={
                      'swatch' +
                      (p.primary === data.primary ? ' swatch--active' : '')
                    }
                    style={{
                      background: `linear-gradient(135deg, ${p.primary} 0 50%, ${p.secondary} 50% 100%)`,
                    }}
                    onClick={() => aplicarPaleta(p)}
                  />
                ))}
              </div>
            </Field>

            <Field label="Cores personalizadas">
              <div className="grid-2">
                <label className="color-pick">
                  <span>Fundo</span>
                  <input
                    type="color"
                    value={data.primary}
                    onChange={(e) => update('primary', e.target.value)}
                  />
                </label>
                <label className="color-pick">
                  <span>Destaque</span>
                  <input
                    type="color"
                    value={data.secondary}
                    onChange={(e) => update('secondary', e.target.value)}
                  />
                </label>
              </div>
            </Field>
          </section>

          <section className="preview">
            <div className="preview__actions">
              <button
                className="btn btn--primary"
                onClick={baixarPng}
                disabled={baixando}
              >
                {baixando ? 'Gerando…' : '↓ Baixar PNG'}
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => setFoto(null)}
                disabled={!foto}
              >
                Limpar foto
              </button>
            </div>
            <button className="btn btn--add" onClick={adicionarAFolha}>
              ＋ Adicionar à folha A4
            </button>
            <p className="hint">
              Dica: foto de rosto/busto com a pessoa olhando pra frente fica mais
              parecida com figurinha. Monte várias e use a aba "Folha A4" para
              imprimir tudo numa página só e recortar.
            </p>

            <StickerCard
              ref={cardRef}
              data={data}
              foto={foto}
              emblema={emblema}
              selo={selb}
            />
          </section>
        </div>
      ) : (
        <PrintSheet
          colecao={colecao}
          onQtd={atualizarQtd}
          onRemover={removerDaFolha}
          onAdicionarAtual={adicionarAFolha}
        />
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="field">
      <span className="field__label">{label}</span>
      {children}
    </div>
  )
}

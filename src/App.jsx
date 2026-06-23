import { useEffect, useRef, useState } from 'react'
import { exportarPng } from './lib/exportImage.js'
import { gerarFoilDataUrl, TIPOS_FOIL } from './lib/foil.js'
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

const FUNDOS = [
  { id: 'cor', nome: 'Cor' },
  { id: 'ouro', nome: '✨ Ouro' },
  { id: 'prata', nome: '✨ Prata' },
  { id: 'bronze', nome: '✨ Bronze' },
]

const INITIAL = {
  nome: 'MARIA SILVA',
  numero: '26',
  sigla: 'NSP',
  linhaDados: '5-2-1992 | 1,75m | 68 kg',
  grupo: 'EQUIPE (BR)',
  iniciaisEmblema: 'NP',
  selo: '2026',
  primary: '#29abe2',
  secondary: '#1f9d4d',
  fundo: 'cor',
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
  const [removerFundo, setRemoverFundo] = useState(true)
  const [processandoFoto, setProcessandoFoto] = useState(false)
  const [foils, setFoils] = useState({})
  const [bgImagem, setBgImagem] = useState(null)
  const cardRef = useRef(null)

  // Gera as texturas metálicas (ouro/prata/bronze) uma vez ao abrir.
  useEffect(() => {
    let ativo = true
    Promise.all(TIPOS_FOIL.map((t) => gerarFoilDataUrl(t))).then((urls) => {
      if (!ativo) return
      const mapa = {}
      TIPOS_FOIL.forEach((t, i) => (mapa[t] = urls[i]))
      setFoils(mapa)
    })
    return () => {
      ativo = false
    }
  }, [])

  function update(field, value) {
    setData((d) => ({ ...d, [field]: value }))
  }

  function lerArquivo(file, setter) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setter(e.target.result)
    reader.readAsDataURL(file)
  }

  function blobParaDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  async function aoEscolherFoto(file) {
    if (!file) return
    // Mostra a foto original imediatamente
    setFoto(await blobParaDataURL(file))
    if (!removerFundo) return
    // Remove o fundo para deixar igual ao original (recorte da pessoa)
    setProcessandoFoto(true)
    try {
      const { removeBackground } = await import('@imgly/background-removal')
      const blob = await removeBackground(file)
      setFoto(await blobParaDataURL(blob))
    } catch (err) {
      console.error('Falha ao remover o fundo:', err)
      alert(
        'Não consegui remover o fundo automaticamente (pode ser falta de internet). ' +
          'A foto foi mantida como está — você pode usar uma imagem já recortada (PNG transparente).',
      )
    } finally {
      setProcessandoFoto(false)
    }
  }

  function aplicarPaleta(p) {
    setData((d) => ({ ...d, primary: p.primary, secondary: p.secondary }))
  }

  function adicionarAFolha() {
    setColecao((c) => [
      ...c,
      {
        id: proximoId++,
        data: { ...data },
        foto,
        emblema,
        selo: selb,
        bgImagem,
        qtd: 1,
      },
    ])
  }

  // Fundo a usar na figurinha: imagem enviada manda; senão, a textura metálica.
  function resolverFundo(d, bg) {
    if (bg) return bg
    if (d.fundo && d.fundo !== 'cor') return foils[d.fundo] || null
    return null
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

  // Abre uma figurinha da folha de volta no editor (e tira ela da folha).
  function editarDaFolha(item) {
    setData({ ...item.data })
    setFoto(item.foto)
    setEmblema(item.emblema)
    setSelo(item.selo)
    setBgImagem(item.bgImagem || null)
    removerDaFolha(item.id)
    setAba('editor')
  }

  async function baixarPng() {
    if (!cardRef.current) return
    setBaixando(true)
    try {
      const dataUrl = await exportarPng(cardRef.current, { pixelRatio: 3 })
      const link = document.createElement('a')
      const nomeArquivo = (data.nome || 'figurinha')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      link.download = `figurinha-${nomeArquivo || 'figurinha'}.png`
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
        <p>Estilo álbum de coleção</p>
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
                  onChange={(e) => aoEscolherFoto(e.target.files[0])}
                  hidden
                />
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={removerFundo}
                  onChange={(e) => setRemoverFundo(e.target.checked)}
                />
                Remover fundo automaticamente (deixa igual ao original)
              </label>
              {processandoFoto && (
                <span className="processando">⏳ Removendo o fundo da foto…</span>
              )}
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

            <Field label="Edição especial (fundo metálico)">
              <div className="fundos">
                {FUNDOS.map((f) => (
                  <button
                    key={f.id}
                    className={
                      'fundo-chip fundo-chip--' +
                      f.id +
                      (data.fundo === f.id && !bgImagem
                        ? ' fundo-chip--active'
                        : '')
                    }
                    onClick={() => update('fundo', f.id)}
                  >
                    {f.nome}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Imagem de fundo (opcional — substitui o fundo acima)">
              <div className="upload-row">
                <label className="upload upload--sm">
                  🖼️ Enviar imagem de fundo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => lerArquivo(e.target.files[0], setBgImagem)}
                    hidden
                  />
                </label>
                {bgImagem && (
                  <button className="btn-clear" onClick={() => setBgImagem(null)}>
                    remover
                  </button>
                )}
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
              fundoUrl={resolverFundo(data, bgImagem)}
            />
          </section>
        </div>
      ) : (
        <PrintSheet
          colecao={colecao}
          foils={foils}
          resolverFundo={resolverFundo}
          onQtd={atualizarQtd}
          onRemover={removerDaFolha}
          onEditar={editarDaFolha}
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

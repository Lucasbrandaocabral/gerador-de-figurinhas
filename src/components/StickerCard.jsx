import { forwardRef } from 'react'
import './StickerCard.css'

const StickerCard = forwardRef(function StickerCard(
  { data, foto, emblema, selo, compact = false },
  ref,
) {
  return (
    <div className={'sticker' + (compact ? ' sticker--compact' : '')} ref={ref}>
      <div
        className="sticker__inner"
        style={{
          '--primary': data.primary,
          '--secondary': data.secondary,
        }}
      >
        {/* Numerão de fundo */}
        <div className="sticker__number">{data.numero}</div>

        {/* Foto da pessoa */}
        <div className="sticker__photo">
          {foto ? (
            <img src={foto} alt="Foto" />
          ) : (
            <div className="sticker__photo-placeholder">
              Adicione uma foto
              <br />
              no painel ao lado
            </div>
          )}
        </div>

        {/* Emblema (canto superior direito — lugar da FIFA) */}
        <div className="sticker__emblem">
          {emblema ? (
            <img src={emblema} alt="Emblema" />
          ) : (
            <span>{data.iniciaisEmblema}</span>
          )}
        </div>

        {/* Sigla vertical na lateral (lugar do BRA) */}
        <div className="sticker__sigla">{data.sigla}</div>

        {/* Faixas inferiores */}
        <div className="sticker__bands">
          <div className="band band--name">{data.nome}</div>
          <div className="band band--data">{data.linhaDados}</div>
          <div className="band band--group">{data.grupo}</div>
        </div>

        {/* Selo do canto (lugar da Panini) */}
        <div className="sticker__seal">
          {selo ? <img src={selo} alt="Selo" /> : <span>{data.selo}</span>}
        </div>
      </div>
    </div>
  )
})

export default StickerCard

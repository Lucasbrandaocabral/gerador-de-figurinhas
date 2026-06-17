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
        {/* Numerão de fundo (verde na frente, amarelo deslocado atrás) */}
        <div className="sticker__number">
          <span className="sticker__number-back">{data.numero}</span>
          <span className="sticker__number-front">{data.numero}</span>
        </div>

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

        {/* Lateral: gota com a bandeira do Brasil + sigla vazada (lugar do BRA) */}
        <div className="sticker__country">
          <div className="sticker__flag">
            <svg viewBox="0 0 28 20" aria-label="Bandeira do Brasil">
              <rect width="28" height="20" fill="#009b3a" />
              <polygon points="14,2.5 25.5,10 14,17.5 2.5,10" fill="#fedf00" />
              <circle cx="14" cy="10" r="4.3" fill="#002776" />
              <path
                d="M10.1 8.7 Q14 7.4 17.9 9.3"
                stroke="#fff"
                strokeWidth="0.9"
                fill="none"
              />
            </svg>
          </div>
          <div className="sticker__code">{data.sigla}</div>
        </div>

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

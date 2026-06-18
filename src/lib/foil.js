// Gera texturas de "papel metálico amassado" (ouro/prata/bronze) usando um
// filtro SVG (turbulência + iluminação) e as "assa" em PNG via canvas. Assim a
// textura fica num PNG comum, que exporta/imprime sem problema. O resultado de
// cada tipo é memorizado (gerado uma vez só).

const TINTAS = {
  ouro: ['#fff3c4', '#dcb645', '#9c7414', 7],
  prata: ['#ffffff', '#c6ccd1', '#7c838b', 21],
  bronze: ['#f6d3aa', '#c0824a', '#6f3f18', 33],
}

function svgFoil([c1, c2, c3, seed]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="0.4" stop-color="${c2}"/>
      <stop offset="0.65" stop-color="${c3}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <filter id="bump">
      <feTurbulence type="fractalNoise" baseFrequency="0.009 0.012" numOctaves="5" seed="${seed}" result="n"/>
      <feDiffuseLighting in="n" surfaceScale="4.5" diffuseConstant="1" lighting-color="#bdbdbd">
        <feDistantLight azimuth="230" elevation="50"/>
      </feDiffuseLighting>
    </filter>
    <filter id="spark">
      <feTurbulence type="fractalNoise" baseFrequency="0.009 0.012" numOctaves="5" seed="${seed}" result="n"/>
      <feSpecularLighting in="n" surfaceScale="5" specularConstant="0.9" specularExponent="11" lighting-color="#ffffff">
        <feDistantLight azimuth="230" elevation="55"/>
      </feSpecularLighting>
    </filter>
  </defs>
  <rect width="600" height="840" fill="url(#g)"/>
  <rect width="600" height="840" filter="url(#bump)" style="mix-blend-mode:overlay"/>
  <rect width="600" height="840" filter="url(#spark)" opacity="0.35" style="mix-blend-mode:screen"/>
</svg>`
}

const cache = {}

export function gerarFoilDataUrl(tipo) {
  if (!TINTAS[tipo]) return Promise.resolve(null)
  if (cache[tipo]) return cache[tipo]
  const promessa = new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 600
      canvas.height = 840
      canvas.getContext('2d').drawImage(img, 0, 0, 600, 840)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
    img.src =
      'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgFoil(TINTAS[tipo]))
  })
  cache[tipo] = promessa
  return promessa
}

export const TIPOS_FOIL = Object.keys(TINTAS)

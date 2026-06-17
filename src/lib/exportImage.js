import { toPng } from 'html-to-image'

// Alguns navegadores (sobretudo em celular) entregam a imagem girada 90°.
// Se o resultado vier "deitado" quando deveria ser em pé, giramos de volta.
function corrigirOrientacao(dataUrl, retrato) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const precisaGirar = retrato
        ? img.width > img.height
        : img.height > img.width
      if (!precisaGirar) return resolve(dataUrl)
      const canvas = document.createElement('canvas')
      canvas.width = img.height
      canvas.height = img.width
      const ctx = canvas.getContext('2d')
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(Math.PI / 2)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

// Importante: passe o elemento que é o "container" das fontes (o card em si).
// A biblioteca define a largura do elemento raiz no clone, então as unidades
// de container query (cqw) ficam corretas. Capturar um elemento pai faria o
// conteúdo estourar/cortar.
export async function exportarPng(el, { pixelRatio = 3, retrato = true } = {}) {
  // a primeira passada "aquece" (fontes/imagens); a segunda sai consistente
  await toPng(el, { pixelRatio, cacheBust: true })
  const dataUrl = await toPng(el, { pixelRatio, cacheBust: true })
  return corrigirOrientacao(dataUrl, retrato)
}

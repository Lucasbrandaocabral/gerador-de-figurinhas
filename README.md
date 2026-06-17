# Gerador de Figurinhas · NAISPD

App em React (Vite) que cria figurinhas no estilo álbum de coleção da Copa do
Mundo, mas pensado para o seu trabalho no **NAISPD**. No lugar dos logos da FIFA
e da Panini você sobe **suas próprias imagens** (emblema e selo).

## Recursos

- Foto da pessoa (rosto/busto) com pré-visualização ao vivo
- Numerão de fundo gigante, igual às figurinhas
- Nome em destaque, linha de dados, grupo/unidade e sigla de 3 letras
- **Emblema** no canto superior (no lugar da FIFA): envie sua imagem ou use iniciais
- **Selo** no canto inferior (no lugar da Panini): envie sua imagem ou use texto
- Paleta de cores rápida + cores personalizadas (fundo e destaque)
- Botão **Baixar PNG** em alta resolução
- Botão **Limpar foto**
- **Folha A4 para impressão:** adicione várias figurinhas (diferentes ou não),
  defina quantas cópias de cada, escolha quantas por linha (3, 4 ou 5) e
  **imprima** ou **baixe a folha em PNG** pronta para recortar

## Como montar a folha A4

1. Na aba **Editor**, monte uma figurinha.
2. Clique em **"＋ Adicionar à folha A4"**.
3. Repita para outras pessoas, se quiser.
4. Abra a aba **Folha A4**, ajuste as cópias de cada uma e o número por linha.
5. Clique em **Imprimir** (imprima em tamanho real / 100%, sem "ajustar à
   página") ou em **Baixar folha PNG**. Depois é só recortar.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (normalmente http://localhost:5173).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Onde colocar os logos do NAISPD

- **Emblema (canto superior):** campo "Logo do emblema". Use um PNG com fundo
  transparente para ficar mais bonito.
- **Selo (canto inferior):** campo "Selo do canto inferior".

Enquanto você não envia as imagens, o app mostra as iniciais/textos definidos
nos campos correspondentes.

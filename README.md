# Gerador de Figurinhas

Página web (React + Vite) para criar **figurinhas personalizadas** no estilo dos
álbuns de coleção de Copa do Mundo. Você monta a figurinha de cada pessoa, baixa
em PNG e ainda pode montar uma folha A4 com várias para imprimir e recortar.

## Para que serve

Serve para gerar, de forma simples e no navegador, figurinhas colecionáveis com
a cara de álbum esportivo: foto da pessoa, numerão de fundo, nome em destaque,
linha de dados, grupo/equipe, sigla na lateral com bandeira e até edições
especiais com fundo metálico. Ótimo para eventos, brincadeiras, equipes,
turmas e coleções personalizadas.

Tudo é processado **no próprio navegador** — nenhuma imagem é enviada para fora.

## Recursos

- **Foto da pessoa** com pré-visualização ao vivo
- **Remoção automática de fundo** da foto (opcional): recorta a pessoa para o
  numerão aparecer em volta, como no original. Também aceita imagem já recortada
  (PNG transparente)
- **Numerão de fundo** grande com efeito de relevo
- **Nome, linha de dados, grupo/equipe** e **sigla** de 3 letras
- **Sigla lateral** com a **bandeira** e o emblema no canto
- **Edições especiais** com fundo metálico (ouro, prata e bronze)
- **Imagem de fundo própria** (opcional), que substitui o fundo
- **Paleta de cores** rápida + cores personalizadas
- **Baixar PNG** em alta resolução
- **Folha A4 para impressão:** adicione várias figurinhas, defina as cópias de
  cada uma, escolha quantas por linha (3, 4 ou 5) e imprima ou baixe a folha em
  PNG, com **linhas de corte** para facilitar o recorte
- Botão **editar** para reabrir uma figurinha da folha e ajustar

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

## Como montar a folha A4

1. No **Editor**, monte uma figurinha.
2. Clique em **"＋ Adicionar à folha A4"**.
3. Repita para outras pessoas, se quiser.
4. Abra a aba **Folha A4**, ajuste as cópias de cada uma e o número por linha.
5. Clique em **Imprimir** (em tamanho real / 100%, sem "ajustar à página") ou em
   **Baixar folha PNG**. Depois é só recortar pelas linhas de corte.

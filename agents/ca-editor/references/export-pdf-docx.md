# Exportar para PDF e DOCX

A ferramenta padrão é o **Pandoc** (converte Markdown para quase tudo). Verifique
se está disponível antes: `pandoc --version`.

## DOCX

```bash
pandoc materiais/<slug>/material.md \
  -o materiais/<slug>/exports/material.docx \
  --toc --toc-depth=2
```

- Para incluir a avaliação, concatene os arquivos:
  `pandoc material.md avaliacao.md -o exports/material.docx`.
- Um `--reference-doc=modelo.docx` permite aplicar estilos de um template Word.

## PDF

O caminho mais robusto e sem depender de LaTeX instalado é converter para HTML e
imprimir, mas se houver um engine LaTeX (TeX Live/MiKTeX), o Pandoc gera PDF
direto:

```bash
# Requer um engine LaTeX (xelatex recomendado para acentuação/UTF-8):
pandoc material.md -o exports/material.pdf \
  --toc --pdf-engine=xelatex -V lang=pt-BR -V geometry:margin=2.5cm
```

Se `xelatex`/`pdflatex` não existirem, tente `--pdf-engine=weasyprint` ou
`--pdf-engine=wkhtmltopdf` (se instalados).

## Fallback (nenhum engine de PDF disponível)

1. Gere HTML autocontido:
   ```bash
   pandoc material.md -o exports/material.html -s --toc --metadata lang=pt-BR
   ```
2. Oriente o usuário a abrir o HTML no navegador e usar **Imprimir → Salvar como
   PDF**.

Se o **próprio Pandoc** não estiver instalado, avise e sugira instalá-lo
(https://pandoc.org/installing.html) ou usar a saída LaTeX/HTML. Nunca falhe em
silêncio: informe o que faltou e o caminho alternativo.

## Boas práticas

- Sempre `-V lang=pt-BR` / `--metadata lang=pt-BR` para hifenização correta.
- `--toc` para materiais longos (apostila, livro).
- Garanta que imagens referenciadas em `material.md` existam (ou foram geradas em
  `exports/visual/`) antes de exportar.

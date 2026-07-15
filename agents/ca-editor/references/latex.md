# Gerar LaTeX (.tex) sob demanda

Gere `.tex` quando o usuário pedir explicitamente LaTeX (para editar no Overleaf,
padronizar com identidade da instituição, ou compor apostilas/livros com rigor
tipográfico).

## Caminho recomendado: Pandoc + template

O Pandoc converte o Markdown preservando títulos, listas, tabelas e **fórmulas
matemáticas** (`$...$`, `$$...$$`):

```bash
pandoc materiais/<slug>/material.md \
  -o materiais/<slug>/exports/material.tex \
  --standalone \
  --template=<caminho>/assets/template.tex \
  -V lang=pt-BR
```

O `assets/template.tex` (ao lado desta referência, em `ca-editor/assets/`) já traz
preâmbulo com suporte a UTF-8/português, margens e pacotes comuns. Ajuste título,
autor e instituição via metadados YAML no topo do `material.md` ou variáveis
`-V titulo=... -V autor=...`.

## Sem Pandoc

Se o Pandoc não estiver disponível, produza o `.tex` manualmente a partir do
`assets/template.tex`: copie o preâmbulo e converta o corpo do Markdown para
LaTeX (títulos → `\section`/`\subsection`; listas → `itemize`/`enumerate`;
tabelas → `tabular`; ênfases → `\textbf`/`\emph`; fórmulas já em LaTeX passam
direto). Preencha `\title`, `\author` e o `document`.

## Compilar

```bash
# xelatex lida melhor com acentuação/UTF-8 e fontes:
xelatex -interaction=nonstopmode -output-directory=materiais/<slug>/exports \
  materiais/<slug>/exports/material.tex
```

Se não houver engine LaTeX local, entregue o `.tex` e sugira o **Overleaf**
(compila online, sem instalação).

## Dicas

- Mantenha as fórmulas em LaTeX já no `material.md` — assim atravessam para o
  `.tex`, o PDF e (como texto) o Mira sem retrabalho.
- Para apostila/livro, considere a classe `report`/`book`; para artigo/aula
  curta, `article` (padrão do template).

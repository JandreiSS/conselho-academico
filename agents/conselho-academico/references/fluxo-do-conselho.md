# Fluxo do conselho e artefatos

## Pasta de trabalho

Todo material vive em `materiais/<slug>/`. O `<slug>` deriva do tema + público
(ex.: `fracoes-5ano`, `revolucao-francesa-em`, `intro-python-superior`).

Artefatos, na ordem em que surgem:

```
materiais/<slug>/
  briefing.md            # Coordenador — o pedido estruturado
  plano-pedagogico.md    # ca-designer-instrucional
  pesquisa.md            # ca-pesquisador
  material.md            # ca-redator — o entregável principal
  avaliacao.md           # ca-avaliador (se houver avaliação)
  relatorio-revisao.md   # ca-revisor
  exports/               # ca-editor
    material.pdf | material.docx | material.tex
    mira-briefing.md     # pronto para virar slides no Mira
    visual/              # capas, infográficos (se pedido)
```

## Modelo de `briefing.md`

```markdown
# Briefing: [título do material]
**Tipo:** [roteiro de aula | plano de aula | sequência | apostila | livro | e-book | exercícios]
**Disciplina/Tema:** [...]
**Público/Nível:** [ano/série ou etapa]
**Data:** [YYYY-MM-DD]

## Objetivo pedagógico
[o que o estudante deve aprender / ser capaz de fazer, em 1–2 frases]

## Escopo e extensão
[duração da aula / número de páginas / nº de capítulos / nº de questões]

## Formatos de saída
[Markdown; PDF/DOCX; LaTeX; mira-briefing; visual]

## Fontes
[fontes vinculadas usadas ou "sem fontes — pesquisar do zero"]

## Restrições e observações
[currículo/BNCC, contexto da turma, preferências de tom, prazos]
```

## Pontos de aprovação

1. **Após o briefing/plano** (Passo 2): confirmar tipo, objetivos e estrutura
   antes de produzir.
2. **Antes da entrega** (Passo 4): revisar o material com o usuário antes de
   exportar/gerar visual, se o material for extenso.

Mantenha o usuário no controle. Ele é um educador: apresente escolhas
pedagógicas de forma transparente e aceite ajustes a qualquer momento.

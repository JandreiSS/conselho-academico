# Arquitetura

O Conselho Acadêmico é um **pacote de skills** para o Claude Code, distribuído
como um CLI Node publicável (modelo do `mira-animator`).

## Duas partes

1. **As skills** (`agents/`) — o "conselho" propriamente dito. Cada subpasta é uma
   skill com um `SKILL.md` (frontmatter `name` + `description` e um corpo com
   Objetivo → Regra de ouro → Fluxo → Encadeamento). Referências extensas ficam
   em `references/` e templates em `assets/`, carregados sob demanda
   (_progressive disclosure_).

2. **O CLI** (`bin/`, `lib/`) — instala e gerencia as skills na pasta do usuário.
   Sem dependências externas (só a stdlib do Node ≥ 18) para um `npx` rápido.

## O que o `install` faz

- Copia `agents/*` → `<cwd>/.claude/skills/` (o Claude Code lê skills de projeto
  daí).
- Cria `<cwd>/materiais/` (saída de todo material — análogo ao `decks/` do Mira).
- Grava `<cwd>/conselho.config.json` (`{version, sources: []}`).
- Insere um bloco gerenciado no `<cwd>/CLAUDE.md` (entre marcadores
  `CONSELHO-ACADEMICO:START/END`), preservando o restante do arquivo.

`update` recopia as skills; `uninstall` remove skills/config e limpa o bloco do
CLAUDE.md (preservando `materiais/`, salvo `--purge`).

## Orquestração

O `conselho-academico` (Coordenador) é a única skill que o usuário aciona
diretamente. Ela conduz o pipeline, assumindo o papel de cada especialista
(lendo o `SKILL.md` correspondente) ou delegando a subagentes quando disponíveis.
Os artefatos intermediários em `materiais/<slug>/` são o "estado compartilhado"
entre as etapas.

## Fontes vinculadas

Como no Mira, o usuário vincula fontes (`link`) que são registradas em
`conselho.config.json`. As skills **leem** dessas fontes e **escrevem apenas** em
`materiais/`. Isso mantém o conselho numa pasta isolada sem tocar nos originais.

## Pontos de extensão

- **Novos profissionais:** adicione uma pasta em `agents/` com um `SKILL.md` e
  referencie-a no fluxo do Coordenador.
- **Novos formatos de saída:** adicione uma referência em `ca-editor/references/`.
- **Novos tipos de material:** amplie
  `conselho-academico/references/tipos-de-material.md`.

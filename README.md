# Conselho Acadêmico

> Uma equipe de profissionais da educação para o [Claude Code](https://claude.com/claude-code) — skills que colaboram para criar **materiais didáticos** (roteiro de aula, plano de aula, sequência didática, apostila, livro, e-book) e geram **briefings prontos para virar slides no [Mira](https://github.com/sandeco/mira-animator)**.

Inspirado na arquitetura do **mira-animator**: em vez de um único assistente, você
tem um **conselho** de especialistas, cada um representado por uma _skill_, que
trabalham em pipeline sob um Coordenador Pedagógico.

## O conselho

| Skill | Profissional | Entrega |
|-------|--------------|---------|
| `conselho-academico` | **Coordenador Pedagógico** (orquestra tudo) | briefing + plano aprovado |
| `ca-designer-instrucional` | **Designer Instrucional** — objetivos (Bloom), sequência, BNCC | `plano-pedagogico.md` |
| `ca-pesquisador` | **Pesquisador de Conteúdo** — curadoria e fontes | `pesquisa.md` |
| `ca-redator` | **Redator/Autor Didático** — escreve o material | `material.md` |
| `ca-avaliador` | **Especialista em Avaliação** — exercícios, rubricas, gabarito | `avaliacao.md` |
| `ca-revisor` | **Revisor Pedagógico** — correção, clareza, parecer | `relatorio-revisao.md` |
| `ca-editor` | **Editor/Diagramador** — exporta e faz as pontes de saída | `exports/` |

**Fluxo:** Briefing → Plano pedagógico → Pesquisa → Redação → Avaliação →
Revisão → Edição/Entrega. O Coordenador pede sua aprovação nos pontos-chave.

## Instalação

Requer **Node.js 18+**. Na pasta onde você quer criar seus materiais:

```bash
# direto do GitHub (antes de publicar no npm):
npx github:jandreisst/conselho-academico install

# depois de publicado no npm:
npx conselho-academico install
```

O `install` copia as skills para `.claude/skills/`, cria a pasta `materiais/`,
gera o `conselho.config.json` e adiciona uma orientação ao `CLAUDE.md`.

Em seguida, **abra o Claude Code nessa pasta** e peça, por exemplo:

> "Crie um roteiro de aula sobre fotossíntese para o 7º ano, com avaliação, e um
> briefing para eu gerar os slides no Mira."

O Coordenador (`conselho-academico`) assume, monta o plano, pede sua aprovação e
aciona a equipe.

## Comandos do CLI

| Comando | O que faz |
|---------|-----------|
| `install` | Instala as skills nesta pasta e cria o scaffold |
| `link <caminho>` | Vincula uma fonte (`--name`, `--type projeto\|pdf\|latex\|texto`) |
| `sources` | Lista as fontes vinculadas |
| `status` | Mostra o estado da instalação e os materiais |
| `update` | Recopia as skills da versão atual do pacote |
| `uninstall [--purge]` | Remove skills e config (`--purge` também apaga `materiais/`) |

### Fontes vinculadas

Você pode apontar o conselho para o seu material de referência sem copiá-lo:

```bash
conselho-academico link ./livros/algebra.pdf --name algebra
conselho-academico link ../projeto-de-pesquisa --type projeto
conselho-academico sources
```

**Regra de ouro:** o conselho **lê** das fontes e **escreve apenas** em
`materiais/<slug>/`. Suas fontes originais nunca são alteradas.

## Saídas

- **Markdown** — base de tudo (`material.md`, `avaliacao.md`, …).
- **PDF / DOCX** — via [Pandoc](https://pandoc.org) (com fallback para HTML).
- **LaTeX (`.tex`)** — sob demanda, a partir de um template pronto.
- **Briefing para o Mira** — `exports/mira-briefing.md` no formato que o
  `mira-planner` consome, para virar slides animados.
- **Material visual** — capas/infográficos via Adobe Express/Canva (opcional).

## Estrutura de um material

```
materiais/<slug>/
  briefing.md            # o pedido, estruturado
  plano-pedagogico.md    # objetivos, sequência, alinhamento
  pesquisa.md            # conteúdo curado + fontes
  material.md            # o material didático em si
  avaliacao.md           # exercícios, rubricas, gabarito
  relatorio-revisao.md   # parecer de qualidade
  exports/               # material.pdf/.docx/.tex, mira-briefing.md, visual/
```

## Como funciona por dentro

As skills ficam em `agents/` neste repositório e são copiadas para
`.claude/skills/` no `install`. Cada uma é um `SKILL.md` (formato de _skill_ do
Claude Code) com um papel específico. O CLI (`bin/`, `lib/`) não tem dependências
externas — apenas a biblioteca padrão do Node. Veja `docs/arquitetura.md`.

## Contribuindo

Rode o smoke test do CLI:

```bash
npm test
```

## Licença

[MIT](./LICENSE) — livre para uso pessoal, educacional e comercial.

## Créditos

Arquitetura de "time de agentes" inspirada no
[mira-animator](https://github.com/sandeco/mira-animator), de sandeco.

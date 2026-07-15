# Ponte com o Mira (briefing para slides)

O [Mira](https://github.com/sandeco/mira-animator) transforma conteúdo em
apresentações HTML animadas. O ponto de entrada dele é um `briefing.md` que o
`mira-extract` produz e o `mira-planner` consome. Aqui, o `ca-editor` gera esse
briefing **diretamente a partir do material didático**, para o usuário pular a
extração e ir direto ao planejamento de slides.

## Regra de compatibilidade

Gere `materiais/<slug>/exports/mira-briefing.md` **exatamente** na estrutura
abaixo (mesmas seções e cabeçalhos que o `mira-extract` emite), para o
`mira-planner` reconhecer sem atrito. Não renomeie seções.

## Modelo (copiar a estrutura)

```markdown
# Briefing: [título do material]
**Fonte:** [slug] (material-didatico) — materiais/[slug]/material.md
**Data da extração:** [YYYY-MM-DD]

## Essência em uma frase
[o que é o material, para quem, e qual a mensagem central — 1 frase]

## Conceitos-chave (candidatos a slide)
1. [conceito] — [por que importa para o aluno] — [sugestão visual: d3-fluxo|comparacao|metricas|timeline|codigo]
2. [conceito] — [...] — [...]
3. ...

## Dados e números
[métricas, datas, percentuais, marcos — material para cards de métrica/gráficos]

## Trechos de código emblemáticos
[fórmulas, citações, exemplos ou trechos que merecem um slide; ou "—" se não houver]

## Narrativa sugerida
[arco da apresentação: gancho → problema/pergunta → conceitos → exemplo → síntese → chamada à ação/atividade]

## Lacunas
[o que o professor talvez queira acrescentar antes de gerar os slides]
```

## Como preencher a partir do material

- **Essência**: derive do objetivo pedagógico (briefing) + tema.
- **Conceitos-chave**: use os tópicos da sequência/`plano-pedagogico.md`. Para
  cada um, escolha a `sugestão visual` mais adequada:
  - `d3-fluxo` — processos/etapas (ex.: ciclo da água, fotossíntese);
  - `comparacao` — antes/depois, prós/contras, dois modelos;
  - `metricas` — números, estatísticas, marcos;
  - `timeline` — cronologia, história, evolução;
  - `codigo` — fórmulas, sintaxe, exemplos formais.
- **Dados e números**: puxe de `pesquisa.md` (com ano/fonte).
- **Trechos emblemáticos**: fórmulas em LaTeX, citações, definições marcantes.
- **Narrativa**: transforme a sequência didática em um arco de apresentação.
- **Lacunas**: aproveite as lacunas já registradas na pesquisa/revisão.

## Entregar ao usuário

Informe o caminho e o próximo passo, por exemplo:

> Gerei `exports/mira-briefing.md`. Para criar os slides, use o Mira apontando
> para esse arquivo — por exemplo, `npx mira-animator link
> materiais/<slug>/exports/mira-briefing.md` e depois `/mira-new`, ou cole o
> conteúdo no fluxo do `mira-planner`.

O conselho **não instala o Mira** — apenas produz um insumo 100% compatível com
ele.

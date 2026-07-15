# Material visual (capa, infográfico, diagrama)

Quando o usuário pedir elementos gráficos — capa de apostila/e-book, infográfico,
cartaz, diagrama —, o `ca-editor` coordena a produção usando as skills de design
disponíveis no ambiente. **Confirme antes** com o usuário o destino e o formato
(arquivo PNG/PDF, documento editável, etc.).

## Ferramentas possíveis (conforme disponível no ambiente)

- **Adobe Express** — para peças de design (capas, cartazes, posts, infográficos).
  Existe uma skill dedicada (`create_visual_design_express_skill` /
  `adobe_mandatory_init`). Ao usá-la, siga o fluxo dela: ela orienta a construir o
  design como HTML e perguntar o destino (documento Express, arquivo PPTX/PDF/
  imagem) antes de produzir.
- **Canva** — geração/edição de designs a partir de texto ou template.
- **Diagramas** — para fluxos/mapas conceituais, `mermaid` embutido em Markdown/
  HTML costuma bastar e não depende de serviço externo.

Se nenhuma integração de design estiver disponível, ofereça alternativas locais:
diagramas em `mermaid`, ou descrições visuais detalhadas que o professor pode
montar depois.

## Fluxo

1. Confirme o que gerar (peça, tema, texto que entra, proporção) e o destino.
2. Reúna o conteúdo do `material.md` que embasa a peça (título, tópicos, dados).
3. Acione a skill de design apropriada, seguindo o fluxo próprio dela (inclusive
   a pergunta de destino/formato que ela faz).
4. Salve/registre o resultado em `materiais/<slug>/exports/visual/` (ou o link do
   documento gerado) e informe o usuário.

## Cuidados

- **Não** publique nem compartilhe nada externamente sem o usuário pedir.
- Respeite direitos de imagem: use bancos/geração próprios das ferramentas.
- Mantenha coerência visual com o material (títulos, termos, dados corretos).
- A geração visual é um extra opcional — o material textual (Markdown/PDF/DOCX/
  LaTeX) é sempre a entrega principal.

'use strict';

const fs = require('fs');
const path = require('path');
const {
  packageRoot,
  copyDir,
  ensureDir,
  exists,
  ok,
  info,
  warn,
  log,
  c,
  upsertManagedBlock,
} = require('./utils');
const {
  SKILLS_DIR,
  MATERIAIS_DIR,
  defaultConfig,
  readConfig,
  writeConfig,
  hasConfig,
  CONFIG_NAME,
} = require('./config');

const BLOCK_START = '<!-- CONSELHO-ACADEMICO:START -->';
const BLOCK_END = '<!-- CONSELHO-ACADEMICO:END -->';

/** Lista os nomes das skills empacotadas em agents/. */
function listAgents() {
  const agentsDir = path.join(packageRoot(), 'agents');
  if (!exists(agentsDir)) return [];
  return fs
    .readdirSync(agentsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

function copyAgents(cwd) {
  const from = path.join(packageRoot(), 'agents');
  const to = path.join(cwd, SKILLS_DIR);
  ensureDir(to);
  const names = listAgents();
  for (const name of names) {
    copyDir(path.join(from, name), path.join(to, name));
  }
  return names;
}

function claudeMdBlock() {
  return [
    '## Conselho Acadêmico',
    '',
    'Este projeto tem o **Conselho Acadêmico** instalado: uma equipe de skills que',
    'colabora para produzir materiais didáticos (roteiro de aula, plano de aula,',
    'livro, apostila, sequência didática, e-book).',
    '',
    '- **Como começar:** acione a skill `conselho-academico` (o Coordenador). Ex.:',
    '  "crie um roteiro de aula sobre fotossíntese para o 7º ano".',
    '- **Equipe:** `ca-designer-instrucional`, `ca-pesquisador`, `ca-redator`,',
    '  `ca-avaliador`, `ca-revisor`, `ca-editor`. O Coordenador as aciona em pipeline.',
    '- **Regra de ouro:** leia das fontes vinculadas, **escreva apenas em**',
    `  \`${MATERIAIS_DIR}/<slug>/\`. Nunca altere as fontes originais.`,
    `- **Fontes e configuração:** \`${CONFIG_NAME}\` (use \`conselho-academico link\`).`,
    '- **Saídas:** Markdown (base), PDF/DOCX, LaTeX sob demanda, e um',
    '  `exports/mira-briefing.md` pronto para virar slides no Mira.',
  ].join('\n');
}

function install(cwd) {
  info('Instalando o Conselho Acadêmico...');

  const names = copyAgents(cwd);
  ok(`${names.length} skills copiadas para ${c.dim(SKILLS_DIR + '/')}`);

  const materiais = path.join(cwd, MATERIAIS_DIR);
  if (!exists(materiais)) {
    ensureDir(materiais);
    ok(`pasta de saída criada: ${c.dim(MATERIAIS_DIR + '/')}`);
  } else {
    info(`pasta ${c.dim(MATERIAIS_DIR + '/')} já existe (preservada)`);
  }

  if (!hasConfig(cwd)) {
    writeConfig(cwd, defaultConfig());
    ok(`configuração criada: ${c.dim(CONFIG_NAME)}`);
  } else {
    const cfg = readConfig(cwd);
    if (cfg && !Array.isArray(cfg.sources)) {
      cfg.sources = [];
      writeConfig(cwd, cfg);
    }
    info(`${c.dim(CONFIG_NAME)} já existe (preservado)`);
  }

  const claudeMd = path.join(cwd, 'CLAUDE.md');
  upsertManagedBlock(claudeMd, BLOCK_START, BLOCK_END, claudeMdBlock());
  ok('orientação adicionada ao CLAUDE.md');

  log('');
  ok(c.bold('Conselho Acadêmico instalado!'));
  log('');
  log('Próximos passos:');
  log(`  ${c.dim('1.')} (opcional) vincule fontes: ${c.blue('conselho-academico link ./material.pdf')}`);
  log(`  ${c.dim('2.')} abra o Claude Code nesta pasta`);
  log(`  ${c.dim('3.')} peça, por exemplo: ${c.blue('"crie um plano de aula sobre frações para o 5º ano"')}`);
  log('');
}

module.exports = { install, listAgents, BLOCK_START, BLOCK_END };

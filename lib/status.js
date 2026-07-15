'use strict';

const fs = require('fs');
const path = require('path');
const { log, exists, c } = require('./utils');
const { SKILLS_DIR, MATERIAIS_DIR, readConfig, CONFIG_NAME } = require('./config');
const { listAgents } = require('./install');

function status(cwd) {
  log(c.bold('Conselho Acadêmico — status'));
  log('');

  const skillsPath = path.join(cwd, SKILLS_DIR);
  if (exists(skillsPath)) {
    const installed = fs
      .readdirSync(skillsPath, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    const expected = listAgents();
    const missing = expected.filter((n) => !installed.includes(n));
    log(`  Skills instaladas: ${c.green(String(installed.filter((n) => expected.includes(n)).length))}/${expected.length}`);
    if (missing.length) {
      log(`  ${c.yellow('Faltando:')} ${missing.join(', ')} ${c.dim('(rode: update)')}`);
    }
  } else {
    log(`  ${c.yellow('Não instalado.')} Rode: ${c.blue('conselho-academico install')}`);
  }

  const cfg = readConfig(cwd);
  const nSources = cfg && Array.isArray(cfg.sources) ? cfg.sources.length : 0;
  log(`  Config: ${exists(path.join(cwd, CONFIG_NAME)) ? c.green('ok') : c.yellow('ausente')} — ${nSources} fonte(s)`);

  const materiais = path.join(cwd, MATERIAIS_DIR);
  if (exists(materiais)) {
    const decks = fs
      .readdirSync(materiais, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    log(`  Materiais: ${decks.length}`);
    for (const d of decks) log(`    ${c.dim('•')} ${d}`);
  } else {
    log(`  Materiais: 0 ${c.dim(`(pasta ${MATERIAIS_DIR}/ ainda não criada)`)}`);
  }
}

module.exports = { status };

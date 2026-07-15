'use strict';

const fs = require('fs');
const path = require('path');
const { removePath, exists, ok, info, warn, log, c, upsertManagedBlock } = require('./utils');
const { SKILLS_DIR, MATERIAIS_DIR, CONFIG_NAME } = require('./config');
const { listAgents, BLOCK_START, BLOCK_END } = require('./install');

/**
 * Remove as skills do conselho e a configuração. Preserva os materiais/
 * produzidos, a menos que --purge seja passado.
 */
function uninstall(cwd, flags = {}) {
  const skillsPath = path.join(cwd, SKILLS_DIR);
  let removed = 0;
  for (const name of listAgents()) {
    const p = path.join(skillsPath, name);
    if (exists(p)) {
      removePath(p);
      removed++;
    }
  }
  ok(`${removed} skills removidas de ${c.dim(SKILLS_DIR + '/')}`);

  const cfg = path.join(cwd, CONFIG_NAME);
  if (exists(cfg)) {
    removePath(cfg);
    ok(`${c.dim(CONFIG_NAME)} removido`);
  }

  // Limpa o bloco gerenciado do CLAUDE.md (mantém o resto do arquivo).
  const claudeMd = path.join(cwd, 'CLAUDE.md');
  if (exists(claudeMd)) {
    const content = fs.readFileSync(claudeMd, 'utf8');
    if (content.includes(BLOCK_START)) {
      upsertManagedBlock(claudeMd, BLOCK_START, BLOCK_END, '');
      const cleaned = fs
        .readFileSync(claudeMd, 'utf8')
        .replace(`${BLOCK_START}\n\n${BLOCK_END}`, '')
        .replace(/\n{3,}/g, '\n\n')
        .trimStart();
      fs.writeFileSync(claudeMd, cleaned);
      info('bloco do conselho removido do CLAUDE.md');
    }
  }

  if (flags.purge) {
    const materiais = path.join(cwd, MATERIAIS_DIR);
    if (exists(materiais)) {
      removePath(materiais);
      warn(`materiais/ removidos (--purge)`);
    }
  } else {
    log('');
    info(`seus materiais em ${c.dim(MATERIAIS_DIR + '/')} foram preservados.`);
    info(`use ${c.blue('--purge')} para removê-los também.`);
  }

  log('');
  ok(c.bold('Conselho Acadêmico desinstalado.'));
}

module.exports = { uninstall };

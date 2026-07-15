#!/usr/bin/env node
'use strict';

const { log, error, parseFlags, c } = require('../lib/utils');
const { install } = require('../lib/install');
const { link } = require('../lib/link');
const { sources } = require('../lib/sources');
const { status } = require('../lib/status');
const { update } = require('../lib/update');
const { uninstall } = require('../lib/uninstall');

const pkg = require('../package.json');

const HELP = `
${c.bold('Conselho Acadêmico')} — equipe de profissionais da educação para o Claude Code
v${pkg.version}

${c.bold('Uso:')}
  conselho-academico <comando> [opções]

${c.bold('Comandos:')}
  install                Instala as skills nesta pasta (.claude/skills/) e cria o scaffold
  link <caminho>         Vincula uma fonte (projeto, PDF, LaTeX, texto)
                           --name <nome>   apelido da fonte
                           --type <tipo>   projeto | pdf | latex | texto
  sources                Lista as fontes vinculadas
  status                 Mostra o estado da instalação e os materiais
  update                 Recopia as skills da versão atual do pacote
  uninstall [--purge]    Remove as skills e a config (--purge também apaga materiais/)
  help                   Mostra esta ajuda

${c.bold('Exemplos:')}
  npx conselho-academico install
  npx conselho-academico link ./livros/algebra.pdf --name algebra
  conselho-academico status

Depois de instalar, abra o Claude Code nesta pasta e peça, por exemplo:
  ${c.blue('"crie um roteiro de aula sobre fotossíntese para o 7º ano, com avaliação"')}
`;

function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  const { flags, positionals } = parseFlags(argv.slice(1));
  const cwd = process.cwd();

  switch (cmd) {
    case 'install':
      return install(cwd, flags);
    case 'link':
      return link(cwd, positionals, flags);
    case 'sources':
      return sources(cwd);
    case 'status':
      return status(cwd);
    case 'update':
      return update(cwd, flags);
    case 'uninstall':
      return uninstall(cwd, flags);
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      return log(HELP);
    case '--version':
    case '-v':
      return log(pkg.version);
    default:
      error(`comando desconhecido: ${cmd}`);
      log(HELP);
      process.exitCode = 1;
  }
}

try {
  main();
} catch (err) {
  error(err && err.message ? err.message : String(err));
  process.exitCode = 1;
}

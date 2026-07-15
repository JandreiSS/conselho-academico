'use strict';

/**
 * Smoke test do CLI: instala num diretório temporário e verifica os artefatos,
 * exercitando install → link → sources → status → update → uninstall.
 * Rodar com: npm test
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const REPO = path.resolve(__dirname, '..');
const CLI = path.join(REPO, 'bin', 'cli.js');

let passed = 0;
function check(desc, fn) {
  fn();
  passed++;
  process.stdout.write(`  \x1b[32m✓\x1b[0m ${desc}\n`);
}

function run(cwd, args) {
  return execFileSync('node', [CLI, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  });
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'conselho-test-'));
process.stdout.write(`\nConselho Acadêmico — smoke test\n(tmp: ${tmp})\n\n`);

try {
  // install
  run(tmp, ['install']);
  const skillsDir = path.join(tmp, '.claude', 'skills');
  check('install cria .claude/skills/', () =>
    assert.ok(fs.existsSync(skillsDir))
  );

  const expected = [
    'conselho-academico',
    'ca-designer-instrucional',
    'ca-pesquisador',
    'ca-redator',
    'ca-avaliador',
    'ca-revisor',
    'ca-editor',
  ];
  check('as 7 skills foram copiadas com SKILL.md', () => {
    for (const name of expected) {
      const skillMd = path.join(skillsDir, name, 'SKILL.md');
      assert.ok(fs.existsSync(skillMd), `faltou ${name}/SKILL.md`);
    }
  });

  check('template.tex do ca-editor foi copiado', () =>
    assert.ok(
      fs.existsSync(path.join(skillsDir, 'ca-editor', 'assets', 'template.tex'))
    )
  );

  check('materiais/ e conselho.config.json criados', () => {
    assert.ok(fs.existsSync(path.join(tmp, 'materiais')));
    assert.ok(fs.existsSync(path.join(tmp, 'conselho.config.json')));
  });

  check('CLAUDE.md tem o bloco gerenciado', () => {
    const md = fs.readFileSync(path.join(tmp, 'CLAUDE.md'), 'utf8');
    assert.ok(md.includes('CONSELHO-ACADEMICO:START'));
    assert.ok(md.includes('Conselho Acadêmico'));
  });

  // link + sources
  const fakeSource = path.join(tmp, 'fonte.pdf');
  fs.writeFileSync(fakeSource, '%PDF-1.4 fake');
  run(tmp, ['link', fakeSource, '--name', 'minha-fonte']);
  check('link registra a fonte no config', () => {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(tmp, 'conselho.config.json'), 'utf8')
    );
    assert.strictEqual(cfg.sources.length, 1);
    assert.strictEqual(cfg.sources[0].name, 'minha-fonte');
    assert.strictEqual(cfg.sources[0].type, 'pdf');
  });
  check('sources lista a fonte', () => {
    const out = run(tmp, ['sources']);
    assert.ok(out.includes('minha-fonte'));
  });

  // preserva CLAUDE.md do usuário fora do bloco
  const claudeMd = path.join(tmp, 'CLAUDE.md');
  fs.writeFileSync(
    claudeMd,
    '# Meu projeto\n\nConteúdo do usuário.\n\n' + fs.readFileSync(claudeMd, 'utf8')
  );

  // status
  check('status reporta 7/7 skills e 1 fonte', () => {
    const out = run(tmp, ['status']);
    assert.ok(out.includes('7/7'));
    assert.ok(out.includes('1 fonte'));
  });

  // update é idempotente e preserva config/materiais
  run(tmp, ['update']);
  check('update preserva a fonte vinculada', () => {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(tmp, 'conselho.config.json'), 'utf8')
    );
    assert.strictEqual(cfg.sources.length, 1);
  });

  // simula um material produzido (deve sobreviver ao uninstall sem --purge)
  const deck = path.join(tmp, 'materiais', 'demo');
  fs.mkdirSync(deck, { recursive: true });
  fs.writeFileSync(path.join(deck, 'material.md'), '# Demo');

  // uninstall
  run(tmp, ['uninstall']);
  check('uninstall remove as skills', () =>
    assert.ok(!fs.existsSync(path.join(skillsDir, 'conselho-academico')))
  );
  check('uninstall preserva materiais/ do usuário', () =>
    assert.ok(fs.existsSync(path.join(deck, 'material.md')))
  );
  check('uninstall preserva o conteúdo do usuário no CLAUDE.md', () => {
    const md = fs.readFileSync(claudeMd, 'utf8');
    assert.ok(md.includes('Conteúdo do usuário.'));
    assert.ok(!md.includes('CONSELHO-ACADEMICO:START'));
  });

  process.stdout.write(`\n\x1b[32m${passed} verificações OK\x1b[0m\n\n`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

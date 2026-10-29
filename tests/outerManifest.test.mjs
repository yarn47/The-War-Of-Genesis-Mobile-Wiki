import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync(new URL('../src/pages/CharacterDetail.tsx', import.meta.url), 'utf8')
// Exercise the actual component's node construction, without a browser or API.
const start = source.indexOf('    const hasActive =')
const end = source.indexOf('    const [selectedNode', start)
const js = ts.transpileModule(source.slice(start, end), {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText
const layout = new Function('character', 'isOuter', 'ULTIMATE_STEPS', 'PASSIVE_MANIFEST_STEPS', 'STAT_BOOST_STEPS', 'ARTIFACT_STEPS', `${js}; return nodes`)
const nodes = (character) => layout(character, character.grade === 'outer', [0, 1, 3, 5], [2, 4, 6], [1, 2], [3, 4, 5, 6])

test('outer grade uses five columns and separate skill/artifact nodes', () => {
    const result = nodes({ grade: 'outer', outerSkill: {}, ultimateSkill: {}, passive: {} })
    const group = type => result.filter(n => n.type === type).map(n => [n.step, n.col])
    assert.deepEqual(group('outer'), [[1, 0], [3, 0], [5, 0]])
    assert.deepEqual(group('passive'), [[2, 1], [4, 1], [6, 1]])
    assert.deepEqual(group('stat'), [[2, 2]])
    assert.deepEqual(group('artifact'), [[3, 2], [4, 2], [5, 2], [6, 2]])
    assert.deepEqual(group('exclusiveArtifact'), [[6, 3]])
    assert.deepEqual(group('ultimate'), [[1, 4], [3, 4], [5, 4]])
})

test('ordinary characters retain existing layout including stat step one', () => {
    const result = nodes({ grade: 'legend', ultimateSkill: {}, passive: {} })
    assert.equal(result.some(n => ['outer', 'exclusiveArtifact'].includes(n.type)), false)
    assert.deepEqual(result.filter(n => n.type === 'stat').map(n => n.step), [1, 2])
    assert.equal(Math.max(...result.map(n => n.col)), 2)
    const noUltimate = nodes({ grade: 'legend', passive: {} })
    assert.equal(noUltimate.some(n => n.type === 'ultimate'), false)
    assert.equal(Math.max(...noUltimate.map(n => n.col)), 1)
})

test('outer artifact slot four is excluded from general artifacts and selected separately', () => {
    const begin = source.indexOf('    const getArtifactsAt =')
    const finish = source.indexOf('\n\n', begin)
    const code = ts.transpileModule(source.slice(begin, finish), {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
    }).outputText
    const select = new Function('character', 'isOuter', 'step', 'exclusive', `${code}; return getArtifactsAt(step, exclusive)`)
    const character = { artifacts: [1, 2, 3, 4].map(artifactOrder => ({ artifactOrder, levels: [{ manifestStep: 6 }] })) }
    assert.deepEqual(select(character, true, 6, false).map(a => a.artifactOrder), [1, 2, 3])
    assert.deepEqual(select(character, true, 6, true).map(a => a.artifactOrder), [4])
    assert.equal(select(character, false, 6, false).length, 4)
    assert.match(source, /type === 'outer' \? character\.outerSkill : character\.ultimateSkill/)
})

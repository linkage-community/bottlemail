import parse from './src'

function test(s: string) {
  console.log(`== Start parsing "${s}" ==`)
  console.time('q')
  const nodes = parse(s)
  console.log('-> result')
  console.dir(nodes)
  console.timeEnd('q')
}

test('')
test('     ')
test('@otofune Yo! :smile: https://github.com/poooe http://[fe80::a1b3:125d:c1f8:4780]/ @ @yo')

import { parse, traverse } from '@/babel'

describe('enter-exit', () => {
  it('visits every node in balanced enter/exit order', () => {
    const entered: string[] = []
    const exited: string[] = []
    const events: string[] = []

    traverse(
      parse(`function foo() {
  console.log("hello");
}`),
      {
        enter(path) {
          entered.push(path.type)
          events.push(`enter:${path.type}`)
        },
        exit(path) {
          exited.push(path.type)
          events.push(`exit:${path.type}`)
        },
      },
    )

    expect(entered).toContain('FunctionDeclaration')
    expect(entered).toContain('CallExpression')
    expect(exited.toSorted()).toEqual(entered.toSorted())
    expect(events.indexOf('enter:FunctionDeclaration')).toBeLessThan(events.indexOf('enter:CallExpression'))
    expect(events.indexOf('exit:CallExpression')).toBeLessThan(events.indexOf('exit:FunctionDeclaration'))
  })
})

import { parse, traverse } from '@/babel'

describe('enter-exit', () => {
  it('should ', () => {
    traverse(
      parse(`function foo() {
  console.log("hello");
}`),
      {
        enter(path) {
          console.log(`enter: ${path.type}`)
        },
        exit(path) {
          console.log(`exit: ${path.type}`)
        },
      },
    )
  })
})

# 自定义编译时指令

```ts
import type { DirectiveTransform } from '@vue/compiler-core'
import { createStructuralDirectiveTransform } from '@vue/compiler-core'
```

## createStructuralDirectiveTransform

`createStructuralDirectiveTransform` 方法返回的是 `nodeTransforms` 类型的转换函数。

1.结构性指令的特点:

结构性指令(如 `v-if` 、`v-for` )会直接操作 `DOM` 结构，可能添加、删除或替换节点，因此需要在AST 的节点层级进行处理。

2.`nodeTransforms` 的作用: `nodeTransforms` 用于处理节点的结构变换，例如遍历子节点、修改节点属性或结构。结构性指令需要通过这类转换实现其逻辑。

3. `directiveTransforms` 的定位: `directiveTransforms` 主要处理指令的细节(如参数、修饰符)，但不直接改变节点结构。例如 `v-model` 的解析属于指令级操作，而非结构变动。

4.源码设计的印证:

在 Vue 的编译器中，结构性指令(如 `v-if`)的转换逻辑明确属于 `nodeTransforms` ，而普通指令(如`v-bind`)由 `directiveTransforms` 处理。

`createStructuralDirectiveTransform` 的设计目标正是生成这类节点级转换函数，

结构性指令需要操作AST节点结构
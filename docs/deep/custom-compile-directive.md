# 自定义编译时指令

Vue 编译器提供了扩展点，允许你编写自定义的编译时指令。这些指令在编译阶段处理，直接影响生成的渲染函数代码。

```ts
import type { DirectiveTransform } from '@vue/compiler-core'
import { createStructuralDirectiveTransform } from '@vue/compiler-core'
```

## 两种类型的编译时转换

Vue 编译器区分两种转换类型：

### nodeTransforms（节点转换）

用于处理**结构性指令**，如 `v-if`、`v-for`。这类指令会直接操作 DOM 结构——添加、删除或替换节点，因此需要在 AST 的节点层级进行处理。

`createStructuralDirectiveTransform` 方法返回的就是 `nodeTransforms` 类型的转换函数。

### directiveTransforms（指令转换）

用于处理**非结构性指令**，如 `v-bind`、`v-on`、`v-model`。这类指令不改变节点结构，只处理指令的细节（参数、修饰符、绑定值等）。

## 为什么结构性指令用 nodeTransforms

1. 结构性指令（如 `v-if`、`v-for`）会直接操作 DOM 结构，可能添加、删除或替换节点
2. `nodeTransforms` 用于处理节点的结构变换，例如遍历子节点、修改节点属性或结构
3. `directiveTransforms` 主要处理指令的细节（如参数、修饰符），但不直接改变节点结构

在 Vue 的编译器源代码中，结构性指令（如 `v-if`）的转换逻辑明确属于 `nodeTransforms`，而普通指令（如 `v-bind`）由 `directiveTransforms` 处理。

## 自定义指令示例

本项目中实现了一个自定义编译时指令 `v-file`，见 `packages/compile-time-directive` 目录。

### directiveTransforms 示例

```ts
import type { DirectiveTransform } from '@vue/compiler-core'

// 自定义 v-data-attr 指令，在编译时将指令转换为 data 属性
export const transformDataAttr: DirectiveTransform = (dir, _node, _context) => {
  return {
    props: [
      {
        type: 'attr',
        name: 'data-attr',
        value: dir.exp,
        key: dir.arg,
        loc: dir.loc,
      },
    ],
  }
}
```

### 在 Vite 中注册

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { transformDataAttr } from './my-directives'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          directiveTransforms: {
            'data-attr': transformDataAttr,
          },
        },
      },
    }),
  ],
})
```

## 相关源代码

- [v-for 编译实现](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-core/src/transforms/vFor.ts)
- [v-if 编译实现](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-core/src/transforms/vIf.ts)
- 本项目自定义编译时指令 `v-file`：见 `packages/compile-time-directive`

# Vue + JSX / TSX 编译示例

这个示例用来观察：当界面主要通过 JSX / TSX、`render()` 和 `h()` 组织时，Vue 的编译参与位置会怎样变化。

和 `.vue` 模板项目相比，这里最值得关注的不是“有没有编译”，而是：

- 模板编译减少了。
- JSX / TSX 语法转换变重要了。
- Vue 运行时仍然接收 VNode 创建调用。
- 组件模型、响应式系统和 patch 流程仍然属于 Vue。

如果你想理解这个示例背后的文档主线，可以继续阅读：

1. [Vue JSX / TSX 的本质](../../docs/essence/tsx.md)
2. [h() 函数的本质](../../docs/essence/h.md)
3. [Vue + JSX 全编译项目](../../docs/advanced/fully-compiled.md)

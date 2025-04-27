# 类型推导与提取

## 什么是类型推导提取

你有没有感到好奇，当你将 TypeScript 代码编译为 JavaScript 时，类型信息会被移除，因为 JavaScript 本身并不支持类型检查。

但是为什么 `Vue` 里面，写类型却可以真正的生效?

[看这个示例](https://play.vuejs.org/#eNp9UstOwzAQ/JXFl4IErRCcolAECAk4AAIkDphDmmyCi7O2bKcURfl31q76OKBeouzOjD07615cWTtedCgykfvSKRvAY+gs6IKaCymCl2IqSbXWuAA9OKxhgNqZFkYsG0mSVBryAVrfwEXED0d3qLWBd+N0dTA6ipTwaxHuA7ZM6SUBFBn44BQ1x7GaZUBdO0MnaeDLKKCrixLh2RnrN4I1hfmXa3msygxmxmgs+CKAag19fMYSs5UeoN49AaDZPWJINlSWPEYh25BUYa0Ik4k8faeHaRpJ+WQVFkfDBWusLgJyBZB/nU77PsUxDPmEq9RVZLsAi5PWVKg5WMalgAmD+WRHL445cg60Vs147g3xXpJ9KUrTWqXRPdmgOHApNoNJUXDePw+pF1yHaZik+cLy+5/+3C9jT4pnhx7dAqXYYKFwDYYVfPv6iEv+34DsvtPM3gO+oDe6ix5XtOuOKra9w0tu79OL4vjf/O0yIPn1UNHodiVS8Cu72TP61u7Z+DzpeHli+AO/BfIx) 

[Vue 编译器源代码](https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-sfc/src/script/resolveType.ts#L24)

## 让我们一起来实现一下吧

见 `packages/type-infer` 项目
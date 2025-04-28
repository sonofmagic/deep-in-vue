# defineXXX 的本质

实际上 `defineXXX` 函数，有些是编译宏函数，有些是运行时函数

## 如何辨别编译/运行时函数

看他们是否是在任意的 `js/ts` 中可以定义，还是只能在 `vue` 中 `script setup` 代码块定义的

另外，编译时函数在产物中是被干掉的，是不可见的。原因在于他们的运行是在 `nodejs` 部分，被直接覆盖掉

比如 `defineComponent` / `defineAsyncComponent` / `defineCustomElement` 就是运行时的 https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/runtime-core/src/apiDefineComponent.ts#L305

`defineProps` 和 `defineEmits`, `defineExpose`, `defineModel`,`defineOptions`,`defineSlots`  这种就本质上是编译宏函数

`https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-sfc/src/script/defineEmits.ts`

`https://github.com/vuejs/core/blob/a23fb59e83c8b65b27eaa21964c8baa217ab0573/packages/compiler-sfc/src/script/defineSlots.ts`


比如这个 [`defineSlots`](https://play.vuejs.org/#eNq1UsFu1DAQ/ZXBl2ylshGCU5SuBKgScABEkbj4EiWzqYsztuzJErTKvzN2uu12BXuiOc3Me895Y7+9euv9ejeiqpQmTXVsg/EMEXn0YBvqr7TiqNVGkxm8Cwx7CLiFGbbBDVCItEjC1lFkGGIPVwlfFR/QWgc/XLDdi+LikRKt4yikDreG8CZ19V4TpEEzWl754Hys5DdyWAWRg6Ee5osKGvqtad6s5LC6XHyKK2kYB28bRukA6ttXm30WwzzXpXR5asiPDLuXg+vQyk6CawWlgHV5pFeXsq0Y3Zp+fRcdybVkc1q1bvDGYvji2cgiWonFhCSskVV/fcozDiNeHubtLbY//zK/i1OaafU1YMSwQ60eMG5Cj7zA1zefcZL6ART3oxX2GfAbRmfH5HGhvRupE9tHvOz2Y35Mudrv8XpipHhYKhlNzDnztZIHfn9m9Ue7r9dvsk7eSG4xae5zdcjUP9K0BCHxHSHxSbJwyrT7cJySV9kHNQNWUEzyiWJ+mo/nS/R/zPNpoo89b86FvTO7XEiZjORAS10u86fRnv8ALJNXIw==) 示例


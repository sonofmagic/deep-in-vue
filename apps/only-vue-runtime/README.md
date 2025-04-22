# h 函数的本质

h 函数的本质是对 createVNode 的二次封装

createVNode 也是对 createBaseVNode 的二次封装

编译一个 vue 文件，会生成一个 render 函数，这个函数会调用像是

toDisplayString , createElementVNode , vModelText, withDirectives , Fragment, openBlock, createElementBlock 这些非常底层的函数或者标识符

```ts
const Fragment = Symbol.for('v-fgt')
const Text = Symbol.for('v-txt')
const Comment = Symbol.for('v-cmt')
const Static = Symbol.for('v-stc')
```

toDisplayString 是你在 vue 中使用 `{{ obj }}` 还能正常展示的原因，假如一个对象直接 `toString`，会得到 `[object Object]`

createElementVNode 是 createBaseVNode 的别名, 这个只能默认的 h5 元素和一些 vue 自己扩展的元素(比如 `Fragment`)，不像 h 还可以渲染组件

[play.vuejs.org](https://play.vuejs.org/#eNqdU01vEzEQ/SvGl4DUXavAKWyjAKoEHAABEhdfNruTrIu/5I80aLX/nbFNwgaVUvUSxfPezHtvJhnpa2vrfQS6pI3vnLCBeAjRrrgWyhoXyEgcbMlEts4oskDqgmuuO6N9IMrvyFXCny7egZSGfDdO9k8Wz44EP5hb/ZsSXAQEGlZ0UAEfAZSVbQB8EdIMl2RfpZ4rTnMrp6txzDLT1LDhstCEtjEgU5keJFIR55QwBBs2G4hPH35KIL4zFnqs1BsypgmdkcYtyUZGeMX1lE0l5ope0IBsvRW7+sYbjWvJDZx2RlkhwX2yQWA0TpdlVMJajH77IddSyItjvRug+3FH/cYfUo3Tzw48uD1wesJC63YQCnz99SMc8PsJxMBRIvse8At4I2PyWGhvou7R9oyX3b7PxxV6981fHwJofwyVjCbmlPmc4sHf3hP9j90X9cvch/vELZYfT6Va+9ceC3A+ZI0izA+tg76YHkKwfslY12tsxyOLvas1BKatYjP2Ol3aB9YL/CilGryqNiU09s5ygwQFOlRWxiz/H5k5/UxH6B4O9TZKWSuha/VPEfZIldm49dk8kf5UFcZ/yJbu7lw/n4dI/pP90+GmX/PiYuM=)

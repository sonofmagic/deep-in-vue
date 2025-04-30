
# vite dev 和 build 下的 vue 产物

## source

```html
<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('hello')
</script>

<template>
  <div>
    {{ msg }}
    <input v-model="msg">
  </div>
</template>

<style scoped>
.hello-msg {
  color: red;
}
</style>

```

## dev

### js(vue)

```js
import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/hello.vue");import { defineComponent as _defineComponent } from "/node_modules/.vite/deps/vue.js?v=c7e87a01";
import { ref } from "/node_modules/.vite/deps/vue.js?v=c7e87a01";
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "hello",
  setup(__props, { expose: __expose }) {
    __expose();
    const msg = ref("hello");
    const __returned__ = { msg };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
import { toDisplayString as _toDisplayString, vModelText as _vModelText, createElementVNode as _createElementVNode, withDirectives as _withDirectives, createTextVNode as _createTextVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "/node_modules/.vite/deps/vue.js?v=c7e87a01";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _openBlock(), _createElementBlock("div", null, [
    _createTextVNode(
      _toDisplayString($setup.msg) + " ",
      1
      /* TEXT */
    ),
    _withDirectives(_createElementVNode(
      "input",
      {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.msg = $event)
      },
      null,
      512
      /* NEED_PATCH */
    ), [
      [_vModelText, $setup.msg]
    ])
  ]);
}
import "/src/pages/hello.vue?vue&type=style&index=0&scoped=9e67ff97&lang.css";
_sfc_main.__hmrId = "9e67ff97";
typeof __VUE_HMR_RUNTIME__ !== "undefined" && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
import.meta.hot.on("file-changed", ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file;
});
import.meta.hot.accept((mod) => {
  if (!mod) return;
  const { default: updated, _rerender_only } = mod;
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
  }
});
import _export_sfc from "/@id/__x00__plugin-vue:export-helper";
export default /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9e67ff97"], ["__file", "/path/to/your/only-vue-runtime/apps/fully-compiled/src/pages/hello.vue"]]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IjtBQUNBLFNBQVMsV0FBVzs7Ozs7QUFFcEIsVUFBTSxNQUFNLElBQUksT0FBTzs7Ozs7Ozs7dUJBSXJCLG9CQUdNO0FBQUEsSUFWUjtBQUFBLHVCQVFPLFVBQUcsSUFBRztBQUFBLE1BQ1Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFxQjtBQUFBO0FBQUEsUUFUekIsNkRBU29CLGFBQUc7QUFBQTs7Ozs7b0JBQUgsVUFBRztBQUFBIiwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJoZWxsby52dWUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdCBzZXR1cCBsYW5nPVwidHNcIj5cbmltcG9ydCB7IHJlZiB9IGZyb20gJ3Z1ZSdcblxuY29uc3QgbXNnID0gcmVmKCdoZWxsbycpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8ZGl2PlxuICAgIHt7IG1zZyB9fVxuICAgIDxpbnB1dCB2LW1vZGVsPVwibXNnXCI+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHN0eWxlIHNjb3BlZD5cbi5oZWxsby1tc2cge1xuICBjb2xvcjogcmVkO1xufVxuPC9zdHlsZT5cbiJdLCJmaWxlIjoiL1VzZXJzL2ljZWJyZWFrZXIvRG9jdW1lbnRzL0dpdEh1Yi9vbmx5LXZ1ZS1ydW50aW1lL2FwcHMvZnVsbHktY29tcGlsZWQvc3JjL3BhZ2VzL2hlbGxvLnZ1ZSJ9
```

### js(css)

url: /src/pages/hello.vue?vue&type=style&index=0&scoped=9e67ff97&lang.css

```js
import {createHotContext as __vite__createHotContext} from "/@vite/client";
import.meta.hot = __vite__createHotContext("/src/pages/hello.vue?vue&type=style&index=0&scoped=9e67ff97&lang.css");
import {updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle} from "/@vite/client"
const __vite__id = "/path/to/your/only-vue-runtime/apps/fully-compiled/src/pages/hello.vue?vue&type=style&index=0&scoped=9e67ff97&lang.css"
const __vite__css = "\n.hello-msg[data-v-9e67ff97] {\n  color: red;\n}\n"
__vite__updateStyle(__vite__id, __vite__css)
import.meta.hot.accept()
import.meta.hot.prune( () => __vite__removeStyle(__vite__id))
```

## build

### js(vue)

assets/hello-BA-XKl4O.js

```js
import { d as defineComponent, f as ref, c as createElementBlock, e as createTextVNode, w as withDirectives, t as toDisplayString, v as vModelText, a as createBaseVNode, o as openBlock } from "./index-DdxCd2hx.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "hello",
  setup(__props) {
    const msg = ref("hello");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createTextVNode(toDisplayString(msg.value) + " ", 1),
        withDirectives(createBaseVNode("input", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => msg.value = $event)
        }, null, 512), [
          [vModelText, msg.value]
        ])
      ]);
    };
  }
});
const hello = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-57a43150"]]);
export {
  hello as default
};

```

### css

assets/hello-B0sj07xs.css

```css

.hello-msg[data-v-57a43150] {
  color: red;
}

```
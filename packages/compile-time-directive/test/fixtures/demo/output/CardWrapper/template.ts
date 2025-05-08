import { createCommentVNode as _createCommentVNode, renderSlot as _renderSlot, toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, withModifiers as _withModifiers, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = { class: "card-header" }
const _hoisted_2 = { class: "card-footer" }

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", {
    class: "card",
    onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.handleClick && _ctx.handleClick(...args)))
  }, [
    _createCommentVNode(" 具名插槽 header "),
    _createElementVNode("header", _hoisted_1, [
      _renderSlot(_ctx.$slots, "header", {}, () => [
        _createElementVNode("h3", null, _toDisplayString(_ctx.title), 1 /* TEXT */)
      ])
    ]),
    _createCommentVNode(" 默认插槽 content "),
    _createElementVNode("section", {
      class: "card-body",
      onClick: _cache[0] || (_cache[0] = _withModifiers((...args) => (_ctx.addCountClick && _ctx.addCountClick(...args)), ["stop"]))
    }, [
      _renderSlot(_ctx.$slots, "default", {}, () => [
        _cache[2] || (_cache[2] = _createElementVNode("p", null, "默认内容区域（没有传默认插槽就展示我）", -1 /* HOISTED */))
      ])
    ]),
    _createCommentVNode(" 作用域插槽 footer，向插槽提供数据 "),
    _createElementVNode("footer", _hoisted_2, [
      _renderSlot(_ctx.$slots, "footer", {
        date: _ctx.formattedDate,
        count: _ctx.clickCount
      }, () => [
        _createElementVNode("small", null, "默认 footer：" + _toDisplayString(_ctx.formattedDate), 1 /* TEXT */)
      ])
    ])
  ]))
}
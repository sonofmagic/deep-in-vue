# v-model 的本质

在 Vue 3 中，`v-model` 指令的本质发生了变化，相比于 Vue 2，Vue 3 中的 `v-model` 更加灵活，支持双向绑定的同时也可以定制化绑定的行为。为了理解 `v-model` 在 Vue 3 中的本质，我们需要从多个方面来探讨。

## 1. **`v-model` 的传统作用**

在 Vue 中，`v-model` 被广泛用于在父组件和子组件之间实现双向数据绑定。它将子组件的内部状态与父组件的外部状态同步，使得父子组件可以共享同一份数据，通常用于表单控件（如输入框、选择框等）和自定义组件。

- **双向绑定**：`v-model` 指令让数据能在父组件和子组件之间来回流动。父组件的数据通过 `v-bind` 传递给子组件，子组件通过事件将更新反向传递给父组件。

## 2. **Vue 3 中的 `v-model`**

Vue 3 的 `v-model` 指令与 Vue 2 的实现有了一些关键的变化，主要体现在以下几点：

- **支持多个 `v-model` 绑定**：Vue 3 支持在同一个组件上使用多个 `v-model` 指令，允许你在不同的属性上进行双向绑定。
- **自定义模型值的名称**：在 Vue 3 中，`v-model` 的 `modelValue` prop 和 `update:modelValue` 事件变得更加明确和灵活。
- **支持修改绑定的事件和属性名**：Vue 3 中你可以自定义 `v-model` 使用的属性和事件的名称，而不仅仅局限于 `value` 和 `input`。

## 3. **`v-model` 的工作原理（Vue 3）**

在 Vue 3 中，`v-model` 指令本质上是通过绑定一个 `modelValue` 属性和一个 `update:modelValue` 事件来实现双向绑定的。

### **组件内部实现：**
假设你有一个自定义组件，它会接收一个 `modelValue` 属性，并通过一个事件（通常是 `update:modelValue`）向父组件发送更新。

```js
// 子组件 CustomInput.vue
<template>
  <input :value="modelValue" @input="onInput">
</template>

<script>
export default {
  props: {
    modelValue: { // 双向绑定的数据
      type: String,
      default: ''
    }
  },
  methods: {
    onInput(event) {
      // 通过触发 update:modelValue 事件来更新父组件的数据
      this.$emit('update:modelValue', event.target.value);
    }
  }
};
</script>
```

在父组件中，你可以这样使用 `v-model` 来进行双向绑定：

```js
// 父组件 Parent.vue
<template>
  <CustomInput v-model="text"/>
</template>

<script>
import CustomInput from './CustomInput.vue';

export default {
  components: { CustomInput },
  data() {
    return {
      text: 'Hello, Vue 3!'
    };
  }
};
</script>
```

- **`modelValue`**：这是自定义组件接收的属性，Vue 3 默认将 `v-model` 绑定的属性命名为 `modelValue`。
- **`update:modelValue`**：这是子组件发出的事件，Vue 会在值改变时触发该事件，从而更新父组件的数据。

### **`v-model` 实际上做了什么**：
- 当你使用 `v-model="text"` 时，Vue 会在内部处理为：
  - 父组件的 `text` 数据作为 `modelValue` 传递给子组件。
  - 当子组件通过 `$emit('update:modelValue', newValue)` 触发事件时，父组件的 `text` 数据会被更新。

## 4. **多个 `v-model` 的支持**

Vue 3 允许在同一个组件上使用多个 `v-model`，通过为不同的绑定指定不同的 `prop` 和 `event` 名称。你可以使用 `modelValue` 之外的属性名作为 `v-model` 绑定的目标。

```js
// 子组件 CustomInput.vue
<template>
  <input :value="modelValue" @input="onInput">
</template>

<script>
export default {
  props: {
    modelValue: String, // 默认的 v-model 属性
    additionalValue: String // 第二个 v-model 属性
  },
  emits: ['update:modelValue', 'update:additionalValue'],
  methods: {
    onInput(event) {
      // 根据传递的属性触发事件
      this.$emit('update:modelValue', event.target.value);
    }
  }
};
</script>
```

在父组件中使用多个 `v-model`：

```js
<template>
  <CustomInput v-model="text" v-model:additionalValue="additionalText"/>
</template>

<script>
import CustomInput from './CustomInput.vue';

export default {
  components: { CustomInput },
  data() {
    return {
      text: 'Hello',
      additionalText: 'World'
    };
  }
};
</script>
```

- **`v-model`**：会自动绑定 `modelValue`。
- **`v-model:additionalValue`**：会绑定 `additionalValue`。

这种方式让你可以更加灵活地处理组件中的多个双向绑定。

## 5. **`v-model` 的自定义事件和属性**

除了默认的 `modelValue` 和 `update:modelValue`，你还可以在组件中自定义用于双向绑定的属性和事件名称。

```js
// 子组件 CustomInput.vue
<template>
  <input :value="inputValue" @input="onInput">
</template>

<script>
export default {
  props: {
    inputValue: String // 自定义的 prop
  },
  emits: ['update:inputValue'], // 自定义的事件
  methods: {
    onInput(event) {
      // 自定义事件触发
      this.$emit('update:inputValue', event.target.value);
    }
  }
};
</script>
```

在父组件中使用：

```js
<template>
  <CustomInput v-model:inputValue="text"/>
</template>
```

## 6. **总结：`v-model` 本质**

- **双向绑定的核心**：Vue 3 的 `v-model` 本质上是通过 `modelValue` 作为绑定的 prop，`update:modelValue` 作为更新事件来实现的双向绑定。
- **灵活性**：Vue 3 提供了更大的灵活性，允许你在同一个组件上使用多个 `v-model` 绑定，或者自定义事件和属性名称。
- **适配性**：通过自定义事件和属性，你可以更精确地控制组件的双向绑定，避免了 `v-model` 在 Vue 2 中的限制。
  
Vue 3 中的 `v-model` 提供了比 Vue 2 更加强大和灵活的双向绑定能力，能够支持更多的场景，包括多个绑定、绑定属性和事件的自定义等功能。
<script setup lang="ts">
defineSlots()
</script>

<template>
  <div>
    <button>
      <slot />
    </button>
  </div>
</template>

<style lang="css">
.ice-btn {
  display: inline-block;
  padding: 0.5em 1em;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: #333;
  cursor: pointer;
  outline: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #e0e0e0;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgb(0 0 0 / 10%);
  }
}
</style>

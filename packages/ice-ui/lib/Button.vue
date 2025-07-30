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
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  outline: none;
  &:hover {
    background-color: #f5f5f5;
  }
  &:active {
    background-color: #e0e0e0;
  }
  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
}
</style>

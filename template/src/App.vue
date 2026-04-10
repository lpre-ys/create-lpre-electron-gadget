<script setup lang="ts">
const now = new Date();
</script>

<template>
  <main class="gadget-shell">
    <h1>__PRODUCT_NAME__</h1>
    <p>Always-on-top gadget template</p>
    <p>{{ now.toLocaleString() }}</p>
  </main>
</template>

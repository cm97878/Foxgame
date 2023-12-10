<template>
    <div class="node-boundary" :class="{ 'selected-node': mapStore.selectedNode.id === props.data.nodeId}">
        {{ data.areaName }}
    </div>
</template>

<script setup lang="ts">
  import { useMapStore } from '@/stores/mapStore.js';
  const mapStore = useMapStore();

  const name = "customNode";

  const props = defineProps({
    //id: String,
    data: {
      type: Object,
      required: true,
    },
  })

  console.log(props)

</script>
<style>
  .node-boundary {
    border: 2px solid black;
    padding: 10px;
    border-radius: 20px;
    width: 100px;
    font-size: 16px;
    text-align: center;
    border-width: 3px;
    border-style: solid;
    background-color: #9ec93d;
    color: #222;

    
  }

  .selected-node {
    background:grey;
  }

</style>
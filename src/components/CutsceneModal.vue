<template>
    <div class="modal-container">
      <div class="modal-body">
        <div class="modal-image"></div>
        <div class="modal-text"><span v-html="eventStore.sceneDesc"></span></div>
        <div class="modal-action">
          <button v-for="choice in activeScene?.choices" @click="eventStore.endCutscene(choice.id)" class="modal-button" :class="{greyed: disableLeave && choice.id === 1}" :hidden="hideLeave && choice.id === 1"> {{ choice.label }}</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import { useEventStore } from '@/stores/eventStore';
    import { storeToRefs } from 'pinia';
import { computed } from 'vue';

    const eventStore = useEventStore();
    const { activeScene } = storeToRefs(eventStore);

    const disableLeave = computed(() =>{
        if(eventStore.soulDenyCounter >= 9) {
            return true;
        }
    })
    const hideLeave = computed(() => {
        if(eventStore.soulDenyCounter >= 18) {
            return true;
        }
    })
  </script>
  
  <style>
    .modal-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: #cececeb5;
        z-index: 5;
    }
    .modal-body {
        background-image: linear-gradient(rgb(53, 53, 53), rgb(25, 25, 25));
        border: 2px solid #74a2cf;
        border-radius: 10px;
        text-align: center;
        padding: 20px 40px;
        width: 80%;
        height: 80%;
        display: flex;
        flex-direction: column;
    }
    .modal-text {
        margin-top: 10px;
        font-size: 24px;
    }
    .modal-image {
        flex-grow: 1;
        background-color: grey;
        border-radius: 5px;
        margin-top: 10px;
    }
    .modal-action {
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      gap: 40px;
      justify-content: center;
    }
    .modal-button {
      cursor: pointer;
      height: 30px;
      padding: 0 25px;
      border: 2px solid #74a2cf;
      border-radius: 5px;
      background-color: #80b2e4;
      color: #fff;
    }

    .greyed {
        background-color: rgb(117, 117, 117);
    }
    .greyed:active {
    box-shadow: none;
    }
    .greyed:hover {
        background-color: rgb(117, 117, 117);
        color: rgb(247, 247, 247);
        cursor: default;
    }
  </style>
  
  
<template>
  <div>
    <div class="file-item" v-for="file in files" :key="file[keyFieldName]">
      <b-icon-file-earmark class="mr-1"></b-icon-file-earmark>
      <b-link :href="file[urlFieldName]" target="_blank"
        >{{ file[labelFieldName] ? file[labelFieldName] : "Без названия" }}
      </b-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: { required: true },
    labelFieldName: { default: "name" },
    urlFieldName: { default: "file" },
    keyFieldName: { default: "id" },
  },
}
</script>

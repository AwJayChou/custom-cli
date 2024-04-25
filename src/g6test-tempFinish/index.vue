<template>
  <div hideSearch class="industry-center">
    <template slot="title">
      
    </template>
    <div class="slogan fs-38 p-t-12 font-weight">test!!!!!</div>
    <!-- <template slot="navBar">
      <el-card class="box-card m-t-10" shadow="never">
        <IndustryList />
      </el-card>
    </template> -->
   <div>
    <RelationGraph />
   </div>
  </div>
</template>

<script>
// import MacroInfo from '@/components/macroInfo'
// import IndustryList from '../components/industry-list'
import RelationGraph from './relationGraph.vue'
export default {
  components: {
    // MacroInfo,
    // IndustryList,
    RelationGraph
  }
}
</script>
<style lang="scss" scoped>
.industry-center {
  &.bg {
    height: 220px;
  }
}
</style>
<style>
</style>
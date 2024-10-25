<template>
  <div>
    <div ref="container" style="width: 100%; height: calc(100vh - 120px)"></div>
  </div>
</template>
<script>
import { Graph } from '@antv/g6';
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      graph: null
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.initGraph();
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    initGraph() {
      const container = this.$refs.container;

      this.$api.cmdb.cientity.getCiEntityGraphItem().then(res => {
        this.graph = new Graph({
          behaviors: ['zoom-canvas', 'drag-canvas', 'drag-element'],
          container: container,
          autoResize: true,
          autoFit: 'view',
          animation: false,
          layout: {
            type: 'combo-combined',
            comboPadding: 2
          },
          node: {
            style: {
              size: 20,
              labelText: d => d.name
            },
            palette: {
              type: 'group',
              field: d => d.combo
            }
          },
          data: { nodes: res.Return.nodes, combos: res.Return.combos }
        });
        this.graph.render();
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>

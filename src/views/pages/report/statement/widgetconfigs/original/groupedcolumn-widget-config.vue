<template>
  <div class="pb-nm">
    <div class="ivu-form-item tsform-item ivu-form-label-top">
      <label class="ivu-form-item-label overflow">
        {{ $t('term.report.axis.showlegend') }}
      </label>
      <div class="ivu-form-item-content">
        <TsFormSwitch
          :value="config.legend.visible"
          :true-value="true"
          :false-value="false"
          @change="
            val => {
              setConfigValue('legend.visible', val);
            }
          "
        ></TsFormSwitch>
      </div>
    </div>
    <div v-if="config.legend.visible" class="ivu-form-item tsform-item ivu-form-label-top">
      <label class="ivu-form-item-label overflow">
        {{ $t('term.report.axis.legendposition') }}
      </label>
      <div class="ivu-form-item-content">
        <TsFormSelect
          :value="config.legend.position"
          :transfer="true"
          :clearable="false"
          :dataList="positionList"
          @change="
            val => {
              setConfigValue('legend.position', val);
            }
          "
        ></TsFormSelect>
      </div>
    </div>
    <TsFormItem :label="$t('term.report.axis.yaxisshow')" labelPosition="top">
      <TsFormSwitch
        :value="config.yAxis?.hasOwnProperty('visible')?config.yAxis.visible:true"
        :true-value="true"
        :false-value="false"
        @change="
          val => {
            setConfigValue('yAxis.visible', val);
          }
        "
      ></TsFormSwitch>
    </TsFormItem>
    <TsFormItem :label="$t('term.report.axis.xaxisshow')" labelPosition="top">
      <TsFormSwitch
        :value="config.xAxis ? true : false"
        :true-value="true"
        :false-value="false"
        @change="
          val => {
            if (val) {
              setConfigValue('xAxis', {
                title: { text: '' }
              });
            } else {
              setConfigValue('xAxis', val);
            }
          }
        "
      ></TsFormSwitch>
    </TsFormItem>
    <div class="ivu-form-item tsform-item ivu-form-label-top">
      <label class="ivu-form-item-label overflow">
        {{ $t('term.report.axis.columnwidth') }}
      </label>
      <div class="ivu-form-item-content">
        <div class="pl-md pr-md">
          <Slider
            :value="config.columnWidthRatio"
            :min="0.1"
            :max="0.9"
            :step="0.1"
            show-tip="never"
            @on-change="
              val => {
                setConfigValue('columnWidthRatio', val);
              }
            "
          ></Slider>
        </div>
      </div>
    </div>
    <TsFormItem :label="$t('term.report.showdata')" labelPosition="top">
      <TsFormSwitch
        :value="config.label ? true : false"
        :true-value="true"
        :false-value="false"
        @change="
          val => {
            if (val) {
              setConfigValue('label', {
                position: 'middle',
                content: item => {
                  return item.yField && Math.floor(item.yField * 100) / 100;
                }
              });
            } else {
              setConfigValue('label', val);
            }
          }
        "
      ></TsFormSwitch>
    </TsFormItem>
    <TsFormItem label="统计数据字体大小" labelPosition="top">
      <TsFormSelect
        :value="config.labelFontSize || 12"
        :dataList="axisFontSizeList"
        border="border"
        transfer
        @change="
          val => {
            setConfigValue('labelFontSize', val || 12);
            setConfigValue('label.style.fontSize', val || 12);
          }
        "
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem label="辅助线" labelPosition="top">
      <TsFormSwitch
        :value="!!config?.yAxis?.hasOwnProperty('grid')?!!config.yAxis.grid:true"
        :true-value="true"
        :false-value="false"
        @change="
          val => {
            if(typeof config.yAxis ==='boolean'){
              setConfigValue('yAxis', {});
            }
            setConfigValue('yAxis.grid.visible', val);
          }
        "
      ></TsFormSwitch>
    </TsFormItem>
    <TsFormItem label="坐标轴字体大小" labelPosition="top">
      <TsFormSelect
        :value="config.axisFontSize || 12"
        :dataList="axisFontSizeList"
        border="border"
        transfer
        @change="
          val => {
            setConfigValue('axisFontSize', val || defaultFontSize);
            setConfigValue('xAxis.title.style.fontSize', val || defaultFontSize);
            setConfigValue('xAxis.label.style.fontSize', val || defaultFontSize);
            setConfigValue('yAxis.label.style.fontSize', val || defaultFontSize);
            setConfigValue('yAxis.title.style.fontSize', val || defaultFontSize);
          }
        "
      ></TsFormSelect>
    </TsFormItem>
  </div>
</template>
<script>
import { WidgetBaseConfig } from './base-config.js';
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
    //TsFormRadio:()=>import('@/resources/plugins/TsForm/TsFormRadio'),
    //TsFormInput:()=>import('@/resources/plugins/TsForm/TsFormInput')
  },
  extends: WidgetBaseConfig,
  props: { config: { type: Object } },
  data() {
    return {
      positionList: [
        { value: 'top-left', text: this.$t('term.report.positions.topleft') },
        { value: 'top', text: this.$t('term.report.positions.top') },
        { value: 'top-right', text: this.$t('term.report.positions.topright') },
        { value: 'bottom-left', text: this.$t('term.report.positions.bottomleft') },
        { value: 'bottom', text: this.$t('term.report.positions.bottom') },
        { value: 'bottom-right', text: this.$t('term.report.positions.bottomright') },
        { value: 'left-top', text: this.$t('term.report.positions.lefttop') },
        { value: 'left', text: this.$t('term.report.positions.left') },
        { value: 'left-bottom', text: this.$t('term.report.positions.leftbottom') },
        { value: 'right-top', text: this.$t('term.report.positions.righttop') },
        { value: 'right', text: this.$t('term.report.positions.right') },
        { value: 'right-bottom', text: this.$t('term.report.positions.rightbottom') }
      ]
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    setConfigValue(attrName, attrValue) {
      if (attrName) {
        this.$emit('setConfig', attrName, attrValue);
      }
    }
  },
  filter: {},
  computed: {},
  watch: {

  }
};
</script>
<style lang="less"></style>

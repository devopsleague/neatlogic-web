<template>
  <div class="pb-nm">
    <div class="ivu-form-item tsform-item ivu-form-label-top">
      <label class="ivu-form-item-label overflow">{{ $t('term.report.axis.yaxisshow') }}</label>
      <div class="ivu-form-item-content">
        <TsFormSwitch
          :value="config.yAxis ? true : false"
          :true-value="true"
          :false-value="false"
          @change="
            val => {
              if (val) {
                setConfigValue('yAxis', { title: { text: '' } });
              } else {
                setConfigValue('yAxis', val);
              }
            }
          "
        ></TsFormSwitch>
      </div>
    </div>
    <div v-if="config.yAxis" class="ivu-form-item tsform-item ivu-form-label-top">
      <label class="ivu-form-item-label overflow">{{ $t('term.report.axis.yaxistitle') }}</label>
      <div class="ivu-form-item-content">
        <TsFormInput
          :value="config.yAxis.title && config.yAxis.title.text"
          border="border"
          @change="
            val => {
              setConfigValue('yAxis.title.text', val);
            }
          "
        ></TsFormInput>
      </div>
    </div>
    <div class="ivu-form-item tsform-item ivu-form-label-top">
      <label class="ivu-form-item-label overflow">{{ $t('term.report.axis.xaxisshow') }}</label>
      <div class="ivu-form-item-content">
        <TsFormSwitch
          :value="config.xAxis ? true : false"
          :true-value="true"
          :false-value="false"
          @change="
            val => {
              if (val) {
                setConfigValue('xAxis', {
                  label: {
                    autoHide: true,
                    autoEllipsis: true
                  },
                  title: { text: '' }
                });
              } else {
                setConfigValue('xAxis', val);
              }
            }
          "
        ></TsFormSwitch>
      </div>
    </div>
    <div v-if="config.xAxis" class="ivu-form-item tsform-item ivu-form-label-top">
      <label class="ivu-form-item-label overflow">{{ $t('term.report.axis.xaxistitle') }}</label>
      <div class="ivu-form-item-content">
        <TsFormInput
          :value="config.xAxis.title && config.xAxis.title.text"
          border="border"
          @change="
            val => {
              setConfigValue('xAxis.title.text', val);
            }
          "
        ></TsFormInput>
      </div>
    </div>
    <div class="ivu-form-item tsform-item ivu-form-label-top">
      <label class="ivu-form-item-label overflow">{{ $t('term.report.axis.columnwidth') }}</label>
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
    <TsFormItem :label="$t('term.report.customcolor')" labelPosition="top">
      <ColorPicker
        :value="config.color"
        :transfer="true"
        alpha
        recommend
        class="colorPicker"
        transfer-class-name="color-picker-transfer-class"
        @on-change="
          val => {
            setConfigValue('color', val);
          }
        "
      />
    </TsFormItem>
    <TsFormItem :label="$t('term.report.statisticcolor')" labelPosition="top">
      <ColorPicker
        :value="config.label && config.label.style && config.label.style.fill"
        :transfer="true"
        alpha
        recommend
        class="colorPicker"
        transfer-class-name="color-picker-transfer-class"
        @on-change="
          val => {
            if(val){
              setConfigValue('label', {
                visible: true,
                position: 'top',
                offset: 0,
                layout: [
                  {
                    type: 'limit-in-plot' // 限制文本标签在图形范围内，可以防止文本标签于图表组件如坐标轴发生重叠遮挡
                  }
                ],
                style: {
                  fill: val,
                },
              })
            }else{
              deleteConfigValue('label.style.fill');
            }
          }
        "
      />
    </TsFormItem>
    <TsFormItem label="辅助线" labelPosition="top">
      <TsFormSwitch
        :value="!config.yAxis || !!config.yAxis?.hasOwnProperty('grid')?!!config.yAxis.grid.visible:true"
        :true-value="true"
        :false-value="false"
        @change="
          val => {
            setConfigValue('yAxis.grid.visible', val);
          }
        "
      ></TsFormSwitch>
    </TsFormItem>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput')
  },
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
        { value: 'left', text: this.$t('term.report.positions.left')},
        { value: 'left-bottom', text: this.$t('term.report.positions.leftbottom') },
        { value: 'right-top', text: this.$t('term.report.positions.righttop') },
        { value: 'right', text: this.$t('term.report.positions.right') },
        { value: 'right-bottom', text: this.$t('term.report.positions.rightbottom') }
      ],
      labelTypeList: [
        { value: 'inner', text: this.$t('term.report.positions.inner') },
        { value: 'outer', text: this.$t('term.report.positions.outer') }
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
    },
    deleteConfigValue(attrName) {
      if (attrName) {
        this.$emit('setConfig', attrName);
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped></style>

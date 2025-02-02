
<template>
  <div class="argument-box">
    <div class="pt-nm pb-sm text-title tips"><span>{{ $t('term.autoexec.freeparameter') }}</span></div>
    <div class="pb-sm">
      <span :class="{'require-label':config.isRequired}">{{ config.name }}</span>
      <template v-if="config.description">
        <span>
          <Tooltip
            placement="top"
            theme="light"
            transfer
            max-width="500"
            :content="config.description"
          >
            <i class="tsfont-info-o text-tip fz10"></i>
          </Tooltip>
        </span>
      </template>
    </div>
    <div v-if="value.length > 0">
      <div v-for="(l, lindex) in value" :key="lindex" class="item-box">
        <div class="item-list">
          <Row v-if="canEdit" :gutter="8">
            <Col span="6">
              <TsFormSelect
                v-model="configParamList[lindex].mappingMode"
                :dataList="getList(inputTypeList, isFirst)"
                v-bind="styleConfig"
                :validateList="validateList"
                :disabled="!canEdit"
                @change="clearValue(configParamList[lindex])"
              ></TsFormSelect>
            </Col>
            <Col v-if="l.mappingMode == 'constant'" span="17">
              <TsFormInput
                v-model="configParamList[lindex].value"
                :disabled="!canEdit"
                :validateList="validateList"
                @on-change="val=>{changeValue(val,lindex,'constant')}"
              ></TsFormInput>
            </Col>
            <Col v-else-if="configParamList[lindex].mappingMode == 'runtimeparam'" span="17">
              <TsFormSelect
                v-model="configParamList[lindex].value"
                :dataList="paramList"
                transfer
                textName="name"
                valueName="key"
                :validateList="validateList"
                :disabled="!canEdit"
                :firstSelect="false"
                :firstText="$t('term.autoexec.jobparam')"
                :firstLi="true"
                @first="gotoAddParameter"
                @on-change="val=>{changeValue(val,lindex,'runtimeparam')}"
              ></TsFormSelect>
            </Col>
            <Col v-else-if="configParamList[lindex].mappingMode.indexOf('prenode')==0" span="17">
              <PrenodeSelect
                :value="configParamList[lindex].value"
                :dataList="getPrevList(prevList)"
                :disabled="!canEdit"
                :validateList="validateList"
                @updateVal="(val)=>{changeValue(val,lindex,'prenode')}"
              ></PrenodeSelect>
            </Col>
            <Col v-else-if="configParamList[lindex].mappingMode == 'profile'" span="17">
              <TsRow :gutter="8">
                <Col :span="10">
                  <TsFormSelect
                    v-model="configParamList[lindex].key"
                    :dataList="profileArgumentList"
                    transfer
                    textName="name"
                    valueName="key"
                    :validateList="validateList"
                    :disabled="!canEdit"
                    :firstSelect="false"
                    @on-change="(value)=>{argumentKeyChange(value,lindex);}"
                  ></TsFormSelect>
                </Col>
                <Col :span="14">
                  <TsFormInput
                    v-if="configParamList[lindex].key"
                    :value="getProfileParamValue(configParamList[lindex].key)"
                    :disabled="true"
                    border="border"
                  ></TsFormInput>
                </Col>
              </tsrow></Col>
            <Col v-if="l.mappingMode == 'globalparam'" span="17">
              <Globalparam v-model="configParamList[lindex].value" @change="(val) => { changeValue(val, lindex) }"></Globalparam>
            </Col>
          </Row>
          <template v-else>
            <div class="readonly-main">
              <div class="readonly-type overflow pr-nm" :title="getTypeName(configParamList[lindex].mappingMode)">{{ getTypeName(configParamList[lindex].mappingMode) }}</div>
              <div class="overflow">
                <template v-if="configParamList[lindex].mappingMode.indexOf('prenode')==0">
                  <TsFormCascader
                    :value="configParamList[lindex].value"
                    :dataList="getPrevList(prevList)"
                    :format="format"
                    readonly
                  ></TsFormCascader>
                </template>
                <span v-if="l.mappingMode === 'profile'" :title="l.name">
                  <span class="pr-md">{{ l.key }}</span><span class="text-tip">{{ getProfileParamValue(l.key) }}</span>
                </span>
                <span v-else :title="l.name">
                  <span class="text-tip">{{ l.name }}</span>
                </span>
              </div>
            </div>
          </template>
          <template v-if="canEdit && !config.argumentCount">
            <div v-if="!config.isRequired || (config.isRequired && configParamList.length > 1)" class="delete-btn tsfont-trash-o text-tip-active" @click="delParam(lindex)"></div>
          </template>
        </div>
      </div>
    </div>
    <div v-if="canEdit && !config.argumentCount" class="pt-sm">
      <span class="tsfont-plus text-href" @click="addParam">{{ $t('page.param') }}</span>
    </div>
  </div>
</template>
<script>
import TsFormSelect from '@/resources/plugins/TsForm/TsFormSelect.vue';
import items from '@/views/pages/autoexec/components/param/view/index.js';
export default {
  name: '',
  inject: {
    openParamsSetting: {
      default: () => {}
    },
    getCombopConfig: { //组合工具详情
      default: () => {}
    }
  },
  components: {
    TsFormSelect,
    ...items,
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput.vue'),
    Globalparam: () => import('./globalparam.vue'),
    PrenodeSelect: () => import('./prenode-select.vue'),
    TsFormCascader: () => import('@/resources/plugins/TsForm/TsFormCascader')
  },
  filters: {
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    config: Object,
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    prevList: Array,
    canEdit: [Boolean, Number],
    isFirst: [Boolean, Number],
    paramList: { //作业参数
      type: Array,
      default() {
        return [];
      }
    },
    paramsTypeList: { //有哪些参数类型和对应默认数据
      type: Array,
      default() {
        return [];
      }
    },
    inputTypeList: {
      type: Array,
      default() {
        return [];
      }
    },
    profileId: {
      type: Number,
      default: null
    } //预置参数集
  },
  data() {
    return {
      configParamList: [],
      styleConfig: {
        border: 'border',
        transfer: true,
        clearable: false
      },
      validateList: ['required'],
      profileParamVoList: [],
      profileArgumentList: [], //预置参数集自由参数
      overrideProfileList: [] //覆盖参数集列表
    };
  },
  beforeCreate() {},
  async created() {
    if (this.profileId) {
      await this.getProfileParamsList(this.profileId, true);
    } else {
      this.profileParamVoList = [];
    }
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    getProfileParamValue(key) {
      let arg = this.profileArgumentList.find(a => a.key === key);
      if (arg) {
        return arg.defaultValue;
      }
      return;
    },
    argumentKeyChange(value, lindex) {
      this.configParamList[lindex].value = this.configParamList[lindex].key;
    },
    async getProfileParamsList(id, isFirst) {
      let findItem = null;
      if (!this.$utils.isEmpty(this.overrideProfileList)) {
        findItem = this.overrideProfileList.find(p => p.profileId === this.profileId);
      }
      if (findItem) {
        this.profileParamVoList = findItem.paramList || [];
        this.profileArgumentList = this.profileParamVoList.filter(o => o.type === 'argument');
      } else {
        await this.$api.autoexec.profile.getProfileDetailById(id).then((res) => {
          if (res.Status == 'OK') {
            this.profileParamVoList = res.Return.profileParamVoList || [];
            this.profileArgumentList = this.profileParamVoList.filter(o => o.type === 'argument');
          }
        });
      }
    },
    clearValue(item) {
      this.$set(item, 'value', '');
    },
    addParam() {
      let obj = {
        mappingMode: 'constant',
        value: this.$utils.deepClone(this.config ? this.config.defaultValue : ''),
        component: this.config.type,
        name: ''
      };
      this.configParamList.push(obj);
    },
    valid() {
      //校验输入参数是否通过
      if (this.$el.querySelectorAll('.form-li').length) {
        let isVaild = true;
        let childrendom = this.$el.querySelectorAll('.form-li');
        if (childrendom && childrendom.length > 0) {
          childrendom.forEach(children => {
            if (children.__vue__ && children.__vue__.valid) {
              if (!children.__vue__.valid()) {
                isVaild = false;
              }
            }
          });
        }
        this.$forceUpdate();
        return isVaild;
      } else {
        return true;
      }
    },
    delParam(index) {
      this.configParamList.splice(index, 1);
    },
    changeValue(val, index, type) {
      if (type == 'runtimeparam') {
        let findRuntimeparam = this.paramList.find(r => r.key == val);
        this.$set(this.configParamList[index], 'name', findRuntimeparam ? findRuntimeparam.name : '');
        this.$set(this.configParamList[index], 'key', null);
      } else if (type == 'prenode') {
        this.$set(this.configParamList[index], 'value', val);
        this.$set(this.configParamList[index], 'name', '');
        this.$set(this.configParamList[index], 'key', null);
      } else if (type == 'profile') {
        this.$set(this.configParamList[index], 'value', this.configParamList[lindex].key);
      } else {
        this.$set(this.configParamList[index], 'name', val);
        this.$set(this.configParamList[index], 'key', null);
      }
    },
    gotoAddParameter() { //添加作业参数
      this.openParamsSetting();
    },
    prevListConversion(arr) {
      let level1 = 'combopUuid';//获取一级属性名称: 阶段
      let level2 = 'operationUuid';//获取二级属性名称：工具
      let level3 = 'key';//获取三级属性名称：参数
      let list = Array.from(new Set(
        arr.map(item => {
          return {
            value: item['combopUuid'],
            label: item['combopName']
          };
        })));
      let subList = [];
      list.forEach(res => {
        arr.forEach(ele => {
          if (ele[level1] === res.value) {
            let nameArr = subList.map(item => item.value);
            if (nameArr.indexOf(res.value) !== -1) {
              let nameArr2 = subList[nameArr.indexOf(res.value)].children.map(item => item.value);
              if (nameArr2.indexOf(ele[level2]) !== -1) {
                if (!subList[nameArr.indexOf(res.value)].children[nameArr2.indexOf(ele[level2])].children.find(c => c.label == ele['name'])) {
                  subList[nameArr.indexOf(res.value)].children[nameArr2.indexOf(ele[level2])].children.push({
                    value: ele[level3],
                    label: ele['name']
                  });
                }
              } else {
                subList[nameArr.indexOf(res.value)].children.push({
                  value: ele[level2],
                  label: ele['operationName'] + (ele.operationLetter ? ('_' + ele.operationLetter) : '') + (ele.operationDes ? '[' + ele.operationDes + ']' : ''),
                  operationDes: ele.operationDes,
                  children: [{
                    value: ele[level3],
                    label: ele['name']
                  }]
                });
              }
            } else {
              subList.push({
                value: res.value,
                label: res.label,
                children: [{
                  value: ele[level2],
                  label: ele['operationName'] + (ele.operationLetter ? ('_' + ele.operationLetter) : '') + (ele.operationDes ? '[' + ele.operationDes + ']' : ''),
                  operationDes: ele.operationDes,
                  children: [{
                    value: ele[level3],
                    label: ele['name']
                  }]
                }]
              });
            }
          }
        });
      });
      return subList;
    },
    format(labels, selectedData) {
      let data = selectedData && selectedData.length > 1 ? selectedData[1] : false;
      let text = '';
      if (labels && labels.length > 0) {
        text = labels[labels.length - 1] + (data && data.operationDes ? '[' + data.operationDes + ']' : '');
      }
      return text;
    }
  },
  computed: {
    getList() {
      return function(list, isFirst) {
        return list.filter(l => {
          return isFirst ? (l.value != 'isempty' && l.value.indexOf('prenode') == -1) : (l.value != 'isempty');
        });
      };
    },
    getPrevList() {
      return function(list) {
        let li = [];
        if (list && list.length) {
          li = this.prevListConversion(list); //引用上游参数名-选项不受限制 改为名和值都不受限制
        }
        return li;
      };
    },
    getTypeName() {
      return function(type) {
        let currentItem = this.inputTypeList.find(t => {
          return t.value == type;
        });
        return currentItem ? currentItem.text : '';
      };
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val && !this.$utils.isEmpty(val)) {
          let _this = this;
          if (_this.value.length) {
            this.configParamList = _this.value.map(v => {
              return {
                mappingMode: v.mappingMode,
                value: _this.$utils.deepClone(v.value),
                component: val.type,
                name: v.name || '',
                key: v.key || ''
              };
            });
          } else {
            let obj = {
              mappingMode: 'constant',
              value: this.$utils.deepClone(this.config ? this.config.defaultValue : ''),
              component: val.type,
              name: this.$utils.deepClone(this.config ? this.config.defaultValue : ''),
              key: this.$utils.deepClone(this.config ? this.config.key : '')
            };
            if (val.argumentCount && val.argumentCount > 0) { //限制自由参数个数
              for (let i = 0; i < val.argumentCount; i++) {
                this.configParamList.push(this.$utils.deepClone(obj));
              }
            } else {
              this.configParamList = this.config.isRequired ? [obj] : [];
            }
          }
        } else {
          this.configParamList = [];
        }
      },
      deep: true,
      immediate: true
    },
    configParamList: {
      handler(val) {
        let currentConfig = val.length
          ? val.map(v => {
            return {
              mappingMode: v.mappingMode,
              value: this.$utils.deepClone(v.value),
              name: v.name,
              key: v.key || ''
            };
          }) : [];
        let isSame = this.$utils.isSame(currentConfig, this.value);
        if (!isSame) {
          this.$emit('change', currentConfig);
        }
      },
      deep: true,
      immediate: true
    },
    profileId(val) {
      if (val) {
        this.getProfileParamsList(val);
      } else {
        this.profileParamVoList = [];
        this.profileArgumentList = [];
        this.configParamList.forEach(item => {
          if (item.mappingMode == 'profile') {
            this.$set(item, 'mappingMode', 'constant');
            this.$set(item, 'value', null);
            this.$set(item, 'key', null);
          }
        });
      }
    },
    getCombopConfig: {
      handler(val) {
        if (val) {
          this.overrideProfileList = val.overrideProfileList || [];
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.item-box{
  &:not(:last-child){
    padding-bottom: 16px;
  }
}
.item-list{
  position: relative;
  padding-right: 10px;
  &:hover{
    .delete-btn{
      display: block;
    }
  }
  .delete-btn{
    display: none;
    position: absolute;
    right: 8px;
    top: 8px;
  }
}
.readonly-main{
  display: flex;
  justify-content: flex-start;
  .readonly-type{
    width: 120px;
  }
}
</style>

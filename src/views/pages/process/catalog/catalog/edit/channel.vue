<template>
  <div>
    <Loading v-if="loading" :loadingShow="loading"></Loading>
    <TsForm
      v-else
      ref="form"
      v-model="channelValue"
      :itemList="channelForm"
    >
      <template v-slot:processUuid>
        <div class="slotForm">
          <TsFormSelect
            v-model="channelValue.processUuid"
            v-bind="processConfig"
            :needCallback.sync="processConfig.needCallback"
            @searchCallback="refreshSuccess('process')"
          >
            <template v-slot:first-ul>
              <li class="tsfont-plus text-href first-slot" @click="gotoAddFlow">{{ $t('term.process.flow') }}</li>
            </template>
          </TsFormSelect>
          <div class="view">
            <div class="div-btn-contain action-group">
              <span class="action-item tsfont-rotate-right" @click="refresh('process')">{{ $t('page.refresh') }}</span>
              <span v-if="channelValue.processUuid && channelValue.processUuid != ''" class="action-item tsfont-eye" @click="viewProcess">{{ $t('page.view') }}</span>
              <span v-if="channelValue.processUuid && channelValue.processUuid != ''" class="action-item tsfont-edit" @click="gotoEditFlow">{{ $t('page.edit') }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:isActivePriority>
        <TsFormSwitch
          v-model="channelValue.isActivePriority"
          :trueValue="1"
          :falseValue="0"
          @on-change="changePriorty"
        ></TsFormSwitch>
        <template v-if="channelValue.isActivePriority">
          <div class="slotForm">
            <TsForm
              ref="priorityForm"
              v-model="channelValue.activePriorityConfig"
              :item-list="priorityFormConfig"
              :labelWidth="87"
            >
              <template v-slot:priorityUuidList>
                <TsFormSelect
                  ref="priority"
                  v-model="channelValue.activePriorityConfig.priorityUuidList"
                  v-bind="priorityConfig"
                  :needCallback.sync="priorityConfig.needCallback"
                  :selectItemList.sync="selectPriority"
                  @change="channelValue.activePriorityConfig.defaultPriorityUuid = ''"
                  @searchCallback="refreshSuccess('priority')"
                >
                  <template v-slot:first-ul>
                    <li class="tsfont-plus text-href first-slot" @click="gotoAddPiority(true)">{{ $t('page.priority') }}</li>
                  </template>
                </TsFormSelect>
                <div class="view">
                  <div class="div-btn-contain action-group">
                    <span class="action-item tsfont-rotate-right" @click="refresh('priority')">{{ $t('page.refresh') }}</span>
                    <span class="action-item tsfont-setting" @click="gotoAddPiority()">{{ $t('page.setting') }}</span>
                  </div>
                </div>
              </template>
            </TsForm>
          </div>
        </template>
      </template>
      <template v-slot:worktimeUuid>
        <div class="slotForm">
          <TsFormSelect
            v-model="channelValue.worktimeUuid"
            v-bind="worktimeConfig"
            :needCallback.sync="worktimeConfig.needCallback"
            @searchCallback="refreshSuccess('worktime')"
          >
            <template v-slot:first-ul>
              <li class="tsfont-plus text-href first-slot" @click="gotoAddWorktime(true)">{{ $t('term.process.serwindow') }}</li>
            </template>
          </TsFormSelect>
          <div class="view">
            <div class="div-btn-contain action-group">
              <span class="action-item tsfont-rotate-right" @click="refresh('worktime')">{{ $t('page.refresh') }}</span>
              <span class="action-item tsfont-setting" @click="gotoAddWorktime()">{{ $t('page.setting') }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:channelTypeUuid>
        <div class="slotForm">
          <TsFormSelect
            v-model="channelValue.channelTypeUuid"
            v-bind="channelTypeConfig"
            :needCallback.sync="channelTypeConfig.needCallback"
            @on-change="channelType"
            @searchCallback="refreshSuccess('channelType')"
          >
            <template v-slot:first-ul>
              <li class="tsfont-plus text-href first-slot" @click="gotoAddpChannelTyp(true)">{{ $t('term.process.sertype') }}</li>
            </template>
          </TsFormSelect>
          <div class="view">
            <div class="div-btn-contain action-group">
              <span class="action-item tsfont-rotate-right" @click="refresh('channelType')">{{ $t('page.refresh') }}</span>
              <span class="action-item tsfont-setting" @click="gotoAddpChannelTyp()">{{ $t('page.setting') }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:allowTranferReport>
        <!-- 允许转报 -->
        <div class="slotForm">
          <TsFormSwitch
            v-model="channelValue.config.allowTranferReport"
            :true-value="1"
            :false-value="0"
            @on-change="onChangeSwitch"
          ></TsFormSwitch>
        </div>
      </template>
      <template v-slot:channelRelationList>
        <!-- 转报设置 -->
        <div class="slotForm">
          <div>
            <TranferreportSetting ref="channelRelationList" :channelTypeUuid="channelValue.channelTypeUuid" :configChannelRelationList="channelValue.config.channelRelationList"></TranferreportSetting>
          </div>
          <div class="view">
            <div class="div-btn-contain action-group">
              <span class="action-item tsfont-rotate-right" @click="getRelarelation">{{ $t('page.refresh') }}</span>
              <span class="action-item tsfont-setting" @click="gotoRotationManage">{{ $t('page.setting') }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:icon>
        <a href="javascript:void(0)" @click="editIcon(channelValue.icon)">
          <i class="menuIcon text-grey border-color" :class="[channelValue.icon, { square: !channelValue.icon || channelValue.icon == '' }]"></i>
        </a>
      </template>
      <template v-slot:color>
        <RadioGroup v-model="channelValue.color">
          <Radio v-for="(color, cindex) in colorList" :key="cindex" :label="color">
            <div class="selectColor" :style="{ background: color }"></div>
          </Radio>
        </RadioGroup>
      </template>
    </TsForm>
    <div class="btnRightText">
      <Button
        v-if="!loading"
        class="save"
        type="primary"
        @click="save()"
      >{{ $t('page.save') }}</Button>
    </div>
    <TsDialog v-if="lookSitemapModel" :isShow.sync="lookSitemapModel" v-bind="sitmapDialogSetting">
      <ViewProcess :uuid="channelValue.processUuid"></ViewProcess>
    </TsDialog>
    <IconEdit :isShow="iseditIcon" :icon="selectedIcon" @close="updateIcon"></IconEdit>
  </div>
</template>
<script>
import TsForm from '@/resources/plugins/TsForm/TsForm.vue';
import TsFormSelect from '@/resources/plugins/TsForm/TsFormSelect.vue';
import editmixin from './editmixin.js';
import TranferreportSetting from '../tranferreport-setting.vue';
export default {
  name: '',
  components: {
    TsForm,
    TsFormSelect,
    TranferreportSetting,
    ViewProcess: () => import('../catalog-viewprocess.vue'),
    IconEdit: () => import('./icon-edit.vue'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch.vue')
  },
  filters: {},
  mixins: [editmixin],
  props: {},
  data() {
    return {
      selectedIcon: '', //选中哪一个图标
      defaultPriorityUuid: '', //默认优先级uuid
      channelValue: {},
      lookSitemapModel: false, //查看流程图
      iseditIcon: false, //编辑图标
      colorList: ['#62BCFA', '#00BCD4', '#81D553'],
      sitmapDialogSetting: {
        fullscreen: true,
        hasFooter: false,
        width: 'large',
        height: '600px',
        title: this.$t('term.process.viewflowchart')
      },
      processConfig: {
        filterable: true,
        transfer: true,
        needCallback: false,
        validateList: ['required'],
        valueName: 'uuid',
        textName: 'name',
        dynamicUrl: '/api/rest/process/search',
        params: {
          isICreated: 0
        },
        rootName: 'processList'
      },
      priorityConfig: {
        filterable: true,
        transfer: true,
        multiple: true,
        needCallback: false,
        validateList: ['required'],
        valueName: 'uuid',
        textName: 'name',
        dynamicUrl: '/api/rest/process/priority/search',
        params: {
          isActive: 1
        },
        rootName: 'tbodyList'
      },
      channelTypeConfig: {
        filterable: true,
        transfer: true,
        needCallback: false,
        validateList: ['required'],
        valueName: 'uuid',
        textName: 'name',
        dynamicUrl: '/api/rest/process/channeltype/search',
        params: {
          isActive: 1
        },
        rootName: 'tbodyList'
      },
      worktimeConfig: {
        filterable: true,
        transfer: true,
        needCallback: false,
        validateList: ['required'],
        dynamicUrl: '/api/rest/worktime/search',
        valueName: 'uuid',
        textName: 'name',
        params: {
          isActive: 1
        },
        rootName: 'tbodyList'
      },
      priorityFormConfig: [
        {
          type: 'switch',
          name: 'isDisplayPriority',
          label: this.$t('term.process.showpriority'),
          validateList: ['required'],
          width: '75%'
        },
        {
          type: 'slot',
          name: 'priorityUuidList',
          multiple: true,
          label: this.$t('page.priority'),
          search: true,
          value: '',
          dataList: [],
          valueName: 'uuid',
          textName: 'name',
          validateList: ['required'],
          width: '75%'
        },
        {
          type: 'select',
          name: 'defaultPriorityUuid',
          label: this.$t('term.process.defaultpriority'),
          search: true,
          value: '',
          width: '75%',
          dataList: [],
          valueName: 'uuid',
          textName: 'name',
          validateList: ['required']
        }
      ],
      channelForm: [
        {
          type: 'text',
          name: 'name',
          value: '',
          placeholder: '',
          maxlength: 50,
          label: this.$t('page.name'),
          validateList: ['required', { name: 'name-special' }]
        },
        {
          type: 'switch',
          name: 'isActive',
          label: this.$t('page.enable'),
          validateList: ['required']
        },
        {
          type: 'slot',
          name: 'processUuid',
          label: this.$t('term.process.workflow'),
          validateList: ['required']
        },
        {
          type: 'slot',
          name: 'isActivePriority',
          label: '优先级激活',
          validateList: ['required'],
          onChange: (val) => {
            this.changePriorty(val);
          }
        },
        {
          type: 'slot',
          name: 'worktimeUuid',
          label: this.$t('term.process.serwindow'),
          search: true,
          value: '',
          dataList: [],
          valueName: 'uuid',
          textName: 'name',
          validateList: ['required']
        },
        {
          type: 'slot',
          name: 'channelTypeUuid',
          label: this.$t('term.process.sertype'),
          search: true,
          value: '',
          dataList: [],
          valueName: 'uuid',
          textName: 'name',
          validateList: ['required']
        },
        {
          type: 'userselect',
          name: 'reportAuthorityList',
          label: this.$t('term.process.reporauth'),
          groupList: ['user', 'team', 'role', 'common'],
          validateList: ['required'],
          tooltip: this.$t('term.process.reportauthtooltip')
        },
        {
          type: 'userselect',
          name: 'viewAuthorityList',
          label: this.$t('term.process.viewauth'),
          width: '75%',
          groupList: ['user', 'team', 'role', 'common'],
          value: ['common#alluser'],
          validateList: ['required'],
          tooltip: this.$t('term.process.viewauthtooltip')
        },
        {
          type: 'slot',
          name: 'allowTranferReport',
          label: this.$t('term.process.allowtranferreport')
        },
        {
          type: 'slot',
          name: 'channelRelationList',
          label: this.$t('term.process.transfersettings'),
          isHidden: true,
          validateList: ['required'],
          tooltip: this.$t('term.process.transfersettingstip')
        },
        {
          type: 'slot',
          name: 'icon',
          label: this.$t('page.icon')
        },
        {
          type: 'slot',
          name: 'color',
          label: this.$t('page.color')
        },
        {
          type: 'select',
          name: 'support',
          clearable: false,
          validateList: ['required'],
          label: this.$t('page.limituser'),
          value: '',
          defaultValueIsFirst: true,
          url: '/api/rest/universal/enum/get',
          params: {enumClass: 'neatlogic.framework.common.constvalue.DeviceType'}
        },
        {
          type: 'ckeditor',
          name: 'desc',
          label: '服务说明',
          tooltip: '用于【服务目录】菜单下服务说明'
        },
        {
          type: 'ckeditor',
          name: 'contentHelp',
          label: '描述帮助',
          tooltip: '用于【服务上报】页中的描述说明提示'
        }
      ],
      initValue: {
        name: '',
        processUuid: this.processUuid, //工作流uuid
        isActive: 1,
        reportAuthorityList: ['common#alluser'],
        viewAuthorityList: ['common#alluser'],
        worktimeUuid: '', //工作时间窗口uuid
        desc: '',
        icon: '',
        color: '#62BCFA',
        isActivePriority: 1,
        support: 'all', //服务目录的使用范围(all/pc/mobile)
        help: '',
        channelTypeUuid: '',
        config: {
          allowTranferReport: 0, //允许转报
          channelRelationList: [] //转报设置
        },
        activePriorityConfig: {
          priorityUuidList: []
        }
      },
      selectPriority: null //选中的优先级
    };
  },
  beforeCreate() {},
  created() {
    this.channelForm.forEach(e => {
      e.width = '75%';
    });
    this.getData();
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
    onChangeSwitch(val) {
      this.channelValue.config.channelRelationList = [];
      this.channelValue.config.allowTranferReport = val;
      this.channelForm.forEach(e => {
        if (e.name == 'channelRelationList') {
          if (val == 1) {
            e.isHidden = false;
          } else {
            e.isHidden = true;
          }
        }
      });
    },
    getData(hideLoading) {
      let relationObj = this.channelForm.find(d => d.name == 'channelRelationList');
      if (!this.uuid) {
        this.channelValue = this.$utils.deepClone(this.initValue);
        relationObj.isHidden = true;
        this.changePriorty(this.channelValue.isDisplayPriority);
        return;
      }
      let data = {
        uuid: this.uuid
      };
      !hideLoading && (this.loading = true);
      this.$api.process.service.getChannelInfo(data).then(res => {
        this.loading = false;
        if (res.Status == 'OK') {
          let itemValue = res.Return;
          itemValue.desc = this.escape2Html(itemValue.desc);
          let {
            name = '', 
            parentUuid = '',
            processUuid = '',
            isActive = 0,
            reportAuthorityList = [],
            viewAuthorityList = [],
            worktimeUuid = '',
            desc = '',
            icon = '',
            color = '#62BCFA',
            isActivePriority = 1,
            support = 'all',
            contentHelp = '',
            channelTypeUuid = '',
            priorityUuidList = [],
            defaultPriorityUuid = '',
            isDisplayPriority = 0,
            config = {}
          } = itemValue || {};
          this.channelValue = {
            name: name,
            parentUuid: parentUuid,
            processUuid: processUuid,
            isActive: isActive,
            reportAuthorityList: reportAuthorityList,
            viewAuthorityList: viewAuthorityList,
            worktimeUuid: worktimeUuid,
            desc: desc,
            icon: icon,
            color: color,
            isActivePriority: isActivePriority,
            support: support,
            contentHelp: contentHelp,
            channelTypeUuid: channelTypeUuid,
            config: {
              allowTranferReport: !this.$utils.isEmpty(config) ? config.allowTranferReport : 0, // 允许转报
              channelRelationList: !this.$utils.isEmpty(config) ? config.channelRelationList : [] // 转报数据列表
            },
            activePriorityConfig: {
              isDisplayPriority: isDisplayPriority,
              priorityUuidList: priorityUuidList,
              defaultPriorityUuid: defaultPriorityUuid
            }
          };
          if (!(!this.$utils.isEmpty(config) && config.allowTranferReport == 1)) {
            relationObj.isHidden = true;
          } else {
            relationObj.isHidden = false;
          }
          this.changePriorty(this.channelValue.isActivePriority);
          this.$emit('updateName', this.channelValue.name);
        } else {
          this.channelValue = this.$utils.deepClone(this.initValue);
          this.loading = false;
        }
      });
    },
    refresh(type) { //由于接口把needpage去掉，前端调用dynamicUrl需要在params新增参数以实现再次调用接口的效果
      let newParam = { timeUuid: this.$utils.setUuid() };
      if (type == 'process') {
        Object.assign(newParam, { isICreated: 0 });
        this.$set(this.processConfig, 'params', newParam);
        this.$set(this.processConfig, 'needCallback', true);
      } else if (type == 'priority') {
        Object.assign(newParam, { isActive: 1 });
        this.$set(this.priorityConfig, 'params', newParam);
        this.$set(this.priorityConfig, 'needCallback', true);
      } else if (type == 'worktime') {
        Object.assign(newParam, { isActive: 1 });
        this.$set(this.worktimeConfig, 'params', newParam);
        this.$set(this.worktimeConfig, 'needCallback', true);
      } else if (type == 'channelType') {
        Object.assign(newParam, { isActive: 1 });
        this.$set(this.channelTypeConfig, 'params', newParam);
        this.$set(this.channelTypeConfig, 'needCallback', true);
      }
    },
    refreshSuccess(type) {
      this.$Message.success(this.$t('message.executesuccess'));
    },
    priority(list) { //优先级选中时改变默认优先级数据
      this.priorityFormConfig.forEach(c => {
        if (c.name == 'defaultPriorityUuid') {
          this.$set(c, 'dataList', list && list.length ? list : []);
        }
      });
    },
    gotoAddFlow() { //新增流程
      window.open(HOME + '/process.html#/flow-edit?isnew=true&&uuid=' + this.$utils.setUuid(), '_blank');
    },
    gotoEditFlow() { //流程编辑
      let uuid = this.channelValue.processUuid;
      let data = {
        uuid: uuid
      };
      this.$api.process.process.getProcess(data).then(res => {
        if (res.Status == 'OK') {
          let name = res.Return.name;
          let referenceCount = res.Return.referenceCount;
          window.open(HOME + '/process.html#/flow-edit?uuid=' + uuid + '&&name=' + name + '&&referenceCount= ' + referenceCount, '_blank');
        }
      });
    },
    gotoAddPiority: function(val) { //添加优先级
      window.open(HOME + '/process.html#/priority-manage?' + (val ? 'isCatalogManage=1' : ''), '_blank');
    },
    gotoAddWorktime: function(val) { //跳转服务时间窗口
      window.open(HOME + '/framework.html#/worktime-manage?' + (val ? 'isCatalogManage=1' : ''), '_blank');
    },
    gotoAddpChannelTyp: function(val) { //跳转服务类型
      window.open(HOME + '/process.html#/channeltype-manage?' + (val ? 'isCatalogManage=1' : ''), '_blank');
    },
    viewProcess() { //查看流程
      this.lookSitemapModel = true;
    },
    channelType(val) {
      this.channelValue.config.channelRelationList = [];
    },
    save() {
      let priorityForm = this.$refs.priorityForm;
      if (!this.$refs.form.valid() || (priorityForm && !priorityForm.valid()) || ((this.channelValue.config && this.channelValue.config.allowTranferReport) && !this.$refs.channelRelationList.valid())) {
        return;
      }
      if (this.channelValue.config && this.channelValue.config.allowTranferReport) {
        this.channelValue.config.channelRelationList = this.$refs.channelRelationList.saveRelationList();
      }
      let chanelValue = this.$utils.deepClone(this.channelValue);
      let emitValue = {
        ...chanelValue,
        ...chanelValue.activePriorityConfig
      };
      if (emitValue.hasOwnProperty('activePriorityConfig')) {
        delete emitValue.activePriorityConfig;
      }
      this.$emit('save', this.$refs.form.valid() ? emitValue : false);
    },
    updateIcon(icon) {
      this.iseditIcon = false;
      this.selectedIcon = '';
      icon && (this.channelValue.icon = icon);
    },
    editIcon(icon) {
      this.iseditIcon = true;
      this.selectedIcon = icon || '';
    },
    getRelarelation() {
      this.$refs.channelRelationList.getRelarelationList(true);
    },
    gotoRotationManage() {
      window.open(HOME + '/process.html#/relations-manage', '_blank');
    },
    changePriorty(val) {
      this.$nextTick(() => {
        if (!val) {
          this.channelValue.activePriorityConfig = {
            isDisplayPriority: 0,
            priorityUuidList: [],
            defaultPriorityUuid: ''
          };
        }
      });
    }
  },
  computed: {},
  watch: {
    uuid(val) {
      this.getData(true);
    },
    selectPriority(selectedList) {
      this.priority(selectedList);
    },
    processUuid: {
      handler(newValue, oldValue) {
        this.$set(this.initValue, 'processUuid', newValue);
        this.getData(true);
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.btnRightText{
  padding-left: 120px;
  padding-top: 16px;
  padding-bottom: 16px;
}
.slotForm{
  .form-li{
    width:75%;
    display:inline-block;
  }
  .view{
    display:inline-block;
  }
}
 .selectColor {
  width: 30px;
  height: 30px;
  display: inline-block;
  margin-left: 10px;
}
/deep/ .ivu-form-item-content{
  .square {
    border: 1px solid;
    border-radius: 5px;
    width: 32px;
    height: 32px;
  }
  .menuIcon {
    font-size: 1.6em;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }
}
</style>

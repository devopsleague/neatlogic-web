<template>
  <div>
    <TsContain>
      <template slot="topLeft">
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="addPolicy()">{{ $t('term.process.policy') }}</div>
          <div class="action-item tsfont-time" @click="viewPolicyAudit()">{{ $t('term.pbc.viewexecutionrecord') }}</div>
        </div>
      </template>
      <template slot="topRight">
        <InputSearcher v-model="searchParam.keyword" @change="searchPolicy()"></InputSearcher>
      </template>
      <template v-slot:content>
        <TsTable
          v-if="policyData"
          v-bind="policyData"
          @changeCurrent="changePage"
          @changePageSize="changePageSize"
        >
          <template v-slot:name="{ row }">
            <a href="javascript:void(0)" @click="editPolicy(row.id)">{{ row.name }}</a>
          </template>
          <template v-slot:isActive="{ row }">
            <span v-if="row.isActive" class="text-success">{{ $t('page.yes') }}</span>
            <span v-else class="text-grey">{{ $t('page.no') }}</span>
          </template>
          <template v-slot:cronExpression="{ row }">
            <TsQuartz :value="row.cronExpression" showType="read"></TsQuartz>
          </template>
          <template v-slot:phaseText="{ row }">
            <div>
              <div v-for="(phase, index) in row.phaseTextList" :key="index">
                <Tag><span class="mr-xs">{{ index + 1 }}.</span>
                  <span>{{ phase }}</span></Tag>
              </div>
            </div>
          </template>
          <template v-slot:interfaceCount="{ row }">
            <Poptip
              v-if="row.interfaceCount"
              title="关联接口"
              placement="left"
              :transfer="true"
              @on-popper-show="showProp(row.id)"
            >
              <span class="text-href"><Badge type="info" :count="row.interfaceCount"></Badge></span>
              <div slot="content">
                <div v-if="policyInterfaceMap[row.id.toString()]">
                  <div v-for="(inter, index) in policyInterfaceMap[row.id.toString()]" :key="index">
                    {{ inter.name }}
                  </div>
                </div>
              </div>
            </Poptip>
          </template>
          <template v-slot:execCount="{ row }">
            <a v-if="row.execCount > 0" href="javascript:void(0)" @click="showPolicyAudit(row.id)">
              <Badge :count="row.execCount" type="info"></Badge>
            </a>
            <span v-else>-</span>
          </template>
          <template v-slot:action="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-play" @click="executePolicy(row)">{{ $t('page.execute') }}</li>
                <li class="tsfont-trash-o" @click="deletePolicy(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <PolicyEdit v-if="isPolicyEditShow" :id="currentId" @close="closePolicyDialog"></PolicyEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    InputSearcher: () => import('@/resources/components/InputSearcher/InputSearcher.vue'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    PolicyEdit: () => import('./policy-edit.vue'),
    TsQuartz: () => import('@/resources/plugins/TsQuartz/TsQuartz.vue')
  },
  props: {},
  data() {
    return {
      searchParam: {},
      isPolicyEditShow: false,
      currentId: null,
      policyData: {},
      policyInterfaceMap: {},
      theadList: [
        {
          key: 'name',
          title: this.$t('page.name')
        },
        { key: 'isActive', title: this.$t('term.report.isactive') },
        { key: 'corporationName', title: this.$t('term.pbc.organization') },
        { key: 'phaseText', title: this.$t('term.autoexec.executephase') },
        { key: 'interfaceCount', title: this.$t('term.pbc.interfaceamount') },
        { key: 'execCount', title: this.$t('term.autoexec.executecount') },
        { key: 'cronExpression', title: this.$t('term.pbc.cromexpression') },
        { key: 'description', title: this.$t('page.description') },
        { key: 'lastExecDate', title: this.$t('term.pbc.lastexecutertime'), type: 'time' },
        { key: 'action' }
      ]
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.searchPolicy();
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    showProp(policyId) {
      if (!this.policyInterfaceMap[policyId.toString()]) {
        this.$api.pbc.policy.getInterfaceByPolicyId(policyId).then(res => {
          this.$set(this.policyInterfaceMap, policyId.toString(), res.Return);
        });
      }
    },
    showPolicyAudit(id) {
      this.$router.push({ name: 'policy-audit-manage', params: { policyId: id } });
    },
    viewPolicyAudit() {
      this.$router.push({ path: '/policy-audit-manage' });
    },
    addPolicy() {
      this.isPolicyEditShow = true;
      this.currentId = null;
    },
    editPolicy(id) {
      this.isPolicyEditShow = true;
      this.currentId = id;
    },
    changePageSize(pageSize) {
      this.searchParam.pageSize = pageSize;
      this.searchPolicy();
    },
    changePage(currentPage) {
      this.searchPolicy(currentPage);
    },
    searchPolicy(currentPage) {
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      } else {
        this.searchParam.currentPage = 1;
      }
      this.$api.pbc.policy.searchPolicy(this.searchParam).then(res => {
        this.policyData = res.Return;
        this.policyData.theadList = this.theadList;
      });
    },
    closePolicyDialog(needRefresh) {
      this.isPolicyEditShow = false;
      if (needRefresh) {
        this.searchPolicy();
      }
    },
    executePolicy(policy) {
      this.$createDialog({
        title: this.$t('dialog.title.executeconfirm'),
        content: this.$t('term.pbc.exepolicyconfirm', { target: policy.name }),
        'on-ok': vnode => {
          this.$api.pbc.policy.executePolicy(policy.id).then(res => {
            this.$Message.success(this.$t('message.executesuccess'));
            vnode.isShow = false;
            this.searchPolicy();
          });
        },
        'on-cancel': vnode => {
          vnode.isShow = false;
        }
      });
    },
    deletePolicy(policy) {
      this.$createDialog({
        title: this.$t('page.deletewarning'),
        content: this.$t('term.pbc.deletepolicyconfirm', { target: policy.name }),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.pbc.policy.deletePolicy(policy.id).then(res => {
            this.$Message.success(this.$t('message.deletesuccess'));
            vnode.isShow = false;
            this.searchPolicy();
          });
        },
        'on-cancel': vnode => {
          vnode.isShow = false;
        }
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>

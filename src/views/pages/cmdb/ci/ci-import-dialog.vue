<template>
  <div>
    <TsDialog v-bind="dialogConfig" @on-close="close">
      <template v-slot>
        <div ref="main">
          <TsForm :itemList="formConfig">
            <template v-slot:file>
              <TsUpLoad
                styleType="button"
                className="smallUpload"
                :format="['model']"
                :multiple="true"
                :beforeUpload="
                  file => {
                    addFile(file);
                    return false;
                  }
                "
              ></TsUpLoad>
              <div class="text-grey">{{ $t('term.cmdb.supportmultimodelfile') }}</div>
              <div v-if="ciData.fileList.length > 0">
                <Tag
                  v-for="(file, index) in ciData.fileList"
                  :key="index"
                  closable
                  @on-close="removeFile(file)"
                >{{ file.name }}</Tag>
              </div>
            </template>
            <template v-slot:result>
              <div v-if="resultData && resultData.length">
                <Card v-for="(ci, index) in resultData" :key="index" class="mt-sm">
                  <div slot="title" class="grid">
                    <div>
                      <span>{{ ci.label }}</span>
                      <span class="text-grey">({{ ci.name }})</span>
                    </div>
                    <div>
                      <span v-if="ci._action === 'insert'" class="text-success">{{ $t('page.new') }}</span>
                      <span v-else-if="ci._action === 'update'" class="text-warning">{{ $t('page.revise') }}</span>
                      <span v-else class="text-grey">{{ $t('page.nochange') }}</span>
                    </div>
                  </div>
                  <ul v-if="ci.error.length > 0" class="text-error error-info">
                    <li v-for="(error, eindex) in ci.error" :key="eindex">{{ error }}</li>
                  </ul>
                  <TsTable
                    v-if="(ci.attrList && ci.attrList.length > 0) || (ci.relList && ci.relList.length > 0)"
                    border="all"
                    :fixedHeader="false"
                    :theadList="theadList"
                    :tbodyList="getAttrRelList(ci)"
                  >
                    <template v-slot:type="{ row }">
                      <div>
                        <span v-if="row.type === 'attr'">{{ $t('page.attribute') }}</span>
                        <span v-else>{{ $t('page.relation') }}</span>
                      </div>
                    </template>
                    <template v-slot:fullname="{ row }">
                      <div v-if="row.type === 'attr'">
                        <span>{{ row.label }}</span>
                        <span class="text-grey">({{ row.name }})</span>
                      </div>
                      <div v-else>
                        <span :class="{ 'text-primary': row.direction === 'from' }">{{ row.fromCiLabel }}</span>
                        <span class="text-grey">({{ row.fromCiName }})</span>
                        <span class="tsfont-arrow-right"></span>
                        <span :class="{ 'text-primary': row.direction === 'to' }">{{ row.toCiLabel }}</span>
                        <span class="text-grey">({{ row.toCiName }})</span>
                      </div>
                    </template>
                    <template v-slot:_action="{ row }">
                      <div>
                        <span v-if="row._action === 'insert'" class="text-success">{{ $t('page.new') }}</span>
                        <span v-else-if="row._action === 'update'" class="text-warning">{{ $t('page.revise') }}</span>
                        <span v-else class="text-grey">{{ $t('page.nochange') }}</span>
                      </div>
                    </template>
                    <template v-slot:error="{ row }">
                      <Tooltip v-if="row.error.length > 0" max-width="200" :transfer="true">
                        <span class="text-error tsfont-warning-s"></span>
                        <ul slot="content" class="text-error error-info">
                          <li v-for="(error, eindex) in row.error" :key="eindex">{{ error }}</li>
                        </ul>
                      </Tooltip>
                      <div v-else></div>
                    </template>
                  </TsTable>
                </Card>
              </div>
              <div v-else><span>没有任何变化</span></div>
            </template>
          </TsForm>
        </div>
      </template>
      <template v-slot:footer>
        <Button @click="close()">{{ $t('page.cancel') }}</Button>
        <Button v-if="!allowImport" type="primary" @click="validateCi()">{{ $t('page.preview') }}</Button>
        <Button v-else type="success" @click="importCi()">{{ $t('page.import') }}</Button>
      </template>
    </TsDialog>
  </div>
</template>
<script>
import upload from '@/resources/mixins/upload.js';
export default {
  name: '',
  components: {
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    TsUpLoad: () => import('@/resources/components/UpLoad/UpLoad.vue'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue')
  },
  mixins: [upload],
  props: {},
  data() {
    return {
      allowImport: false,
      currentIcon: 'tsfont-ci',
      ciData: { fileList: [] },
      dialogConfig: {
        title: this.$t('term.cmdb.importci'),
        type: 'modal',
        isShow: true,
        maskClose: false,
        width: 'medium'
      },
      resultData: null,
      theadList: [
        { key: 'type', title: this.$t('page.type') },
        { key: 'fullname', title: this.$t('page.name') },
        { key: '_action', title: this.$t('page.action') },
        { key: 'error', title: this.$t('page.exception') }
      ],
      formConfig: {
        file: { type: 'slot', name: 'file', label: this.$t('term.cmdb.cifile') },
        result: { type: 'slot', name: 'result', label: this.$t('page.preview'), isHidden: true }
      }
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
    getAttrRelList(ci) {
      const list = [];
      if (ci.attrList && ci.attrList.length > 0) {
        ci.attrList.forEach(attr => {
          list.push({ type: 'attr', ...attr });
        });
      }
      if (ci.relList && ci.relList.length > 0) {
        ci.relList.forEach(rel => {
          list.push({ type: 'rel', ...rel });
        });
      }
      return list;
    },
    addFile(file) {
      if (!this.ciData.fileList.find(d => d.name === file.name)) {
        this.ciData.fileList.push(file);
      }
      this.allowImport = false;
    },
    removeFile(file) {
      const index = this.ciData.fileList.findIndex(d => d.name === file.name);
      if (index >= 0) {
        this.$delete(this.ciData.fileList, index);
        this.resultData = null;
        this.$set(this.formConfig.result, 'isHidden', true);
        this.allowImport = false;
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    async validateCi() {
      if (this.ciData.fileList.length > 0) {
        await this.upload('/api/binary/cmdb/ci/importvalidate', this.ciData, {}, res => {
          this.resultData = res.Return;
          this.$set(this.formConfig.result, 'isHidden', false);
          if (this.resultData && this.resultData.length > 0) {
            let isValid = true;
            this.resultData.forEach(ci => {
              if (ci.error && ci.error.length > 0) {
                isValid = false;
              }
              if (ci.attrList && ci.attrList.length > 0) {
                ci.attrList.forEach(attr => {
                  if (attr.error && attr.error.length > 0) {
                    isValid = false;
                  }
                });
              }
              if (ci.relList && ci.relList.length > 0) {
                ci.relList.forEach(rel => {
                  if (rel.error && rel.error.length > 0) {
                    isValid = false;
                  }
                });
              }
            });
            this.allowImport = isValid;
            if (!isValid) {
              this.$nextTick(() => {
                this.$utils.jumpTo('.error-info', 'smooth', this.$refs['main']);
              });
            }
          } else {
            this.allowImport = false;
          }
        });
      } else {
        this.allowImport = false;
      }
    },
    async importCi() {
      if (this.allowImport) {
        this.upload(
          '/api/binary/cmdb/ci/import',
          this.ciData,
          {},
          res => {
            this.$Message.success(this.$t('message.importsuccess'));
            this.close(true);
          },
          error => {
            this.$Notice.error({
              title: this.$t('message.importfailed'),
              desc: error.Message
            });
          }
        );
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.logo {
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: inline-block;
  position: relative;
  border: 1px solid;
  top: -5px;
  text-align: center;
  line-height: 40px;
  .logo-icon {
    font-size: 20px;
  }
  &::after {
    left: 44px;
    width: 40px;
    position: absolute;
    top: 2px;
  }
}
.grid {
  display: grid;
  grid-template-columns: auto 40px;
  grid-gap: 10px;
}
</style>

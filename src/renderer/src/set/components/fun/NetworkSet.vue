<template>
  <div>
    <div class='network-layer'>
      <el-form label-width='120px'>

        <el-form-item label='代理设置'>
          <el-select v-model='agentConfig.type'>
            <el-option v-for='model in agentSelectList' :key='model.value' :label='model.label' :value='model.value' />
          </el-select>
        </el-form-item>

        <div v-if='agentConfig.type === 1'>
          <el-form-item label='服务器'>
            <el-input v-model='agentConfig.host' class='network-input' type='text' placeholder='请输入地址IP'
                      spellcheck='false' />
          </el-form-item>
          <el-form-item label='端口'>
            <el-input v-model='agentConfig.port' class='network-input' type='text' placeholder='请输入端口'
                      spellcheck='false' />
          </el-form-item>
          <!--          <el-form-item label='用户名'>-->
          <!--            <el-input v-model='agentConfig.userName' class='network-input' type='text' placeholder='请输入用户名'-->
          <!--                      spellcheck='false' />-->
          <!--            <span class='form-switch-span'> （选填）此处填写代理用户名 如果没有不填即可 </span>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label='密码'>-->
          <!--            <el-input v-model='agentConfig.passWord' class='network-input' type='password' placeholder='请输入密码'-->
          <!--                      spellcheck='false' />-->
          <!--            <span class='form-switch-span'> （选填）此处填写代理密码 如果没有不填即可 </span>-->
          <!--          </el-form-item>-->
        </div>
        <el-form-item>
          <el-button plain @click='save'>保存</el-button>
          <span
            class='form-switch-span form-switch-button-span'> {{ agentConfig.type === 0 ? '' : '配置后TTime默认所有请求通过代理执行'
            }} </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang='ts'>

import { ref } from 'vue'
import { isNull } from '../../../utils/validate'
import ElMessageExtend from '../../../utils/messageExtend'
import { cacheGet, cacheSet } from '../../../utils/cacheUtil'

const agentConfig = ref(cacheGet('agentConfig'))
const checkIngStatus = ref(false)
const agentSelectList = [
  { label: '不使用代理', value: 0 },
  { label: 'HTTP代理', value: 1 }
]

/**
 * 不设置代理保存
 */
const save = () => {
  if (isNull(agentConfig.value.host) || isNull(agentConfig.value.port)) {
    return ElMessageExtend.warning('代理地址或端口号不能为空')
  }
  // if ((!isNull(agentConfig.value.userName) && isNull(agentConfig.value.passWord)) || (isNull(agentConfig.value.userName) && !isNull(agentConfig.value.passWord))) {
  //   return ElMessageExtend.warning('请填写完整的代理用户名和密码')
  // }
  cacheSet('agentConfig', agentConfig.value)
  ElMessageExtend.success('保存成功')
  setTimeout(window.api.agentUpdateEvent(cacheGet('agentConfig')), 500)
}

</script>

<style lang='scss' scoped>
@import '../../../css/set.scss';

.network-layer {
  display: flex;
  max-height: 500px;
  min-height: 500px;

  .form-switch-button-span {
    margin-left: 15px;
  }

}

.network-input {
  //width: 70%;
}

</style>

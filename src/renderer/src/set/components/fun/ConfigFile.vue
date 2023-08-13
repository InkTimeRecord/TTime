<template>
  <div>
    <div class="network-layer">
      <el-form label-width="120px">
        <el-form-item label="配置文件路径">
          <el-input
            class="path-input"
            type="text"
            placeholder="请选择配置文件路径"
            spellcheck="false"
          />
        </el-form-item>
        <el-form-item label="翻译记录路径">
          <el-input
            class="path-input"
            type="text"
            placeholder="请选择翻译记录路径"
            spellcheck="false"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<style lang="scss" scoped>
@import '../../../css/set.scss';

.path-input {
  width: 70%;
}
</style>

<template>
    <div class="default-main ba-table-box">
        <el-card>
            <el-row class="m-b-10">
                <BtnRefresh @click="refresh" :loading="loading"/>
                <BtnAdd v-if="auth('add')" @click="add"/>
            </el-row>
            <el-table v-loading="loading" :data="categoryList" style="width: 100%" border>
                <el-table-column
                    fixed
                    min-width="90"
                    prop="mid"
                    align="center"
                    label="序号"/>
                <el-table-column
                    prop="nickname"
                    align="center"
                    label="昵称"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="name"
                    align="center"
                    label="真实姓名"
                    min-width="100"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="email"
                    align="center"
                    label="电子邮箱"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="qq"
                    align="center"
                    label="QQ"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="phone"
                    align="center"
                    label="手机号码"
                    min-width="150"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="注册日期"
                    min-width="200"
                    :show-overflow-tooltip="true"/>
                <el-table-column prop="status" label="状态" align="center" min-width="100">
                    <template #default="scope">
                        <CustomSwitch
                            v-if="auth('enable') && auth('disable')"
                            v-model="scope.row.status"
                            :id="scope.row.mid"
                            :enable="enableMember"
                            :disable="disableMember"
                            :active-value=0
                            :inactive-value=1
                        />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="60">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="auth('edit')" @click="editCate(scope.row.mid)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:pageSize="query.pageSize"
                v-model:page="query.page"
                :total="pageTotal"
                @render="getList">
            </paging-module>
        </el-card>
        <popup-form/>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch,} from "vue";
import PopupForm from "/@/views/backend/portal/member/popupForm.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import {detail, disable, enable, memberLists} from "/@/api/backend/portal/member/member";
import {memberConfig} from '/@/stores/portal/memberpupFrom'
import {auth} from "/@/utils/common";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import CustomSwitch from "/@/components/custom/CustomSwitch.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";

const pageTotal = ref(0)
const query = reactive({
    name: '',
    page: 1,
    pageSize: 10,
});
const store = memberConfig()
const loading = ref(false)
const categoryList = ref<Area[]>([])
const refresh = () => {
    query.page = 1
    getList()
}
const add = () => {
    store.operate = '新增会员'
    store.dialogVisible = true
}
const getList = () => {
    loading.value = true
    memberLists(query).then(res => {
        categoryList.value = res.data.content.data
        pageTotal.value = res.data.content.total
        loading.value = false
    })
}
const editCate = (i: number) => {
    store.operate = '编辑会员'
    store.dialogVisible = true
    detail({id: i}).then(res => {
        let obj = res.data.content
        store.password = obj.password
        store.name = obj.name
        store.mid = obj.mid
        store.level = obj.status
        store.phone = obj.phone
        store.qq = obj.qq
        store.email = obj.email
        store.openid = obj.openid
        store.nickname = obj.nickname
    })
}
const enableMember = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        enable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const disableMember = (id: number) => {
    return new Promise<void>((resolve, reject) => {
        disable({id}).then(() => {
            resolve();
        }).catch(() => {
            reject();
        });
    });
};
const getDialog = computed(() => {
    return store.refreshPage
})
watch(getDialog, (newValue) => {
    if (newValue) {
        getList()
    }
}, {immediate: true, deep: true});
onMounted(() => {
    getList()
});
</script>

<style lang="scss" scoped>
</style>

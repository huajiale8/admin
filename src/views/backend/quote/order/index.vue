<template>
    <div class="default-main ba-table-box">
        <el-card>
            <div class="m-b-10">
                <el-row style="flex: 1">
                    <el-col :span="6">
                        <BtnRefresh @click="refresh"/>
                        <BtnAdd v-if="auth('add')" @click="add"/>
                    </el-col>
                    <el-col :span="18">
                        <el-row :gutter="10">
                            <el-col :span="4" :offset="16">
                                <el-input
                                    clearable
                                    placeholder="请输入报价编号"
                                    v-model="store.code"
                                    autocomplete="off"/>
                            </el-col>
                            <el-col :span="4">
                                <el-input
                                    clearable
                                    placeholder="请输入客户名称"
                                    v-model="store.searchName"
                                    autocomplete="off"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <BtnSearch @click="search"/>
            </div>
            <el-tabs
                v-model="activeName"
                @tab-change="handleClick">
                <el-tab-pane
                    label="全部报价"
                    :name="0">
                </el-tab-pane>
                <el-tab-pane
                    label="待审核"
                    :name="2">
                </el-tab-pane>
                <el-tab-pane
                    label="已拒绝"
                    :name="4">
                </el-tab-pane>
                <el-tab-pane
                    label="审核通过"
                    :name="3">
                </el-tab-pane>
                <el-tab-pane
                    label="已关闭"
                    :name="5">
                </el-tab-pane>
            </el-tabs>
            <el-table
                v-loading="loading"
                :data="dataList"
                style="width: 100%"
                border>
                <el-table-column
                    fixed
                    prop="code"
                    align="center"
                    label="报价编号"
                    width="150"/>
                <el-table-column
                    prop="bidder_name"
                    align="center"
                    label="员工姓名"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="custom_name"
                    align="center"
                    label="客户名称"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    prop="total_price"
                    align="center"
                    label="金额"
                    :show-overflow-tooltip="true"/>
                <el-table-column
                    align="center"
                    label="折扣"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-tag type="warning">{{ scope.row.discount }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    align="center"
                    label="报价时间"
                    width="160"/>
                <el-table-column
                    prop="validate_date"
                    align="center"
                    label="有效期"
                    width="160"/>
                <el-table-column
                    label="状态"
                    align="center"
                    width="100">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 1">填写中</el-tag>
                        <el-tag v-if="scope.row.status === 2" type="warning">待审核</el-tag>
                        <el-tag v-if="scope.row.status === 3" type="success">审核通过</el-tag>
                        <el-tag v-if="scope.row.status === 4" type="danger">已拒绝</el-tag>
                        <el-tag v-if="scope.row.status === 5" type="info">已关闭</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="反馈"
                    :show-overflow-tooltip="true">
                    <template #default="scope">
                        <el-popover
                            v-if="scope.row.feedback"
                            placement="top-start"
                            title="反馈"
                            width="400"
                            trigger="hover"
                            :content="scope.row.feedback">
                            <template #reference>
                                <el-button type="primary" link>详情</el-button>
                            </template>
                        </el-popover>
                        <el-button v-else type="info" link>-</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template #default="scope">
                        <div class="operate_btn">
                            <BtnEdit v-if="scope.row.status <= 2 && auth('edit')" @click="editCate(scope.row.id)"/>
                            <BtnView v-if="scope.row.status > 2" @click="examine(scope.row.id)"/>
                            <BtnAudit v-if=" scope.row.status === 2 && auth('pass')" @click="detailTow(scope.row.id)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <paging-module
                v-model:page-size="pageInfo.pageSize"
                v-model:page="pageInfo.page"
                :total="total"
                @render="getList">
            </paging-module>
            <popup-form @getList="getList"/>
            <new-order-dialog-visible @getList="getList"/>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {auth} from "/@/utils/common";
import {orderConfig} from "/@/stores/quote/orderPopupForm";
import PopupForm from "/@/views/backend/quote/order/pdfPopupForm.vue";
import {orderDetail, orderLists} from "/@/api/backend/auth/quote/order";
import NewOrderDialogVisible from "/@/views/backend/quote/order/newOrderDialogVisible.vue";
import PagingModule from "/@/components/custom/ModPagingModule.vue";
import BtnSearch from "/@/components/buttons/BtnSearch.vue";
import BtnRefresh from "/@/components/buttons/BtnRefresh.vue";
import BtnAdd from "/@/components/buttons/BtnAdd.vue";
import BtnView from "/@/components/buttons/BtnView.vue";
import BtnEdit from "/@/components/buttons/BtnEdit.vue";
import BtnAudit from "/@/components/buttons/BtnAudit.vue";

const store = orderConfig();
const activeName = ref(0);
const total = ref(0);
const loading = ref(false);
const dataList = ref([]);
const pageInfo = reactive({
    page: 1,
    pageSize: 10,
    custom_name: "",
    status: 0,
    code: "",
});
const refresh = () => {
    pageInfo.page = 1
    getList()
}
const getList = () => {
    loading.value = true;
    orderLists(pageInfo).then(res => {
        total.value = res.data.content.lists.total; //数据总数
        dataList.value = res.data.content.lists.data; //表格数据
        store.activity = res.data.content.activity; //活动数据
        store.categories = res.data.content.categories; //服务内容数据
        store.categories.forEach((i: any) => {
            i.key = Math.random(); //给key赋值随机浮点数
            i.children && i.children.forEach((j: any) => {
                j.total = 0;
                j.key = Math.random();
            });
        });
        loading.value = false;
    });
};

const editCate = (i: number) => {
    store.orderName = "编辑报价单";
    orderDetail({id: i, type: ""}).then(res => {
        let obj = res.data.content;
        store.partAInfo.custom_phone = obj.custom_phone;
        store.partAInfo.custom_name = obj.custom_name;
        store.partAInfo.custom_contact = obj.custom_contact;
        store.partBInfo.bidder_name = obj.bidder_name;
        store.partBInfo.bidder_phone = obj.bidder_phone;
        store.partBInfo.id = obj.uid;
        obj.activities.forEach((item: any) => {
            store.discountInfo.type.push(item.aid)
        })
        store.discountInfo.remark = obj.remark
        store.discountInfo.discount = parseFloat(obj.discount)
        store.discountInfo.serviceDiscount = obj.serviceDiscount
        store.discountInfo.serviceDiscount.forEach(i => {
            i.discount = parseFloat(i.discount)
        })
        let categories = JSON.parse(JSON.stringify(store.categories));
        let services = obj.services;
        services.forEach((i: any) => {
            categories.forEach((j: any) => {
                if (j.id === i.cid) {
                    j.discount = i.discount;
                    j.children.forEach((item: any) => {
                        i.children.forEach((item2: any) => {
                            if (item.id === item2.item_id) {
                                item.total = Number(item2.total);
                                item.num = item2.num;
                            }
                        });
                    });
                }
            });
            store.services = categories;
        });
        store.services.forEach((item: any) => {
            item.key = Math.random() * 1000;
            item.children.forEach((i: any) => {
                i.key = Math.random() * 1000;
            });
        });
        store.dateInfo.dateRange = [Date.parse(obj.start_time), Date.parse(obj.end_time)];
        store.dateInfo.dateStart = obj.start_time;
        store.dateInfo.dateEnd = obj.end_time;
        store.dateInfo.dayRange = (store.dateInfo.dateRange[1] - store.dateInfo.dateRange[0]) / 3600 / 24 / 1000;
        store.id = obj.id;
        store.newOrderDialogVisible = true;
    });
};

const search = () => {
    pageInfo.custom_name = store.searchName;
    pageInfo.code = store.code;
    pageInfo.page = 1;
    pageInfo.pageSize = 10;
    getList();
};
// 点击新增赋值一份服务内容数据
const add = () => {
    store.orderName = "新增报价单";
    store.services = JSON.parse(JSON.stringify(store.categories))
    store.newOrderDialogVisible = true;
};
const handleClick = () => {
    store.code = ''
    store.searchName = "";
    pageInfo.status = activeName.value
    pageInfo.page = 1;
    getList();
};
const examine = (i: number) => {
    let obj = {
        id: i,
        type: "",
    };
    orderDetail(obj).then(res => {
        store.pdfList = res.data.content;
        store.dialogVisible = true;
    });
};
const detailTow = (i: number) => {
    store.operate = "报价单详情";
    store.toCheck = true;
    orderDetail({id: i}).then(res => {
        store.pdfList = res.data.content;
        store.dialogVisible = true;
    });
};
const getDialog = computed(() => {
    return store.refreshPage;
});
watch(getDialog, (newValue) => {
    if (newValue) {
        getList();
    }
}, {immediate: true, deep: true});
onMounted(() => {
    getList();
});
</script>
<style scoped lang="scss">
</style>

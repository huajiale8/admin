<template>
        <el-descriptions :column="3" border>
            <el-descriptions-item
                v-for="(item,index) in itemCost"
                :key="index"
                :label="item.name"
                label-style="width:100px">
                ￥{{ item.cost }}
            </el-descriptions-item>
        </el-descriptions>
        <el-form
            ref="form"
            :model="store.discountInfo"
            label-width="100px"
            :inline="true"
            class="overall"
            >
            <el-form-item
                v-for="(item,index) in store.discountInfo.serviceDiscount"
                :label="item.name+'折扣'"
                :key="index">
                <el-input-number
                    v-model="item.discount"
                    :step="5"
                    :min="0"
                    :max="100"
                    :key="index">
                </el-input-number>
            </el-form-item>
            <el-form-item label="总价折扣">
                <el-input-number
                    v-model="store.discountInfo.discount"
                    :step="5">
                </el-input-number>
            </el-form-item>
        </el-form>
        <el-form
            ref="form"
            :model="store.discountInfo"
            label-width="102px">
            <el-form-item label="参加活动">
                <el-checkbox-group v-model="store.discountInfo.type">
                    <el-tooltip
                        v-for="(item,index) in chosenActivities"
                        :content="'优惠金额：￥'+item.amount"
                        placement="top"
                        :key="index">
                        <el-checkbox
                            :label="item.id"
                            name="type"
                            :key="index"
                            @change="activitiesChanged($event, item)">
                            {{ item.name }}
                        </el-checkbox>
                    </el-tooltip>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="store.discountInfo.remark"></el-input>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="8" :offset="16" class="afterTaxCostContainer">
                <div>
                    税后总价：
                    <span class="afterTaxCost">￥{{ afterTaxCost }}</span>
                </div>
            </el-col>
        </el-row>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import {orderConfig} from "/@/stores/quote/orderPopupForm";

const store = orderConfig()
const tableData = ref(store.services)
const chosenActivities = ref(store.activity)
const beforeTaxCost = ref(store.beforeTaxCost)
const arr = ref([])
const init = () => {
    // 初始化活动选中
    chosenActivities.value.forEach((item: any) => {
        store.discountInfo.type.forEach((i) => {
            if (i == item.id) {
                arr.value.push(item)
            }
        })
    })
}
const servicePriceList = () => {
    const servicePriceList = []
    beforeTaxCost.value = 0
    tableData.value.forEach((i: any) => {
        let cost = 0
        i.children.forEach((i: any) => cost += Number(i.total) || 0)
        beforeTaxCost.value += cost
        const serviceItem = {id: i.id, name: i.name, cost}
        servicePriceList.push(serviceItem)
    })
    servicePriceList.push({
        name: '总价',
        cost: beforeTaxCost.value
    })
    return servicePriceList
}
const itemCost = computed(() => {
    return servicePriceList()
})
/**
 * 优惠活动变化，同步更新 store.afterTaxCost
 * @param e
 * @param item
 */
const activitiesChanged = (e: any, item: any) => {
    if (e) {
        itemCost.value[itemCost.value.length - 1].cost -= Number(item.amount)
        arr.value.push(item)
    } else {
        let activityIndex = 0
        arr.value.forEach((i: any, index: any) => {
            if (i.id === item.id) {
                activityIndex = index
                itemCost.value[itemCost.value.length - 1].cost += Number(item.amount)
                arr.value.splice(activityIndex, 1)
            }
        })
    }
}
const afterTaxCost = computed(() => {
    let discountBeforeTaxCost = 0
    for (let i = 0; i < itemCost.value.length - 1; i++) {
        store.discountInfo.serviceDiscount.forEach((item: any) => {
            if (item.cid === (itemCost.value[i] as any).id) {
                discountBeforeTaxCost += itemCost.value[i].cost * (100 - item.discount) / 100
            }
        })
    }
    arr.value.forEach((i: any) => {
        discountBeforeTaxCost -= Number(i.amount)
    })
    discountBeforeTaxCost = discountBeforeTaxCost * (100 - store.discountInfo.discount) / 100
    return (discountBeforeTaxCost * 1.06).toFixed(2)
})
watch(afterTaxCost, (newValue) => {
    if (newValue) {
        store.afterTaxCost = newValue
    }
}, {immediate: true, deep: true});
onMounted(() => {
    init()
});
</script>
<style lang="scss" scoped>
.overall{
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    padding-top: 20px;
}
</style>

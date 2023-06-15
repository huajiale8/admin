<template>
    <div class="default-main">
        <div class="banner">
            <el-row :gutter="10">
                <el-col :md="24" :lg="18">
                    <div class="welcome suspension">
                        <img class="welcome-img" :src="headerSvg" alt=""/>
                        <div class="welcome-text">
                            <div class="welcome-title">{{ adminInfo.name + t('utils.comma') + getGreet() }}</div>
                        </div>
                    </div>
                </el-col>
                <el-col :lg="6" class="hidden-md-and-down">
                    <div class="working">
                        <img class="working-coffee" :src="coffeeSvg" alt=""/>
                        <div class="working-text">
                            {{ t('dashboard.You have worked today') }}
                            <span class="time">{{ state.workingTimeFormat }}</span>
                        </div>
                        <div @click="onChangeWorkState()" class="working-opt working-rest">
                            {{ state.pauseWork ? t('dashboard.Continue to work') : t('dashboard.have a bit of rest') }}
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="small-panel-box">
            <el-row :gutter="20">
                <el-col :sm="12" :lg="6">
                    <div class="small-panel suspension">
                        <div class="small-panel-title">{{ '代理商余额' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#8595F4" size="20" name="fa fa-line-chart"/>
                                <span id="user_reg_number">{{ agentContent.overage }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel file suspension">
                        <div class="small-panel-title">{{ '代理商总充值' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#AD85F4" size="20" name="fa fa-file-text"/>
                                <span id="file_number">{{ agentContent.recharge_all }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel users suspension">
                        <div class="small-panel-title">{{ '代理商日充值' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#74A8B5" size="20" name="fa fa-users"/>
                                <span id="users_number">{{ agentContent.recharge_day }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel addons suspension">
                        <div class="small-panel-title">{{ '代理商月充值' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#F48595" size="20" name="fa fa-object-group"/>
                                <span id="addons_number">{{ agentContent.recharge_month }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel file suspension">
                        <div class="small-panel-title">{{ '代理商总消费' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#AD85F4" size="20" name="fa fa-file-text"/>
                                <span id="file_number">{{ agentContent.consume_all }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel users suspension">
                        <div class="small-panel-title">{{ '代理商日消费' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#74A8B5" size="20" name="fa fa-users"/>
                                <span id="users_number">{{ agentContent.consume_day }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel addons suspension">
                        <div class="small-panel-title">{{ '代理商月消费' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#F48595" size="20" name="fa fa-object-group"/>
                                <span id="addons_number">{{ agentContent.consume_month }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :sm="12" :lg="6">
                    <div class="small-panel suspension">
                        <div class="small-panel-title">{{ '客户余额' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#8595F4" size="20" name="fa fa-line-chart"/>
                                <span id="user_reg_number">{{ customContent.overage }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel file suspension">
                        <div class="small-panel-title">{{ '客户总充值' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#AD85F4" size="20" name="fa fa-file-text"/>
                                <span id="file_number">{{ customContent.recharge_all }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel users suspension">
                        <div class="small-panel-title">{{ '客户日充值' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#74A8B5" size="20" name="fa fa-users"/>
                                <span id="users_number">{{ customContent.recharge_day }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel addons suspension">
                        <div class="small-panel-title">{{ '客户月充值' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#F48595" size="20" name="fa fa-object-group"/>
                                <span id="addons_number">{{ customContent.recharge_month }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel file suspension">
                        <div class="small-panel-title">{{ '客户总消费' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#AD85F4" size="20" name="fa fa-file-text"/>
                                <span id="file_number">{{ customContent.consume_all }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel users suspension">
                        <div class="small-panel-title">{{ '客户日消费' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#74A8B5" size="20" name="fa fa-users"/>
                                <span id="users_number">{{ customContent.consume_day }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="6">
                    <div class="small-panel addons suspension">
                        <div class="small-panel-title">{{ '客户月消费' }}</div>
                        <div class="small-panel-content">
                            <div class="content-left">
                                <Icon color="#F48595" size="20" name="fa fa-object-group"/>
                                <span id="addons_number">{{ customContent.consume_month }}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :sm="12" :lg="12">
                    <div class="small-panel user-reg ">
                        <div class="small-panel-title">{{ '搜索引擎（平台）' }}</div>
                        <div class="box">
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel file suspension">
                                        <div class="small-panel-title">{{ '百度PC' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_baiduPc }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel file suspension">
                                        <div class="small-panel-title">{{ '百度移动' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_baiduMobile }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel file suspension">
                                        <div class="small-panel-title">{{ '360PC' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_360Pc }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel file suspension">
                                        <div class="small-panel-title">{{ '360移动' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_360Mobile }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel file suspension">
                                        <div class="small-panel-title">{{ '搜狗PC' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_souGouPc }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel file suspension">
                                        <div class="small-panel-title">{{ '搜狗移动' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_souGouMobile }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="12">
                    <div class="small-panel user-reg ">
                        <div class="small-panel-title">搜索引擎（API）</div>
                        <div class="box">
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '百度PC' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_baiduPc }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '百度移动' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_baiduMobile }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '360PC' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_360Pc }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '360移动' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_360Mobile }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '搜狗PC' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_souGouPc }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '搜狗移动' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_souGouMobile }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :sm="12" :lg="12">
                    <div class="small-panel user-reg ">
                        <div class="small-panel-title">{{ '关键词统计（平台）' }}</div>
                        <div class="box">
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '关键词数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_keyword }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '优化中' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_optimization }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '排名前十' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_top10 }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '待审核' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_check }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '被驳回的词' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.num_reject }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '网站数量' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ keywordContent.website }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="12">
                    <div class="small-panel user-reg ">
                        <div class="small-panel-title">{{ '关键词统计（API）' }}</div>
                        <div class="box">
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '关键词数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_keyword }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '优化中' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_optimization }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '排名前十' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_top10 }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '待审核' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_check }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '被驳回的词' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiKeywordContent.num_reject }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :sm="12" :lg="12">
                    <div class="small-panel user-reg ">
                        <div class="small-panel-title">{{ '任务概览（平台）' }}</div>
                        <div class="box">
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '累计任务' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ taskContent.task_all }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '总达标数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ taskContent.task_over }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '已停任务数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ taskContent.task_stopped }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '当前任务数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ taskContent.task_current }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '今日达标数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ taskContent.task_over_today }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '今日新达标' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ taskContent.task_over_new_today }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="12">
                    <div class="small-panel user-reg ">
                        <div class="small-panel-title">{{ '任务概览（API）' }}</div>
                        <div class="box">
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '累计任务' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiTaskContent.task_all }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '总达标数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiTaskContent.task_over }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '已停任务数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiTaskContent.task_over }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '当前任务数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiTaskContent.task_current }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '今日达标数' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiTaskContent.task_over_today }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '今日新达标' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiTaskContent.task_over_new_today }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>

                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :sm="12" :lg="12">
                    <div class="small-panel user-reg ">
                        <div class="small-panel-title">{{ '订单数（平台）' }}</div>
                        <div class="box">
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '待审核' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ orderContent.order_check }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '被驳回' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ orderContent.order_reject }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '审核通过' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ orderContent.order_pass }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
                <el-col :sm="12" :lg="12">
                    <div class="small-panel user-reg ">
                        <div class="small-panel-title">{{ '订单数（API）' }}</div>
                        <div class="box">
                            <el-row>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '待审核' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiOrderContent.order_check }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '被驳回' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiOrderContent.order_reject }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '审核通过' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ apiOrderContent.order_pass }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :sm="12" :lg="24">
                    <div class="small-panel user-reg vip">
                        <div class="small-panel-title">{{ '会员统计' }}</div>
                        <div class="box">
                            <el-row>
                                <el-col :span="6">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '一级代理商数量' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ memberContent.agent_first }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '二级代理商数量' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ memberContent.agent_second }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '员工数量' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ memberContent.staff }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="small-panel  file suspension">
                                        <div class="small-panel-title">{{ '客户数量' }}</div>
                                        <div class="small-panel-content">
                                            <div class="content-left">
                                                <Icon color="#AD85F4" size="15" name="fa fa-file-text"/>
                                                <span>{{ memberContent.customer }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :sm="12" :lg="24">
                    <el-card class="box-card" shadow="always">
                        <div class="ibox-title">
                            <h5>任务达标走势图（平台）</h5>
                        </div>
                        <div>
                            <div id="myChart" ref="chart" style="min-height: 300px;"></div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 10px">
                <el-col :sm="12" :lg="24">
                    <el-card class="box-card" shadow="always">
                        <div class="ibox-title">
                            <h5>任务达标走势图（API）</h5>
                        </div>
                        <div>
                            <div id="myCharts" ref="chart" style="min-height: 300px;"></div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 10px">
                <el-col :sm="12" :lg="12">
                    <el-card class="box-card" shadow="always">
                        <div class="ibox-title">
                            <h5>酒店数据每日变化</h5>
                        </div>
                        <div>
                            <div id="meituan-hotels-morris-line-chart" ref="chart" style="min-height: 400px;"></div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :sm="12" :lg="12">
                    <el-card class="box-card" shadow="always">
                        <div class="ibox-title">
                            <h5>酒店城市数据</h5>
                        </div>
                        <div>
                            <div
                                id="meituan-city-hotels-morris-donut-chart"
                                ref="chart"
                                style="min-height: 400px;"></div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 10px">
                <el-col :sm="12" :lg="12">
                    <el-card class="box-card" shadow="always">
                        <div class="ibox-title">
                            <h5>销售人员BD数据</h5>
                        </div>
                        <div>
                            <div
                                id="meituan-hotels-salesman-morris-line-chart"
                                ref="chart"
                                style="min-height: 400px;"></div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :sm="12" :lg="12">
                    <el-card class="box-card" shadow="always">
                        <div class="ibox-title">
                            <h5>美团酒店整体数据</h5>
                        </div>
                        <div>
                            <div
                                id="meituan-hotels-total-morris-pie-chart"
                                ref="chart"
                                style="min-height: 400px;">
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, onUnmounted, reactive, ref} from 'vue'
import headerSvg from '/@/assets/images/dashboard/header-1.svg'
import coffeeSvg from '/@/assets/images/dashboard/coffee.svg'
import {useI18n} from 'vue-i18n'
import {Local} from '/@/utils/storage'
import {useAdminInfo} from '/@/stores/adminInfo'
import {WORKING_TIME} from '/@/stores/constant/cacheKey'
import {getGreet} from '/@/utils/common'
import 'element-plus/theme-chalk/display.css'
import {
    dashboardAgentLists,
    dashboardApiChartLists,
    dashboardApiKeywordLists,
    dashboardApiOrderLists,
    dashboardApiTaskLists,
    dashboardChartLists,
    dashboardCustomLists,
    dashboardHotelCitiesLists,
    dashboardHotelDaysLists,
    dashboardHotelSalesmanLists,
    dashboardHotelTotalLists,
    dashboardKeywordLists,
    dashboardMemberLists,
    dashboardOrderLists,
    dashboardTaskLists
} from "/@/api/backend/dashboard/dashboard";
import Icon from "/@/components/icon/index.vue";
import * as echarts from "echarts";

let workTimer: NodeJS.Timer
const d = new Date()
const days = ref([]);
const lastMonthValue = ref([]);
const thisMonthValue = ref([]);
const apiDays = ref([]);
const apiLastMonthValue = ref([]);
const apiThisMonthValue = ref([]);
const {t} = useI18n()
const adminInfo = useAdminInfo()
const agentContent = ref({
    recharge_all: "", //代理商总充值
    recharge_day: 0, //代理商日充值
    recharge_month: '', //代理商月充值
    overage: "", //代理商余额
    consume_all: "", //代理商总消费
    consume_day: 0, //代理商日消费
    consume_month: "" //代理商月消费
})
const customContent = ref({
    recharge_all: "", //客户总充值
    recharge_day: 0, //客户日充值
    recharge_month: '', //客户月充值
    overage: "", //客户余额
    consume_all: "", //客户总消费
    consume_day: 0, //客户日消费
    consume_month: "" //客户商月消费
})
const apiKeywordContent = ref({
    num_keyword: 0, //关键词数量
    num_optimization: 0, //优化中关键词数量
    num_top10: 0, //排名前10关键词
    num_check: 0, //待审核关键词
    num_reject: 0, //驳回关键词
    website: 0, //客户网址
    num_baiduPc: 0, //百度PC搜索引擎关键词数量
    num_baiduMobile: 0, //百度移动搜索引擎关键词数量
    num_360Pc: 0, //360PC搜索引擎关键词数量
    num_360Mobile: 0, //360移动搜索引擎关键词数量
    num_souGouPc: 0, //搜狗PC搜索引擎关键词数量
    num_souGouMobile: 0 //搜狗移动搜索引擎关键词数量
})
const memberContent = ref({
    customer: 0, //客户数量
    staff: 0, //员工数量
    agent_first: 0, //一级代理商数量
    agent_second: 0 //二级代理商数量
})
const taskContent = ref({
    task_all: 0, //平台累计任务
    task_over: 0, //平台总达标任务
    task_stopped: 0, //平台已停止任务
    task_current: 0, //平台当前任务
    task_over_today: 0, //平台今日达标任务
    task_over_new_today: 0 //平台今日新达标任务
})
const apiTaskContent = ref({
    task_all: 0, //平台累计任务
    task_over: 0, //平台总达标任务
    task_stopped: 0, //平台已停止任务
    task_current: 0, //平台当前任务
    task_over_today: 0, //平台今日达标任务
    task_over_new_today: 0 //平台今日新达标任务
})
const orderContent = ref({
    order_check: 0, //待审核订单数
    order_pass: 0, //已完成订单数
    order_reject: 0 //已拒绝订单数
})
const apiOrderContent = ref({
    order_check: 0, //待审核订单数
    order_pass: 0, //已完成订单数
    order_reject: 0 //已拒绝订单数
})
const keywordContent = ref({
    num_keyword: 0, //关键词数量
    num_optimization: 0, //优化中关键词数量
    num_top10: 0, //排名前10关键词
    num_check: 0, //待审核关键词
    num_reject: 0, //驳回关键词
    website: 0, //客户网址
    num_baiduPc: 0, //百度PC搜索引擎关键词数量
    num_baiduMobile: 0, //百度移动搜索引擎关键词数量
    num_360Pc: 0, //360PC搜索引擎关键词数量
    num_360Mobile: 0, //360移动搜索引擎关键词数量
    num_souGouPc: 0, //搜狗PC搜索引擎关键词数量
    num_souGouMobile: 0 //搜狗移动搜索引擎关键词数量
})
const state: {
    charts: any[]
    remark: string
    workingTimeFormat: string
    pauseWork: boolean
} = reactive({
    charts: [],
    remark: 'dashboard.Loading',
    workingTimeFormat: '',
    pauseWork: false,
})

const onChangeWorkState = () => {
    const time = parseInt((new Date().getTime() / 1000).toString())
    const workingTime = Local.get(WORKING_TIME)
    if (state.pauseWork) {
        // 继续工作
        workingTime.pauseTime += time - workingTime.startPauseTime
        workingTime.startPauseTime = 0
        Local.set(WORKING_TIME, workingTime)
        state.pauseWork = false
        startWork()
    } else {
        // 暂停工作
        workingTime.startPauseTime = time
        Local.set(WORKING_TIME, workingTime)
        clearInterval(workTimer)
        state.pauseWork = true
    }
}

const startWork = () => {
    const workingTime = Local.get(WORKING_TIME) || {date: '', startTime: 0, pauseTime: 0, startPauseTime: 0}
    const currentDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    const time = parseInt((new Date().getTime() / 1000).toString())

    if (workingTime.date != currentDate) {
        workingTime.date = currentDate
        workingTime.startTime = time
        workingTime.pauseTime = workingTime.startPauseTime = 0
        Local.set(WORKING_TIME, workingTime)
    }

    let startPauseTime = 0
    if (workingTime.startPauseTime <= 0) {
        state.pauseWork = false
        startPauseTime = 0
    } else {
        state.pauseWork = true
        startPauseTime = time - workingTime.startPauseTime
    }

    let workingSeconds = time - workingTime.startTime - workingTime.pauseTime - startPauseTime

    state.workingTimeFormat = formatSeconds(workingSeconds)
    if (!state.pauseWork) {
        workTimer = setInterval(() => {
            workingSeconds++
            state.workingTimeFormat = formatSeconds(workingSeconds)
        }, 1000)
    }
}
const formatSeconds = (seconds: number) => {
    let secondTime = 0
    let minuteTime = 0
    let hourTime = 0
    let dayTime = 0
    let result = ''

    if (seconds < 60) {
        secondTime = seconds
    } else {
        minuteTime = Math.floor(seconds / 60)
        secondTime = Math.floor(seconds % 60)
        if (minuteTime >= 60) {
            hourTime = Math.floor(minuteTime / 60)
            minuteTime = Math.floor(minuteTime % 60)
            if (hourTime >= 24) {
                dayTime = Math.floor(hourTime / 24)
                hourTime = Math.floor(hourTime % 24)
            }
        }
    }

    result =
        hourTime +
        t('dashboard.hour') +
        ((minuteTime >= 10 ? minuteTime : '0' + minuteTime) + t('dashboard.minute')) +
        ((secondTime >= 10 ? secondTime : '0' + secondTime) + t('dashboard.second'))
    if (dayTime > 0) {
        result = dayTime + t('dashboard.day') + result
    }
    return result
}
const getAgentList = () => {
    dashboardAgentLists().then(res => {
        agentContent.value.consume_month = res.data.content.consume_month
        agentContent.value.recharge_all = res.data.content.recharge_all
        agentContent.value.recharge_day = res.data.content.recharge_day
        agentContent.value.recharge_month = res.data.content.recharge_month
        agentContent.value.overage = res.data.content.overage
        agentContent.value.consume_all = res.data.content.consume_all
        agentContent.value.consume_day = res.data.content.consume_day
    })
}
const getOrderList = () => {
    dashboardOrderLists().then(res => {
        orderContent.value.order_check = res.data.content.order_check
        orderContent.value.order_pass = res.data.content.order_pass
        orderContent.value.order_reject = res.data.content.order_reject
    })
}
const getApiOrderList = () => {
    dashboardApiOrderLists().then(res => {
        apiOrderContent.value.order_check = res.data.content.order_check
        apiOrderContent.value.order_pass = res.data.content.order_pass
        apiOrderContent.value.order_reject = res.data.content.order_reject
    })
}
const getTaskList = () => {
    dashboardTaskLists().then(res => {
        taskContent.value.task_all = res.data.content.task_all
        taskContent.value.task_over = res.data.content.task_over
        taskContent.value.task_stopped = res.data.content.task_stopped
        taskContent.value.task_current = res.data.content.task_current
        taskContent.value.task_over_today = res.data.content.task_over_today
        taskContent.value.task_over_new_today = res.data.content.task_over_new_today
    })
}
const getApiTaskList = () => {
    dashboardApiTaskLists().then(res => {
        apiTaskContent.value.task_all = res.data.content.task_all
        apiTaskContent.value.task_over = res.data.content.task_over
        apiTaskContent.value.task_stopped = res.data.content.task_stopped
        apiTaskContent.value.task_current = res.data.content.task_current
        apiTaskContent.value.task_over_today = res.data.content.task_over_today
        apiTaskContent.value.task_over_new_today = res.data.content.task_over_new_today
    })
}
const getMemberList = () => {
    dashboardMemberLists().then(res => {
        memberContent.value.customer = res.data.content.customer
        memberContent.value.staff = res.data.content.staff
        memberContent.value.agent_first = res.data.content.agent_first
        memberContent.value.agent_second = res.data.content.agent_second
    })
}
const getCustomList = () => {
    dashboardCustomLists().then(res => {
        customContent.value.consume_month = res.data.content.consume_month
        customContent.value.recharge_all = res.data.content.recharge_all
        customContent.value.recharge_day = res.data.content.recharge_day
        customContent.value.recharge_month = res.data.content.recharge_month
        customContent.value.overage = res.data.content.overage
        customContent.value.consume_all = res.data.content.consume_all
        customContent.value.consume_day = res.data.content.consume_day
    })
}
const getKeywordList = () => {
    dashboardKeywordLists().then(res => {
        keywordContent.value.num_keyword = res.data.content.num_keyword
        keywordContent.value.num_optimization = res.data.content.num_optimization
        keywordContent.value.num_top10 = res.data.content.num_top10
        keywordContent.value.num_check = res.data.content.num_check
        keywordContent.value.num_reject = res.data.content.num_reject
        keywordContent.value.website = res.data.content.website
        keywordContent.value.num_baiduPc = res.data.content.num_baiduPc
        keywordContent.value.num_baiduMobile = res.data.content.num_baiduMobile
        keywordContent.value.num_360Pc = res.data.content.num_360Pc
        keywordContent.value.num_360Mobile = res.data.content.num_360Mobile
        keywordContent.value.num_souGouPc = res.data.content.num_souGouPc
        keywordContent.value.num_souGouMobile = res.data.content.num_souGouMobile

    })
}
const getHotelDaysList = () => {
    dashboardHotelDaysLists().then(res => {
        let yList: any[] = []
        let xList: any[] = []
        let arr = res.data.content
        arr.forEach((item: any) => {
            yList.push(item.y)
            xList.push(item.a)
        })
        setTimeout(() => {
            const option = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: yList
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: xList,
                        type: 'line'
                    }
                ]
            };
            const myChart = echarts.init(document.getElementById("meituan-hotels-morris-line-chart"));
            myChart.setOption(option);
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        }, 500)
    })
}
const getChartList = () => {
    dashboardChartLists().then(res => {
        days.value = res.data.content.days
        lastMonthValue.value = res.data.content.lastMonth
        thisMonthValue.value = res.data.content.thisMonth
        const option = {
            tooltip: {
                trigger: 'axis',
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                data: ['本月达标', '上月达标']
            },
            xAxis: {
                type: 'category',
                data: days.value
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '本月达标',
                data: thisMonthValue.value,
                type: 'line'
            }, {
                name: '上月达标',
                data: lastMonthValue.value,
                type: 'line'
            }]
        };
        const myChart = echarts.init(document.getElementById("myChart"));
        myChart.setOption(option);
        window.addEventListener("resize", () => {
            myChart.resize();
        });
    })
}
const getApiChartList = () => {
    dashboardApiChartLists().then(res => {
        apiDays.value = res.data.content.days
        apiLastMonthValue.value = res.data.content.lastMonth
        apiThisMonthValue.value = res.data.content.thisMonth
        const option = {
            tooltip: {
                trigger: 'axis',
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                data: ['本月达标', '上月达标']
            },
            xAxis: {
                type: 'category',
                data: apiDays.value
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '本月达标',
                data: apiThisMonthValue.value,
                type: 'line'
            }, {
                name: '上月达标',
                data: apiLastMonthValue.value,
                type: 'line'
            }]
        };
        const myChart = echarts.init(document.getElementById("myCharts"));
        myChart.setOption(option);
        window.addEventListener("resize", () => {
            myChart.resize();
        });
    })
}
const getApiSalesmanList = () => {
    dashboardHotelSalesmanLists().then(res => {
        let yList: any[] = res.data.content.dates
        let arr = res.data.content.source
        let salesman: any[] = [];
        let series: any[] = [];
        arr.forEach((item: any) => {
            salesman.push(item.salesman)
            let seriesItem = {
                name: item.salesman,
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: item.data
            }
            series.push(seriesItem)
        })
        const option = {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            legend: {
                data: salesman
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: yList
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            yAxis: {
                type: 'category',
            },
            series: series
        };
        const myChart = echarts.init(document.getElementById("meituan-hotels-salesman-morris-line-chart"));
        myChart.setOption(option);
        window.addEventListener("resize", () => {
            myChart.resize();
        });
    })
}
const getApiCitiesList = () => {
    dashboardHotelCitiesLists().then(res => {
        let arr = res.data.content
        const newArr: { value: number; name: string; }[] = [];
        arr.forEach((item: any) => {
            let obj = {
                value: 0,
                name: ''
            };
            obj.value = item['value'];
            obj.name = item['label'];
            newArr.push(obj);
        });
        const option = {
            tooltip: {
                trigger: 'item',
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [{
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: newArr
            }
            ]
        };
        const myChart = echarts.init(document.getElementById("meituan-city-hotels-morris-donut-chart"));
        myChart.setOption(option);
        window.addEventListener("resize", () => {
            myChart.resize();
        });
    })
}
const getApiTotalList = () => {
    dashboardHotelTotalLists().then(res => {
        let arr = res.data.content
        const newArrs: { value: number; name: string; }[] = [];
        arr.forEach((item: any) => {
            let obj = {
                value: 0,
                name: ''
            };
            obj.value = item['data'];
            obj.name = item['label'];
            newArrs.push(obj);
        });
        const option = {
            tooltip: {
                trigger: 'item',
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [{
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: newArrs
            }
            ]
        };
        const myChart = echarts.init(document.getElementById("meituan-hotels-total-morris-pie-chart"));
        myChart.setOption(option);
        window.addEventListener("resize", () => {
            myChart.resize();
        });
    })
}
const getApiKeywordList = () => {
    dashboardApiKeywordLists().then(res => {
        apiKeywordContent.value.num_keyword = res.data.content.num_keyword
        apiKeywordContent.value.num_optimization = res.data.content.num_optimization
        apiKeywordContent.value.num_top10 = res.data.content.num_top10
        apiKeywordContent.value.num_check = res.data.content.num_check
        apiKeywordContent.value.num_reject = res.data.content.num_reject
        apiKeywordContent.value.website = res.data.content.website
        apiKeywordContent.value.num_baiduPc = res.data.content.num_baiduPc
        apiKeywordContent.value.num_baiduMobile = res.data.content.num_baiduMobile
        apiKeywordContent.value.num_360Pc = res.data.content.num_360Pc
        apiKeywordContent.value.num_360Mobile = res.data.content.num_360Mobile
        apiKeywordContent.value.num_souGouPc = res.data.content.num_souGouPc
        apiKeywordContent.value.num_souGouMobile = res.data.content.num_souGouMobile
    })
}
onMounted(() => {
    startWork()
    getAgentList()
    getCustomList()
    getKeywordList()
    getTaskList()
    getOrderList()
    getMemberList()
    getApiKeywordList()
    getApiTaskList()
    getApiOrderList()
    getChartList()
    getApiChartList()
    getHotelDaysList()
    getApiCitiesList()
    getApiSalesmanList()
    getApiTotalList()
})
onBeforeMount(() => {
    for (const key in state.charts) {
        state.charts[key].dispose()
    }
})
onUnmounted(() => {
    clearInterval(workTimer)
})
</script>
<script lang="ts">
import {defineComponent, ref} from 'vue'

export default defineComponent({
    name: 'dashboard',
})
</script>

<style scoped lang="scss">
.welcome {
    transition: all 0.3s ease;
    background: #e1eaf9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 15px 20px !important;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);

    .welcome-img {
        height: 100px;
        margin-right: 10px;
        user-select: none;
    }

    .welcome-title {
        font-size: 1.5rem;
        line-height: 30px;
        color: var(--ba-color-primary-light);
    }

    .welcome-note {
        padding-top: 6px;
        font-size: 15px;
        color: var(--el-text-color-primary);
    }
}

.working {
    height: 130px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    position: relative;

    &:hover {
        .working-coffee {
            -webkit-transform: translateY(-4px) scale(1.02);
            -moz-transform: translateY(-4px) scale(1.02);
            -ms-transform: translateY(-4px) scale(1.02);
            -o-transform: translateY(-4px) scale(1.02);
            transform: translateY(-4px) scale(1.02);
            z-index: 999;
        }
    }

    .working-coffee {
        transition: all 0.3s ease;
        width: 80px;
    }

    .working-text {
        display: block;
        width: 100%;
        font-size: 15px;
        text-align: center;
        color: var(--el-text-color-primary);
    }

    .working-opt {
        position: absolute;
        top: -40px;
        right: 10px;
        background-color: rgba($color: #000000, $alpha: 0.3);
        padding: 10px 20px;
        border-radius: 20px;
        color: var(--ba-bg-color-overlay);
        transition: all 0.3s ease;
        cursor: pointer;
        opacity: 0;
        z-index: 999;

        &:active {
            background-color: rgba($color: #000000, $alpha: 0.6);
        }
    }

    &:hover {
        .working-opt {
            opacity: 1;
            top: 0;
        }

        .working-done {
            opacity: 1;
            top: 50px;
        }
    }
}

.small-panel-box {
    margin-top: 20px;
}

.small-panel {
    background-color: #e9edf2;
    border-radius: var(--el-border-radius-base);
    transition: all 0.3s ease;
    padding: 25px;
    margin-bottom: 20px;

    .small-panel-title {
        color: #92969a;
        font-size: 15px;
    }

    .small-panel-content {
        display: flex;
        align-items: flex-end;
        margin-top: 20px;
        color: #2c3f5d;

        .content-left {
            font-size: 24px;

            .icon {
                margin-right: 10px;
            }

            span {
                display: inline-block;
                font-size: 28px;
            }
        }

        .content-right {
            font-size: 18px;
            margin-left: auto;
        }

        .color-success {
            color: var(--el-color-success);
        }

        .color-warning {
            color: var(--el-color-warning);
        }

        .color-danger {
            color: var(--el-color-danger);
        }

        .color-info {
            color: var(--el-text-color-secondary);
        }
    }
}

.growth-chart {
    margin-bottom: 20px;
}

.suspension:hover {
    -webkit-transform: translateY(-4px) scale(1.02);
    -moz-transform: translateY(-4px) scale(1.02);
    -ms-transform: translateY(-4px) scale(1.02);
    -o-transform: translateY(-4px) scale(1.02);
    transform: translateY(-4px) scale(1.02);
    -webkit-box-shadow: 0 14px 24px rgba(0, 0, 0, 0.2);
    box-shadow: 0 14px 24px rgba(0, 0, 0, 0.2);
    z-index: 999;
    border-radius: 6px;
}

.user-growth-chart,
.file-growth-chart {
    height: 260px;
}

.new-user-growth {
    height: 300px;
}

.user-source-chart,
.user-surname-chart {
    height: 400px;
}

.new-user-item {
    display: flex;
    align-items: center;
    padding: 20px;
    margin: 10px 15px;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);
    background-color: var(--ba-bg-color-overlay);

    .new-user-avatar {
        height: 48px;
        width: 48px;
        border-radius: 50%;
    }

    .new-user-base {
        margin-left: 10px;
        color: #2c3f5d;

        .new-user-name {
            font-size: 15px;
        }

        .new-user-time {
            font-size: 13px;
        }
    }

    .new-user-arrow {
        margin-left: auto;
    }
}

.new-user-card :deep(.el-card__body) {
    padding: 0;
}

@media screen and (max-width: 425px) {
    .welcome-img {
        display: none;
    }
}

@media screen and (max-width: 1200px) {
    .lg-mb-20 {
        margin-bottom: 20px;
    }
}

html.dark {
    .welcome {
        background-color: var(--ba-bg-color-overlay);
    }

    .small-panel {
        background-color: var(--ba-bg-color-overlay);

        .small-panel-content {
            color: var(--el-text-color-regular);
        }
    }

    .new-user-item {
        .new-user-base {
            color: var(--el-text-color-regular);
        }
    }
}

.user-reg {
    background-color: #F5F5F5;
    margin-bottom: 0;
    padding: 25px 0;

    &.vip {
        //border:1px solid red;
    }

    > .box {
        .el-col-8, .el-col-6 {
            flex: unset;
        }

        > .el-row {
            justify-content: space-between;
            width: 100%;

            > .el-col-8 {
                width: 32%;
                padding: 10px 0;

                > .small-panel {
                    margin-bottom: 0;
                }
            }

            > .el-col-6 {
                width: 24%;
                padding: 10px 0;

                > .small-panel {
                    margin-bottom: 0;
                }
            }
        }
    }
}

.Task_attainment_chart {
    height: 300px;
    border: 1px solid red;
}
</style>

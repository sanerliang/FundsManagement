<template>
    <div class="dialog">
        <el-dialog 
            :title="dialog.title" 
            :visible.sync="dialog.show" 
            :close-on-click-modal="true" 
            :close-on-press-escape="true"
            :modal-append-to-body="false">
            <div class="form">
                <el-form ref="form" 
                    :model="formData" 
                    :rules="form_rules" 
                    :label-width="formLabelWidth"
                    style="margin:10px;">

                    <el-form-item label="收支类型：" :label-width="formLabelWidth">
                        <el-select v-model="formData.type" placeholder="收支类型">
                            <el-option v-for="(formtype,index) in format_type_list" :key="index" :label="formtype" :value="formtype"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="describe" label="收支描述：" :label-width="formLabelWidth">
                        <el-input type="describe" v-model="formData.describe"></el-input>
                    </el-form-item>

                    <el-form-item prop='income'  label="收入:" :label-width="formLabelWidth">
                        <el-input type="income" v-model="formData.income"></el-input>
                    </el-form-item>

                    <el-form-item prop='expend' label="支出:" :label-width="formLabelWidth">
                        <el-input type="expend" v-model="formData.expend"></el-input>
                    </el-form-item>

                    <el-form-item prop='cash' label="账户现金:" :label-width="formLabelWidth">
                        <el-input type="cash" v-model="formData.cash"></el-input>
                    </el-form-item>

                    <el-form-item label="备注:" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="formData.remark"></el-input>
                    </el-form-item>

                    <el-form-item class="text_right">
                        <el-button @click="onCancel()">取消</el-button>
                        <el-button @click="onSubmit('form')" type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'dialogForm',
    data() {
        return {
            format_type_list: [
                "提现",
                "提现手续费",
                "充值",
                "优惠券",
                "充值礼券",
                "转账"
            ],
            form_rules: {
                describe: [
                    {
                        required: true,
                        message: "收支描述不能为空",
                        trigger: "blur"
                    }
                ],
                income: [
                    { 
                        required: true, 
                        message: "收入不能为空！", 
                        trigger: "blur" 
                    }
                ],
                expend: [
                    { 
                        required: true, 
                        message: "支出不能为空！", 
                        trigger: "blur" 
                    }
                ],
                cash: [
                    { 
                        required: true, 
                        message: "账户不能为空！", 
                        trigger: "blur" 
                    }
                ]
            },
            formLabelWidth: '120px'
        }
    },
    props: {
        dialog: Object,
        formData: Object
    },
    methods: {
        onCancel: function() {
            this.dialog.show = false;
        },
        onSubmit: function(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    const url = this.dialog.option == "add" ? "add" : `edit/${this.formData.id}`;
                    this.$axios.post(`/api/profiles/${url}`, this.formData).then((res, req) => {
                        this.$message({
                            message: "成功！",
                            type: "success"
                        });

                        this.dialog.show = false;
                        this.$emit('update');
                    })
                }
            })
        }
    }
}
</script>


<style scoped>

</style>

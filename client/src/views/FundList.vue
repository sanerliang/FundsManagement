<template>
    <div class="fillcontain">
        <div>
            <el-form :inline="true" ref="add_data" v-model="search_data">
                <el-form-item label="按照时间筛选">
                    <el-date-picker
                        v-model="search_data.startTime"
                        type="datetime"
                        placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker
                        v-model="search_data.endTime"
                        type="datetime"
                        placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" icon="search" @click="handleSearch()">筛选</el-button>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button type="primary" size="small" icon="view" @click="handleAdd()" v-if="user.identity == 'manager'">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                v-if="tableData.length > 0"
                :data='tableData'
                max-height="450"
                border
                :default-sort = "{prop: 'date', order: 'descending'}"
                style="width: 100%">
                <el-table-column type="index" label="序号" align='center' width="70"></el-table-column>
                <el-table-column prop="date" label="创建时间" align='center' width="250" sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="收支类型" align='center' width="150"></el-table-column>
                <el-table-column prop="describe" label="收支描述" align='center' width="180"></el-table-column>
                <el-table-column prop="income" label="收入" align='center' width="170" sortable> 
                    <template slot-scope="scope">  
                        <span style="color:#00d053">+ {{ scope.row.income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="expend" label="支出" align='center' width="170">
                    <template slot-scope="scope">  
                        <span style="color:#f56767">- {{ scope.row.expend }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cash" label="账户现金" align='center' width="170">
                    <template slot-scope="scope">  
                        <span style="color:#4db3ff">{{ scope.row.cash }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align='center' width="220">
                </el-table-column>
                <el-table-column prop="operation" align='center' label="操作" fixed="right" width="320"  v-if="user.identity == 'manager'">
                    <template slot-scope='scope'>
                        <el-button type="warning" icon='edit' size="small" @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
                        <el-button type="danger" icon='delete' size="small" @click='handleDelete(scope.$index, scope.row)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="paginations.page_index"
                            :page-sizes="paginations.page_sizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout" 
                            :total="paginations.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <DialogForm :dialog="dialog" :formData="formData" @update="getProfile()"></DialogForm>
    </div>
</template>

<script>
    import DialogForm from "../components/DialogForm";
    export default {
        name: "fundList",
        data() {
            return {
                tableData: [],
                allTableData: [],
                dialog: {
                    show: false,
                    title: "",
                    option: "edit"
                },
                formData: {
                    type: "",
                    describe: "",
                    income: "",
                    expend: "",
                    cash: "",
                    remark: "",
                    id: ""
                },
                paginations: {
                    page_index: 1, // current page index
                    total: 0, // total counts
                    page_size: 5, // show count default
                    page_sizes: [5,10,15,20], // show count per page
                    layout: "total,sizes,prev,pager,next,jumper"
                },
                search_data: {
                    startTime: "",
                    endTime: ""
                },
                filterTableData:[]
            }
        },
        computed: {
            user() {
                return this.$store.getters.user;
            }
        },
        components: {
            DialogForm
        },
        created() {
            this.getProfile();
        },
        methods: {
            getProfile() {
                // Get table data
                this.$axios.get('/api/profiles').then((res, req) => {
                    this.allTableData = res.data;
                    this.filterTableData = res.data;

                    // Set paging data
                    this.setPaginations();
                }).catch((err) => {
                    console.log(err);
                })
            },
            setPaginations() {
                // paging property
                this.paginations.total = this.allTableData.length;
                this.paginations.page_index = 1;
                this.paginations.page_size = 5;

                // set default paging data
                this.tableData = this.allTableData.filter((item,index) => {
                    return index < this.paginations.page_size;
                });
            },
            handleAdd(index, row) {
                this.dialog = {
                    show: true,
                    title: "添加资金信息",
                    option: "add"    
                }

                this.formData = {
                    type: "",
                    describe: "",
                    income: "",
                    expend: "",
                    cash: "",
                    remark: "",
                    id: ""
                }
            },
            handleEdit(index, row) {
                this.dialog = {
                    show: true,
                    title: "编辑资金信息",
                    option: "edit"    
                };

                this.formData = {
                    type: row.type,
                    describe: row.describe,
                    income: row.income,
                    expend: row.expend,
                    cash: row.cash,
                    remark: row.remark,
                    id: row._id
                }
            },
            handleDelete(index, row) {
                this.$axios.delete(`/api/profiles/delete/${row._id}`).then(res=>{
                    this.$message('删除成功');
                    this.getProfile();
                })
            },
            handleSizeChange(pageSize) {
                // Change size
                this.paginations.page_index = 1;
                this.paginations.page_size = pageSize;

                this.tableData = this.allTableData.filter((item,index) => {
                    return index < this.paginations.page_size;
                });
            },
            handleCurrentChange(page) {
                // Get current page
                let begin_index = this.paginations.page_size * (page - 1);

                // Get total count of all data
                let end_index = this.paginations.page_size * page;

                this.tableData = this.allTableData.filter((item,index) => {
                    return (index <= end_index && index >= begin_index);
                });
            },
            handleSearch() {
                if (!this.search_data.startTime || !this.search_data.endTime) {
                    this.$message({
                        type: "warning",
                        message: "请选择时间！"
                    });
                }

                const sTime = this.search_data.startTime.getTime();
                const eTime = this.search_data.endTime.getTime();

                this.allTableData = this.filterTableData.filter(item => {
                    let date = new Date(item.date);
                    let time = date.getTime();
                    return time >= sTime && time <= eTime;
                });

                this.setPaginations();
            }
        }
    }
</script>

<style scoped>
.fillcontain {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
}
.btnRight {
    float: right;
}
.pagination {
    text-align: right;
    margin-top: 10px;
}
</style>

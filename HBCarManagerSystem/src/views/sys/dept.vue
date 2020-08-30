<template>
  <div class="app-container">
    <!--左工具栏-->
    <div class="head-container left" style="float:left;">
      <!--部门名称搜索框-->
      <el-input
        v-model="queryParams.name"
        clearable
        :size="size"
        style="width: 200px;"
        placeHolder="输入部门名称搜索"
        prefix-icon="filter-item"
      />
      <kt-button icon="el-icon-search"  perms="sys:dept:view" type="success" @click="search()">搜索</kt-button>
      <kt-button icon="el-icon-plus"  perms="sys:dept:add" type="primary" @click="addDept" >新增</kt-button>
    </div>
    <div class="head-container right" style="float:right;">
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="fa fa-refresh" @click="refreshTreeData()" :size="size"></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog" :size="size"></el-button>
            </el-tooltip>
            <el-tooltip content="导出" placement="top">
              <el-button icon="fa fa-file-excel-o" @click="exportDeptExcelFile" :size="size" :loading="exportLoading"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <!--表格树内容栏-->
   <el-table :data="tableTreeData" stripe size="mini" style="width: 100%;" row-key="id"
              v-loading="tableLoading" rowKey="id" element-loading-text="加载中。。。">
      <el-table-column
        prop="id" header-align="center" align="center" :width="setWidth('id')" :label="setLabel('id')" v-if="includeColumn('id')">
      </el-table-column>
      <el-table-column
       prop="name" header-align="center" align="center" treeKey="id" :width="setWidth('name')" :label="setLabel('name')" v-if="includeColumn('name')" >
      </el-table-column>
      <el-table-column
        prop="parentName" header-align="center" align="center" :width="setWidth('parentName')" :label="setLabel('parentName')"  v-if="includeColumn('parentName')">
      </el-table-column>
      <el-table-column
       prop="address" header-align="center" align="center" :width="setWidth('address')" :label="setLabel('address')"  v-if="includeColumn('address')">
      </el-table-column>
     <el-table-column
       prop="telephone" header-align="center" align="center" :width="setWidth('telephone')" :label="setLabel('telephone')"  v-if="includeColumn('telephone')">
     </el-table-column>
     <el-table-column
       prop="website" header-align="center" align="center" :width="setWidth('website')" :label="setLabel('website')"  v-if="includeColumn('website')">
     </el-table-column>
     <el-table-column
       prop="isCompany" header-align="center" align="center" :width="setWidth('isCompany')" :label="setLabel('isCompany')"  v-if="includeColumn('isCompany')">
       <template slot-scope="scope">
         <el-tag>{{deptTypeList[scope.row.isCompany]}}</el-tag>
       </template>
     </el-table-column>
      <el-table-column
        prop="orderNum" header-align="center" align="center" :label="setLabel('orderNum')"  :width="setWidth('orderNum')" v-if="includeColumn('orderNum')">
      </el-table-column>
      <el-table-column
        prop="createBy" header-align="center" align="center" :label="setLabel('createBy')" :width="setWidth('createBy')" v-if="includeColumn('createBy')">
      </el-table-column>
      <el-table-column
        prop="createTime" header-align="center" align="center" :label="setLabel('createTime')" :formatter="dateFormat" :width="setWidth('createBy')" v-if="includeColumn('createTime')">
      </el-table-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="185" label="操作">
          <template slot-scope="scope">
            <kt-button icon="fa fa-edit" perms="sys:dept:edit" :size="size" @click="handleEdit(scope.$index, scope.row)" style="margin:auto 0;"></kt-button>
            <kt-button icon="fa fa-trash" perms="sys:dept:delete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" style="margin:auto 0;" ></kt-button>
          </template>
      </el-table-column>
    </el-table>
    <!--表格显示列界面-->
    <table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns" :init-columns="columns" @handleFilterColumns="handleFilterColumns"></table-column-filter-dialog>
    <!--新增编辑界面-->
    <el-dialog  :title="operation ? '新增部门/公司':'编辑部门/公司'" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form :model="temp" label-width="120px"   ref="temp"  :rules="rules" :size="size"
             label-position="right">
      <el-form-item prop="isCompany" label="类型:">
        <el-radio-group v-model="temp.isCompany">
          <el-radio v-for="(type,index) in deptTypeList" :label="index" :key="index">
            {{ type }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form-item prop="name"  label="名称:" >
              <el-input v-model="temp.name" placeholder="请输入部门或公司名称"></el-input>
            </el-form-item>
            <el-form-item prop="parentId"  label="上级部门:">
              <treeselect
                v-model="temp.parentId"
                :options="treeSelectData"
                placeholder="选择部门"
                @select="selectFun"
              />
            </el-form-item>
            <el-form-item v-if="temp.isCompany" prop="registeredTime" label="注册时间">
              <el-date-picker
                v-model="temp.registeredTime"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="temp.isCompany" prop="juridicalPerson" label="公司法人:">
              <el-input v-model="temp.juridicalPerson" placeholder="请输入公司法人"></el-input>
            </el-form-item>
            <el-form-item v-if="temp.isCompany" prop="registeredCapital" label="注册资金:">
              <el-input v-model="temp.registeredCapital" placeholder="请输入注册资金（万元)"></el-input>
            </el-form-item>
            <el-form-item v-if="temp.isCompany" prop="stockRate" label="持股明细:">
              <el-input type="textarea" autosize v-model="temp.stockRate" placeholder="请输入持股比例"></el-input>
            </el-form-item>

            <el-form-item v-if="temp.isCompany" prop="address" label="公司地址:">
              <el-input v-model="temp.address" placeholder="请输入公司地址"></el-input>
            </el-form-item>
            <el-form-item v-if="temp.isCompany" prop="address" label="公司网址:">
              <el-input v-model="temp.website" placeholder="请输入公司地址"></el-input>
            </el-form-item>
            <el-form-item v-if="temp.isCompany" prop="industry" label="所属行业:">
              <el-input v-model="temp.industry" placeholder="请输入所属行业"></el-input>
            </el-form-item>
            <el-form-item v-if="temp.isCompany" prop="fax" label="公司传真:">
              <el-input v-model="temp.fax" placeholder="请输入传真号"></el-input>
            </el-form-item>
            <el-form-item v-if="temp.isCompany" prop="administrativeDivision" label="行政区域:">
              <v-region :town="true" @values="regionChange"></v-region>
            </el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item v-if="temp.isCompany" prop="telephone" label="联系电话:">
                  <el-input v-model="temp.telephone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item v-if="temp.isCompany" prop="latitude" label="公司经度:">
                  <el-input v-model="temp.latitude" placeholder="弹出的对话框单击" @focus="locationDialogVisible = true"></el-input>
                </el-form-item>
                <el-form-item v-if="temp.isCompany" prop="manager" label="总经理:">
                  <el-input v-model="temp.manager" placeholder="请输入经理姓名"></el-input>
                </el-form-item>
                <el-form-item v-if="temp.isCompany" prop="viceManager" label="副总经理:">
                  <el-input v-model="temp.viceManager" placeholder="请输入副经理姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="orderNum" label="顺序编号:">
                  <el-input-number v-model="temp.orderNum" controls-position="right" :min="0" label="排序编号"></el-input-number>
                </el-form-item>
                <el-form-item v-if="temp.isCompany" prop="longitude" label="公司纬度:">
                  <el-input v-model="temp.longitude" placeholder="弹出的对话框单击" @focus="locationDialogVisible = true"></el-input>
                </el-form-item>
                <el-form-item v-if="temp.isCompany" prop="managerPhone" label="总经理电话:">
                  <el-input v-model="temp.managerPhone" placeholder="请输入经理电话"></el-input>
                </el-form-item>
                <el-form-item v-if="temp.isCompany" prop="viceManagerPhone" label="副经理电话:">
                  <el-input v-model="temp.viceManagerPhone" placeholder="请输入副经理电话"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            </el-col>
            <el-col :span="10">
              <el-form-item  v-if="temp.isCompany" prop="workStartTime" label="进场时间">
                <el-date-picker
                  v-model="temp.workStartTime"
                  type="date"
                  style="min-width:120px;"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item  v-if="temp.isCompany" prop="personNum" label="环卫人员:">
                <el-input v-model="temp.personNum"  placeholder="环卫人员数量(人）"></el-input>
              </el-form-item>
              <el-form-item v-if="temp.isCompany" prop="serviceNum" label="服务人口:">
                <el-input v-model="temp.serviceNum"  placeholder="服务人口数量(万人）"></el-input>
              </el-form-item>
              <el-form-item v-if="temp.isCompany" prop="cleanArea" label="清扫保洁面积:">
                <el-input v-model="temp.cleanArea"  placeholder="清扫保洁面积（万平方米）"></el-input>
              </el-form-item>
              <el-form-item v-if="temp.isCompany" prop="greenArea" label="绿化带面积:">
                <el-input v-model="temp.greenArea"  placeholder="绿化带面积（万平方米）"></el-input>
              </el-form-item>
              <el-form-item v-if="temp.isCompany" prop="greenArea" label="绿化带面积:">
                <el-input v-model="temp.greenArea"  placeholder="绿化带面积（万平方米）"></el-input>
              </el-form-item>
              <el-form-item  v-if="temp.isCompany" prop="machineRate" label="机械化作业率">
                <el-input v-model="temp.machineRate" placeholder="机械化作业率，例如：0.75"></el-input>
              </el-form-item>
              <el-form-item v-if="temp.isCompany" prop="rubbishVolume" label="垃圾清运量:">
                <el-input v-model="temp.rubbishVolume"  placeholder="垃圾清运量（吨/天）"></el-input>
              </el-form-item>
              <el-form-item v-if="temp.isCompany" prop="renewableResourcesVolume" label="可再生资源回收:">
                <el-input v-model="temp.renewableResourcesVolume"  placeholder="可再生资源回收（吨/月）"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
      <el-form-item v-if="temp.isCompany" prop="remarks" label="备注">
        <el-input v-model="temp.remarks" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
      <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>
    <el-dialog class="location-dialog" title="选择位置" center="true" width="60%" :visible.sync="locationDialogVisible" :close-on-click-modal="false">
      <div style="padding-top:0px;position:relative;top:-30px;">
        <div style="height:30px;">
        <!--<el-row :gutter="20">
          <el-col :span="12">
            <span>关键词：<el-input  v-model="searchKeyword" placeholder="请输入" size="mini" style="width:150px;"></el-input></span>
          </el-col>
          <el-col :span="12">
          关键词：<el-input v-model="searchLocation" placeholder="请输入" size="mini" style="width:150px;" ></el-input>
          </el-col>
        </el-row>-->
          <span>
            关键词：<el-input  v-model="searchKeyword" placeholder="请输入" size="mini" style="width:150px;"></el-input>
            位置信息：<el-input v-model="searchLocation" placeholder="请输入" size="mini" style="width:150px;" ></el-input>
          </span>
      </div>
      <baidu-map class="map" center="中国" :zoom="map.zoom" @ready="handler">
             <!--缩放-->
             <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
             <bm-local-search :keyword="searchKeyword" :auto-viewport="true" :location="searchKeyword"></bm-local-search>
      </baidu-map>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import TableColumnFilterDialog  from '@/views/core/TableColumnFilterDialog'
  import KtButton from "@/views/core/KtButton"
  import pagination from "@/components/Pagination"
  import {batchDelete, exportDeptExcelFile, findTree, save} from "@/api/system/dept"
  import TableTreeColumns from '@/views/core/TableTreeColumns'
  import {format} from "@/utils/datetime";
  import {downloadFile} from "@/utils";
    export default {
        name: "dept",
      components:{ TableColumnFilterDialog,KtButton,pagination,TableTreeColumns ,Treeselect},
      data(){
          return{
            map:{
              center:{
                lng:113.136844,  //中车电动汽车股份有限公司经度
                lat:27.82916     //中车电动汽车股份有限公司纬度
              },
              zoom:5,
              show:true,
              dragging:true,
              keyword:"中车",
              location:"",
            },
            searchKeyword:'',
            searchLocation:'',
            queryParams: {
              name:''     //部门名称
            },
            tableLoading:false,        //表格加载状态
            exportLoading:false,   //导出按钮加载状态
            editLoading:false,   //对话框提交按钮加载状态
            size:'mini',     //按钮尺寸
            columns:[],       //表格所有列属性
            filterColumns:[], //过滤后显示列属性
            dialogVisible:false,  //编辑新增对话框显示属性
            locationDialogVisible:false, //位置选择显示属性
            operation:true,   //选择编辑或者新增对话框
            temp:{            //行数据
              id: 0,
              name: '',
              parentId: 1,
              parentName: '',
              orderNum: 0,
              address:'',
              telephone:'',
              website:'',
              industry:'',
              isCompany:0,
              personNum:null,  //环卫人员数量
              serviceNum:null,//服务人口（万）
              cleanArea:null, //清扫保洁面积(万平方米）
              greenArea:null,	//绿化带面积(万平方米）
              machineRate:null,	//机械化作业率
              rubbishVolume:null,//垃圾清运量（吨/天）
              renewableResourcesVolume:null,//可再生资源回收（吨/月）
              workStartTime:''	,	//进场时间
              administrativeDivision:'',	//行政区域
              latitude:null,	//经度
              longitude:null,	//纬度
              juridicalPerson:'',//公司法人
              registeredTime:'',	//注册时间
              registeredCapital:null, //注册资金
              stockRate:'',   //持股说明
              manager:'',		//总经理
              managerPhone:'',//总经理电话
              viceManager:'', //副总经理
              viceManagerPhone:'',//副总经理电话
              fax:''//传真号
            },
            dataForm:{},
            deptTypeList:["部门","公司"],
            treeSelectData:[] , //部门数据树
            tableTreeData:[],   //表格部门数据
            rules: {
              name: [
                {
                  required: true,
                  trigger: 'blur',
                  message:'请输入部门或公司名称'
                }
              ]
            },
          }
      },
      methods: {
        handler({BMap,map }){
          let me=this
          this.map = map
          console.log(BMap,map)
          //鼠标缩放
          map.enableScrollWheelZoom(true);
          //修改鼠标样式
          map.setDefaultCursor("crosshair");
          //点击事件获取经纬度
          map.addEventListener('dblclick',function(e){
            console.log(e.point.lng,e.point.lat)
            me.temp.latitude = e.point.lng
            me.temp.longitude = e.point.lat
          })
      },
        //获取vue-treeselect对象
        filterDeptTree(deptList) {
          const res = []
          deptList.forEach(dept => {
            const tmp = {
              id: dept.id,
              label: dept.name,
            }
            if (dept.children.length > 0) {
              tmp.children = this.filterDeptTree(dept.children)
            }
            res.push(tmp)
          })
          return res
        },

        selectFun(){

        },
        //新增部门
        addDept() {
          this.dialogVisible = true
          this.operation = true
          this.temp = {
            id: 0,
            name: '',
            parentId: 1,
            parentName: '',
            orderNum: 0,
            address:'',
            telephone:'',
            website:'',
            industry:'',
            isCompany:0,
            personNum:null,  //环卫人员数量
            serviceNum:null,//服务人口（万）
            cleanArea:null, //清扫保洁面积(万平方米）
            greenArea:null,	//绿化带面积(万平方米）
            machineRate:null,	//机械化作业率
            rubbishVolume:null,//垃圾清运量（吨/天）
            renewableResourcesVolume:null,//可再生资源回收（吨/月）
             workStartTime:''	,	//进场时间
            administrativeDivision:'',	//行政区域
            latitude:null,	//经度
            longitude:null,	//纬度
            juridicalPerson:'',//公司法人
            registeredTime:'',	//注册时间
            registeredCapital:null, //注册资金
            stockRate:'',   //持股说明
            manager:'',		//总经理
            managerPhone:'',//总经理电话
            viceManager:'', //副总经理
            viceManagerPhone:'',//副总经理电话
            fax:''//传真号
          }
        },

        //导出部门数据
        exportDeptExcelFile() {
            this.exportLoading =true
          //let name =this.queryParams.name
          let data = {
              name:''
          }
            exportDeptExcelFile(data).then( (response) => {
              this.exportLoading = false
              let a =  Math.floor(Math.random()*100)+"部门数据"
              downloadFile(response,a,'xlsx')
            }).catch( (error) => {
              this.exportLoading = false
              this.$notify({
                title:'操作提示',
                message:error.message,
                duration: 2000,
                type:'error'
              })
            })
        },
        //行政区域函数,data={ province:{ key,value},city:{key,value},area:{key,value},town:{key,value}}
        regionChange(data){

          console.log(data);
          if( data.province !==null && data.province !==''){
            this.temp.administrativeDivision = data.province.value
            if(data.city !==null && data.city !==''){
              this.temp.administrativeDivision = data.province.value+data.city.value
              if(data.area !==null && data.area !==''){
                this.temp.administrativeDivision = data.province.value+data.city.value+data.area.value
                if(data.town !==null && data.town !==''){
                  this.temp.administrativeDivision = data.province.value+data.city.value+data.area.value+data.town.value
                }
              }
            }
          }
          console.log("this.temp.administrativeDivision"+this.temp.administrativeDivision)
        },

        //提交部门数据表单
        submitForm() {
          this.$refs.temp.validate((valid) => {
            if (valid) {
              this.$confirm('确认提交吗?', '提示', {}).then(() => {
                  this.editLoading = true
                  let params = Object.assign({}, this.temp)
                  save(params).then((response) => {
                  this.editLoading = false
                  if(response.msg === 'ok') {
                    this.$message({ message: '操作成功', type: 'success' })
                    this.dialogVisible = false
                    this.refreshTreeData()
                  } else {
                    this.$message({message: '操作失败, ' + response.msg, type: 'error'})
                  }
                }).catch( error =>{
                    this.editLoading =false
                    this.$notify({
                      title:'操作提示',
                      message:error.message,
                      duration: 2000,
                      type:'error'
                    })
                  })
                })
            }
          })
        },

        //表格列属性选择对话框
        displayFilterColumnsDialog() {
          this.$refs.tableColumnFilterDialog.setDialogVisible(true)
          this.$nextTick(() => {
            this.$refs.tableColumnFilterDialog.addRow()
          })
        },

        //处理表格列过滤显示
        handleFilterColumns(data) {
          this.filterColumns = data.filterColumns
          this.$refs.tableColumnFilterDialog.setDialogVisible(false)
        },

        // 处理表格列过滤显示
        initColumns() {
          this.columns = [
            {prop: "id", label: "ID", minWidth: 50},
            {prop: "name", label: "名称", minWidth: 80},
            {prop: "parentName", label: "上级部门", minWidth: 80},
            {prop: "address", label: "公司地址", minWidth: 80},
            {prop: "telephone", label: "联系电话", minWidth: 80},
            {prop: "telephone", label: "公司网址", minWidth: 80},
            {prop: "isCompany", label: "类型", minWidth: 80},
            {prop: "remarks", label: "备注", minWidth: 80},
            {prop: "orderNum", label: "排序", minWidth: 70},
            {prop: "createBy", label: "创建人", minWidth: 120},
            {prop: "createTime", label: "创建时间", minWidth: 100}
          ]
          this.filterColumns = JSON.parse(JSON.stringify(this.columns));//深拷贝
        },

        //判断是否显示列
        includeColumn(prop){
          return this.filterColumns.some(item =>{
            return item.prop === prop
          })
        },
        //设置列宽度
        setWidth(prop){
          let width = 80
          this.filterColumns.forEach( item => {
            if(item.prop === prop){
             width = item.minWidth
            }
          })
          return "'minWth':"+width
        },

        //设置列名称
        setLabel(prop){
          let label='列名'
          this.filterColumns.forEach( item => {
            if(item.prop === prop){
              label = item.label
            }
          })
          return label
        },

        //表格编辑按钮
        handleEdit(index, row) {
          this.dialogVisible = true
          this.operation = false
          Object.assign(this.temp, row)
        },

        //表格删除按钮
        handleDelete(index, row) {
          this.$confirm('确认删除选中记录吗？', '提示', {
            type: 'warning'
          }).then(() => {
            let params = this.getDeleteIds([], row)
            batchDelete(params).then( response => {
              if(response.msg === 'ok'){
                this.$message(
                  {
                    message:'删除成功',
                    type:'success'
                  })
              this.refreshTreeData()
              }else {
                this.$message(
                  {
                    message:'操作失败',
                    type:'error'
                  })
              }
            }).catch( error =>{
              this.loading =false
              this.$notify({
                title:'操作提示',
                message:error.message,
                duration: 2000,
                type:'error'
              })
            })
          })
        },

        // 获取删除的包含子机构的id列表
        getDeleteIds (ids, row) {
          ids.push({id:row.id})
          if(row.children != null) {
            for(let i=0, len=row.children.length; i<len; i++) {
              this.getDeleteIds(ids, row.children[i])
            }
          }
          return ids
        },

        //查找部门树
        findTreeData(name) {
          this.tableLoading = true
          return new Promise((resolve,reject) => {
            findTree({'name':name}).then(res => {
              this.tableLoading = false
              this.tableTreeData = res.data
              resolve(res.data)
            }).catch( error =>{
              this.tableLoading =false
              reject(error)
              this.$notify({
                title:'操作提示',
                message:error.message,
                duration: 2000,
                type:'error'
              })
            })
          })
        },
        refreshTreeData(){
           this.findTreeData('').then( result =>{
             this.treeSelectData = this.filterDeptTree(result)
           })
        },

        //搜索
        search(){
          let name=this.queryParams.name
          this.findTreeData(name)
        },
        // 时间格式化
        dateFormat: function (row, column, cellValue, index){
          return format(row[column.property])
        }
      },

      mounted() {
        this.initColumns()
        this.refreshTreeData()
      }
    }
</script>

<style scoped>
  .map{
    width:100%;
    height:550px;

  }
</style>
<!--
private String name;       //单位名称
private Long parentId;     //父Id
private String address;		//办公地址
private String telephone;	//座机
private String website;		//网址
private String industry;	//行业
private String remarks;		//备注
private Integer orderNum;   //排序
private Integer isCompany;	//公司或部门
private Byte delFlag;		//删除标记
private Integer personNum;  //环卫人员数量
private Integer serviceNum;	//服务人口（万）
private Integer cleanArea;  //清扫保洁面积(万平方米）
private Integer greenArea;	//绿化带面积(万平方米）
private Float mechineRate;	//机械化作业率
private Float rubbishVolume;//垃圾清运量（吨/天）
private Float renewableResourcesVolume;//可再生资源回收（吨/月）
private Date workStartTime;		//进场时间
private String administrativeDivision;	//行政区域
private Float latitude;		//经度
private Float longitude;	//纬度
private String juridicalPerson;//公司法人
private Date registeredTime;	//注册时间
private BigDecimal registeredCapital; //注册资金
private String stockRate;   //持股说明
private String manager;		//总经理
private String managerPhone;//总经理电话
private String viceManager; //副总经理
private String viceManagerPhone;//副总经理电话
private String fax; //传真号
<el-form-item prop="isCompany" label="类型:">
  <el-radio-group v-model="temp.isCompany">
    <el-radio v-for="(type,index) in deptTypeList" :label="index" :key="index">
      {{ type }}
    </el-radio>
  </el-radio-group>
</el-form-item>
<el-form-item prop="name"  label="名称:" >
  <el-input v-model="temp.name" placeholder="请输入部门或公司名称"></el-input>
</el-form-item>
<el-form-item prop="parentId"  label="上级部门:">
  <treeselect
    v-model="temp.parentId"
    :options="treeSelectData"
    placeholder="选择部门"
    @select="selectFun"
  />
</el-form-item>
<el-form-item prop="orderNum" label="顺序编号:">
  <el-input-number v-model="temp.orderNum" controls-position="right" :min="0" label="排序编号"></el-input-number>
</el-form-item>
<el-form-item v-if="temp.isCompany" prop="address" label="公司地址:">
  <el-input v-model="temp.address" placeholder="请输入公司地址"></el-input>
</el-form-item>
<el-form-item v-if="temp.isCompany" prop="telephone" label="联系电话:">
  <el-input v-model="temp.telephone" placeholder="请输入联系电话"></el-input>
</el-form-item>
<el-form-item v-if="temp.isCompany" prop="address" label="公司网址:">
  <el-input v-model="temp.website" placeholder="请输入公司地址"></el-input>
</el-form-item>
<el-form-item v-if="temp.isCompany" prop="remarks" label="备注">
  <el-input v-model="temp.remarks" type="textarea"></el-input>
</el-form-item>-->

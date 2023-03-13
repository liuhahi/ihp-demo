<template>
  <div class="container">
    <el-text type="h4">Scan Report</el-text>
    <el-table :data="metaData" style="width: 100%;height: auto;border: 1px solid #dedede; border-radius:2px" :show-header="false" border>
      <el-table-column prop="key" label="" width="200px"/>              
      <el-table-column prop="value" label="" width="auto" >        
      </el-table-column>
    </el-table>   
    <el-text type="h5" class="mt-15">List of APIs</el-text>
    <el-table :data="apiData" style="width: 100%" stripe>
      <el-table-column type="index" width="50" />
      <el-table-column prop="name" label="API" width="auto" />
    </el-table>
    <el-text type="h5" class="mt-15">Light house analysis</el-text>    
    <el-table :data="runWarnings" style="width: 100%;height: auto" stripe>
      <el-table-column type="index" width="50" />
      <el-table-column prop="name" label="Run Warnings" width="auto" >
        <template #default="scope">          
          <div><i class="fa-solid fa-triangle-exclamation " style="margin-right: 5px"></i> {{scope.row.name}}</div>
        </template>
      </el-table-column>
    </el-table>    
    <el-text type="h6" class="mt-15">Audits</el-text>       
    <el-table :data="auditData" style="width: 100%" stripe>
      <el-table-column type="index" width="50" />
      <el-table-column prop="key" label="Audit items" width="140px" >
        <template #default="scope">          
          <div><b>{{scope.row.name}}</b></div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
      <el-table-column prop="score" label="Score" width="80">
        <template #default="scope">   
          {{ scope.row.score ? scope.row.score : 'N/A' }}
        </template>
      </el-table-column>
      <el-table-column label="Detail" align="center" header-align="center">
        <template #default="scope">     
          <div v-if="scope.row.items?.length == 0">
            N/A
          </div>
          <div v-else>
            <el-row>
              <el-card v-for="item in scope.row.items" :key="item" shadow="never" style="margin:5px;width: 500px">
                <ul>
                  <li v-for="[key, val] in Object.entries(item)" :key="obj" style="text-align: left;">
                    {{key}}: {{ val }}
                  </li>
                </ul>
              </el-card>
            </el-row>
          </div>
        </template>    
      </el-table-column>
    </el-table>  
    <el-text type="h5" class="mt-15">Set Cookie Test</el-text>        
    <div class="mt-15">      
      <el-text type="body1">The Set-Cookie HTTP response header is used to send a cookie from the server to the user agent, so that the user agent can send it back to the server later. To send multiple cookies, multiple Set-Cookie headers should be sent in the same response.</el-text>
      <el-card shadow="never" class="mt-15">Test result: {{ set_cookie}} <i style="margin-right: 5px;color:green;font-size: 22px" class="fa fa-check" v-if="set_cookie == 'Set-Cookie is secure'"></i></el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { apis} from './apis.json'
import lighthouse from './lighthouse.json'
import { set_cookie } from './set_cookie.json'
console.log('apis', apis)
const uniqueApis = new Set(apis);
const apiData = Array.from(uniqueApis).map(api => {
  return {
    name: api
  }
})

const runWarnings = lighthouse.runWarnings.map(warning => {
  return {
    name: warning
  }
});

const auditData = ref([])
Object.entries(lighthouse.audits).forEach(([key, value]) => {
  console.log('details?', value.details)
  auditData.value.push({
    name: key,
    description: value.description,
    score: value.score,
    items: value.details?.items,
    item: value
  })
})

const metaData = [
  {
    'key': 'Request URL',
    'value': lighthouse.requestedUrl,
  },
  {
    'key': 'Gather Mode',
    'value': lighthouse.gatherMode,
  },
  {
    'key': 'User Agent',
    'value': lighthouse.userAgent,
  },  
]

</script>
<style scoped>
.mt-15 {
  margin-top: 15px;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 1200px;
}
.el-text {
  color: black;
}
.fa-triangle-exclamation {
  font-size: 16px;
  color: orange
}
</style>
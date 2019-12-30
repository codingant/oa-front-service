import { axios } from '@/utils/request';
import axios_ from 'axios';
import superagent from 'superagent';
import _ from 'underscore';
import { setStore, getStore } from '@/utils/storage';
import { formatDate, queryDateDiff, deNull, queryUrlString } from '@/utils/util';
import $ from 'jquery';

axios_.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const api = {
    domain: window._CONFIG['domian'],
    user: `${window._CONFIG['domian']}/jeecg-boot/api/user`,
    role: `${window._CONFIG['domian']}/jeecg-boot/api/role`,
    service: `${window._CONFIG['domian']}/jeecg-boot/api/service`,
    permission: `${window._CONFIG['domian']}/jeecg-boot/api/permission`,
    permissionNoPager: `${window._CONFIG['domian']}/jeecg-boot/api/permission/no-pager`,
    PROCESS_NODE_DICT_ID: '095a5c3fed5b29706cdfc6d9cb32cd4c', //流程节点，对应的字典的ID,根据这个查询流程节点的名称
};

//post
export async function postAction(url, parameter) {
    try {
        return axios({
            url: url,
            method: 'post',
            data: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

//post method= {post | put}
export async function httpAction(url, parameter, method) {
    try {
        return axios({
            url: url,
            method: method,
            data: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

//put
export async function putAction(url, parameter) {
    try {
        return axios({
            url: url,
            method: 'put',
            data: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

//get
export async function getAction(url, parameter) {
    try {    
        return axios({
            url: url,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

//deleteAction
export async function deleteAction(url, parameter) {
    try {
        return axios({
            url: url,
            method: 'delete',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getUserList(parameter) {
    try {
        return axios({
            url: api.user,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getRoleList(parameter) {
    try {
        return axios({
            url: api.role,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getServiceList(parameter) {
    try {
        return axios({
            url: api.service,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getPermissions(parameter) {
    try {
        return axios({
            url: api.permissionNoPager,
            method: 'get',
            params: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function saveService(parameter) {
    try {
        return axios({
            url: api.service,
            method: parameter.id == 0 ? 'post' : 'put',
            data: parameter,
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export async function downFile(url, parameter) {
    //检查此处的URL,改成Nginx服务器对应的下载地址
    console.log(' download url :' + url);

    try {
        return axios({
            url: url,
            params: parameter,
            method: 'get',
            responseType: 'blob',
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * 查询URL地址TableID变量
 */
export function queryURLTableParam() {
    var url = null;
    try {
        url = document.location.toString();
        url = url.substring(url.lastIndexOf('/') + 1, url.length);
        console.log('tableID : ' + url);
        return url;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 查询当前业务对应表单名称
 * @param {*} url
 */
export async function queryTableName(callback) {
    //获取主键ID
    var tableID = queryURLTableParam();
    //查询URL
    var queryURL = `${api.domain}/api/onl_cgform_head/${tableID}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res.body);

        if (
            typeof res != 'undefined' &&
            res.body instanceof Array &&
            res.body.length > 0 &&
            typeof callback != 'undefined'
        ) {
            callback(res.body[0]);
        }

        return res.body[0];
    } catch (err) {
        console.error(err);
    }
}

/**
 * 检测审批是否存在 存在 false  不存在 true
 * @param {*} tableName
 * @param {*} businessID
 */
export async function queryApprovalExist(tableName, businessID) {
    //查询URL GET	/api/tableName/:id/exists	True or false whether a row exists or not  /api/tableName/findOne
    var queryURL = `${api.domain}/api/PR_LOG?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${businessID})`;

    //查询标识
    var vflag = false;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');

        vflag = res.body.length > 0 ? true : false;

        return vflag;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 添加数据
 * @param {*} tableName
 * @param {*} id
 */
export async function insertTableData(tableName, node) {
    //Post数据的URL地址
    var insertURL = `${api.domain}/api/${tableName}`;

    //如果传入数据为数组，则URL添加bulk路径
    if (typeof node != 'undefined' && node != null && node instanceof Array) {
        insertURL = insertURL + '/bulk';
    }

    try {
        const res = await superagent
            .post(insertURL)
            .send(node)
            .set('accept', 'json');
        return res.body[0];
    } catch (err) {
        console.error(err);
    }
}

export async function postTableData(tableName, node) {
    //Post数据的URL地址
    var insertURL = `${api.domain}/api/${tableName}`;

    //如果传入数据为数组，则URL添加bulk路径
    if (typeof node != 'undefined' && node != null && node instanceof Array) {
        insertURL = insertURL + '/bulk';
    }

    try {
        const res = await superagent
            .post(insertURL)
            .send(node)
            .set('accept', 'json');
        return res.body[0];
    } catch (err) {
        console.error(err);
    }
}

/**
 * 添加数据
 * @param {*} tableName
 * @param {*} id
 */
export async function deleteTableData(tableName, id) {
    //Post数据的URL地址
    var deleteURL = `${api.domain}/api/${tableName}/${id}`;

    try {
        const res = await superagent.delete(deleteURL).set('accept', 'json');
        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 更新数据
 * @param {*} tableName
 * @param {*} id
 * @param {*} node
 */
export async function patchTableData(tableName, id, node) {
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var patchURL = `${api.domain}/api/${tableName}/${id}`;

    //如果传入数据为空，则直接返回错误
    if (typeof node == 'undefined' || node == null || node == '') {
        return false;
    }

    try {
        const res = await superagent
            .patch(patchURL)
            .send(node)
            .set('accept', 'json');

        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询数据
 * @param {*} tableName
 * @param {*} id
 */
export async function queryTableData(tableName, id) {
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var queryURL = `${api.domain}/api/${tableName}/${id}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        return res.body[0];
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询数据
 * @param {*} tableName
 * @param {*} foreignKey
 * @param {*} id
 */
export async function queryTableDataByField(tableName, field, value) {
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var queryURL = `${api.domain}/api/${tableName}?_where=(${field},eq,${value})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询数据
 * @param {*} tableName
 * @param {*} foreignKey
 * @param {*} id
 */
export async function queryTableDataAll(tableName) {
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var queryURL = `${api.domain}/api/${tableName}`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询表单字段数据
 * @param {*} tableName
 * @param {*} foreignKey
 * @param {*} id
 */
export async function queryTableFieldInfo(tableName, field, value) {
    //更新URL PATCH	/api/tableName/:id	Updates row element by primary key
    var queryURL = `${api.domain}/api/${tableName}?_where=(name,eq,${field})~and(field,eq,${value})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        return res.body[0];
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询流程权责业务信息
 */
export async function queryBusinessInfo(tableName, callback) {
    //查询URL
    var queryURL = `${api.domain}/api/PR_RIGHTS?_where=(business,like,~${tableName}~)`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res.body);

        if (
            typeof res != 'undefined' &&
            res.body instanceof Array &&
            res.body.length > 0 &&
            typeof callback != 'undefined'
        ) {
            callback(res.body);
        }

        return JSON.parse(JSON.stringify(res.body));
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的员工信息
 */
export async function queryProcessNodeEmployee(node, callback) {
    //查询URL
    var queryURL = `${api.domain}/api/BS_APPROVE_NODE?_where=(name,eq,${node})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res.body);

        if (
            typeof res != 'undefined' &&
            res.body instanceof Array &&
            res.body.length > 0 &&
            typeof callback != 'undefined'
        ) {
            callback(res.body[0]['item_text']);
        }

        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function queryProcessNodeProcName(node, callback) {
    //查询URL
    var queryURL = `${api.domain}/api/sys_dict_item?_where=(dict_id,eq,${api.PROCESS_NODE_DICT_ID})~and(item_value,eq,${node})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        if (
            typeof res != 'undefined' &&
            res.body instanceof Array &&
            res.body.length > 0 &&
            typeof callback != 'undefined'
        ) {
            callback(res.body[0]['item_text']);
        }

        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询审批处理页面的记录
 */
export async function queryUserList(params) {
    //用户名称
    var whereFlag =
        deNull(params.name) == '' ?
        '' :
        `_where=(username,like,~${params.name}~)~or(realname,like,~${params.name}~)&`;
    //获取排序标识，升序 ‘’ ， 降序 ‘-’
    var ascFlag = params.order == 'asc' ? '' : '-';

    //查询URL
    var queryURL = `${api.domain}/api/v_user?${whereFlag}_p=${params.pageNo}&_size=${params.pageSize}&_sort=${ascFlag}${params.column}`;
    var queryCountURL = `${api.domain}/api/v_user/count?${whereFlag}`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        const count = await superagent.get(queryCountURL).set('accept', 'json');
        console.log(res);
        result.records = res.body;
        result.total =
            count.body[0].no_of_rows <= params.pageSize ?
            res.body.length :
            count.body[0].no_of_rows;

        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询审批处理页面的记录
 */
export async function queryProcessLogToApproved(username, realname, params) {

    //查询URL
    var queryURL = `${api.domain}/api/PR_LOG?_where=(employee,like,~${username}~)~or(employee,like,~${realname}~)&_p=${params.pageNo}&_size=${params.pageSize}`;
    var queryCountURL = `${api.domain}/api/PR_LOG/count?_where=(employee,like,~${username}~)~or(employee,like,~${realname}~)`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        const count = await superagent.get(queryCountURL).set('accept', 'json');
        console.log(res);
        result.records = res.body;
        result.total =
            count.body[0].no_of_rows <= 30 ?
            res.body.length :
            count.body[0].no_of_rows;

        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询审批历史记录页面的记录
 */
export async function queryProcessLogHisApproved(username, realname, params) {

    //查询URL
    var queryURL = `${api.domain}/api/PR_LOG_HISTORY?_where=(approve_user,like,~${username}~)~or(approve_user,like,~${realname}~)~or(proponents,like,~${username}~)~or(proponents,like,~${realname}~)&_p=${params.pageNo}&_size=${params.pageSize}&_sort=-operate_time`;
    var queryCountURL = `${api.domain}/api/PR_LOG_HISTORY/count?_where=(approve_user,like,~${username}~)~or(approve_user,like,~${realname}~)~or(proponents,like,~${username}~)~or(proponents,like,~${realname}~)`;
    var result = {};
    
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        const count = await superagent.get(queryCountURL).set('accept', 'json');
        console.log(res);
        result.records = res.body;

        //遍历并格式化日期
        _.each(result.records, function(item) {
            var optime = formatDate(item['operate_time'], 'yyyy-MM-dd HH:mm:ss');
            optime = optime.replace('T', ' ');
            item['operate_time'] = optime;
        });

        result.total =
            count.body[0].no_of_rows <= 30 ?
            res.body.length :
            count.body[0].no_of_rows;
        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询我的待办数据
 */
export async function queryProcessLogWait(username, realname) {
    //查询URL
    var queryURL = `${api.domain}/api/v_handling_events?_where=(username,like,~${username}~)~or(username,like,~${realname}~)&_p=1&_size=10&_sort=-create_time`;
    var result = {};
    
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;

        //遍历并格式化日期
        _.each(result, function(item) {
            var optime = formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = formatDate(item['create_time'], 'yyyy-MM-dd');
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['username'] = deNull(item['username']).split(',');
        });

        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询我的已办数据
 */
export async function queryProcessLogDone(username, realname) {
    //查询URL
    var queryURL = `${api.domain}/api/v_handled_events?_where=(username,like,~${username}~)~or(username,like,~${realname}~)&_p=1&_size=10&_sort=-create_time`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        result = res.body;

        //遍历并格式化日期
        _.each(result, function(item) {
            var optime = formatDate(item['operate_time'], 'yyyy-MM-dd');
            var ctime = formatDate(item['create_time'], 'yyyy-MM-dd');
            item['operate_time'] = optime;
            item['create_time'] = ctime;
            item['username'] = deNull(item['username']).split(',');
        });

        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 查询审批知会记录页面的记录
 */
export async function queryProcessLogInfApproved(username, realname, params) {
    //查询URL
    var queryURL = `${api.domain}/api/PR_LOG_INFORMED?_where=((employee,like,~${username}~)~or(employee,like,~${realname}~))&_p=${params.pageNo}&_size=${params.pageSize}&_sort=-operate_time`;
    var queryCountURL = `${api.domain}/api/PR_LOG_INFORMED/count?_where=((employee,like,~${username}~)~or(employee,like,~${realname}~))`;
    var result = {};
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        const count = await superagent.get(queryCountURL).set('accept', 'json');

        console.log('query url : ' + queryURL);

        console.log(res);
        result.records = res.body;
        result.total =
            count.body[0].no_of_rows <= 30 ?
            res.body.length :
            count.body[0].no_of_rows;
        return result;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function queryProcessLogInfByID(tableName, id) {
    //提交URL
    var queryURL = `${api.domain}/api/PR_LOG_INFORMED?_where=(table_name,eq,${tableName})~and(id,eq,${id})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body[0];
    } catch (err) {
        console.error(err);
    }
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryProcessLogInformed(tableName,business_data_id) {
    //提交URL
    var queryURL = `${api.domain}/api/PR_LOG_INFORMED?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${business_data_id})&_sort=operate_time`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function queryProcessLog(tableName, businessID) {
    //提交URL
    var queryURL = `${api.domain}/api/PR_LOG?_where=(table_name,eq,${tableName})~and(business_data_id,eq,${businessID})&_sort=operate_time`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function queryProcessLogByID(tableName, id) {
    //提交URL
    var queryURL = `${api.domain}/api/PR_LOG?_where=(table_name,eq,${tableName})~and(id,eq,${id})`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body[0];
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function deleteProcessLog(tableName, node) {
    //提交URL
    var deleteURL = '';
    //遍历node,取出里面的ids
    var ids = '';

    //如果node不是数组，则转化为数组
    if(!(node instanceof Array)){
        node  = [node];
    }

    try {
        _.each(node, function(item) {
            ids = ids + ',' + item['id'];
        });

        //去掉开头的逗号
        ids = ids.indexOf(',') == 0 ? ids.substring(1) : ids;
    } catch (error) {
        console.error(error);
    }

    try {
        deleteURL = `${api.domain}/api/PR_LOG/bulk?_ids=${ids}`;
    } catch (error) {
        console.error(error);
    }

    try {
        const res = await superagent.delete(deleteURL).set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，删除到这个节点对应的流程信息
 */
export async function deleteProcessLogInf(tableName, node) {
    //遍历node,取出里面的ids
    var ids = '';
    //提交URL
    var deleteURL = '';

    //如果node不是数组，则转化为数组
    if(!(node instanceof Array)){
        node  = [node];
    }

    try {
        _.each(node, function(item) {
            ids = ids + ',' + item['id'];
        });

        //去掉开头的逗号
        ids = ids.indexOf(',') == 0 ? ids.substring(1) : ids;
    } catch (error) {
        console.error(err);
    }

    try {
        deleteURL = `${api.domain}/api/PR_LOG_INFORMED/bulk?_ids=${ids}`;
    } catch (error) {
        console.error(err);
    }

    try {
        const res = await superagent.delete(deleteURL).set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function postProcessLog(node) {
    //提交URL
    var postURL = `${api.domain}/api/PR_LOG`;

    try {
        const res = await superagent
            .post(postURL)
            .send(node)
            .set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function postProcessFreeNode(node) {
    //提交URL
    var postURL = `${api.domain}/api/BS_FREE_PROCESS`;

    try {
        const res = await superagent
            .post(postURL)
            .send(node)
            .set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 根据数据字典中的节点编号，查询到这个节点对应的流程岗位名称
 */
export async function postProcessLogHistory(node) {
    //提交URL
    var postURL = null;
    //是否批处理
    var bflag = node instanceof Array && node.length > 1 ? '/bulk' : '';

    //如果只有一条数据,则URL中不需要/bulk路径
    try {
        if (node instanceof Array && node.length == 1) {
            bflag = '';
            node = node[0];
        }
    } catch (error) {
        console.log(error);
    }

    //构建流程历史表提交数据的URL
    try {
        postURL = `${api.domain}/api/PR_LOG_HISTORY${bflag}`;
    } catch (error) {
        console.log(error);
    }

    //发送post请求，保存数据
    try {
        const res = await superagent
            .post(postURL)
            .send(node)
            .set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 想知会记录列表提交数据
 */
export async function postProcessLogInformed(node) {
    //提交URL
    var postURL = null;
    //是否批处理
    var bflag = node instanceof Array && node.length > 1 ? '/bulk' : '';

    //如果只有一条数据,则URL中不需要/bulk路径
    try {
        if (node instanceof Array && node.length == 1) {
            bflag = '';
            node = node[0];
        }
    } catch (error) {
        console.error(err);
    }

    //构建知会表提交数据的URL
    try {
        postURL = `${api.domain}/api/PR_LOG_INFORMED${bflag}`;
    } catch (error) {
        console.error(err);
    }

    //发送post请求，保存数据
    try {
        const res = await superagent
            .post(postURL)
            .send(node)
            .set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryPRLogHistoryByDataID(business_data_id) {
    //提交URL
    var queryURL = `${api.domain}/api/PR_LOG_HISTORY?_where=(business_data_id,eq,${business_data_id})&_sort=operate_time&_p=1&_size=99`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryPRLogByDataID(business_data_id) {
    //提交URL
    var queryURL = `${api.domain}/api/PR_LOG?_where=(business_data_id,eq,${business_data_id})&_sort=operate_time`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryPRLogInfByDataID(business_data_id) {
    //提交URL
    var queryURL = `${api.domain}/api/PR_LOG_INFORMED?_where=(business_data_id,eq,${business_data_id})&_sort=operate_time`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body;
    } catch (err) {
        console.error(err);
    }
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryPRLogInfTotal(business_data_id) {
    //获取今天日期
    var ctime = formatDate(new Date(), 'yyyy-MM-dd');

    //提交URL
    var queryURL = `${api.domain}/api/PR_LOG_INFORMED/count?_where=(business_data_id,eq,${business_data_id})`;
    var queryTodayURL = `${api.domain}/api/PR_LOG_INFORMED/count?_where=(business_data_id,eq,${business_data_id})~and(operate_time,like,~${ctime}~)`;
    var result = {};
    var count = 0;
    var today = 0;

    try {
        //统计知会总数
        try {
            count = await superagent.get(queryURL).set('accept', 'json');
        } catch (error) {
            console.log('query total loginfo error :' + error);
        }
        //统计当天知会次数
        try {
            today = await superagent.get(queryTodayURL).set('accept', 'json');
        } catch (error) {
            console.log('query today loginfo error :' + error);
        }
        result.total = count.body[0].no_of_rows;
        result.today = today.body[0].no_of_rows;
        console.log(result);
        return result;
    } catch (err) {
        console.error('获取某业务记录对应的审批日志信息' , err);
    }
}

/**
 * @function 获取登录用户
 */
export async function queryLoginUser() {

    var queryURL = `${api.domain}/jeecg-boot/api/login/user`;

    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);

        return res.body;
    } catch (err) {
        console.error('获取登录用户' , err);
    }
}

/**
 * 获取n位随机数,随机来源chars
 */
export function queryRandomStr(n) {

    var temp = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
    var res = '';

    try {
        var chars = temp.split(',');
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
    } catch (error) {
        console.log('获取n位随机数异常：' + error);
    }

    //返回随机数
    return res;
}

/**
 * 通过函数暴露API
 */
export function commonArgs() {
    return api;
}

/**
 * @function 查询请假类型
 */
export function queryLeaveType(leave) {
    var config = {
        affairs_leave: '事假',
        sick_leave: '病假',
        marital_leave: '婚假',
        funeral_leave: '丧假',
        maternity_leave: '产假',
        paternity_leave: '陪产假',
        annual_leave: '年假',
        wr_injury_leave: '工伤假',
        other_leave: '其他',
    };
    return config[leave];
}

/**
 * @function 查询流程状态
 */
export function queryBpmStatus(status) {
    var config = {
        '1': '待提交',
        '2': '审核中',
        '3': '审批中',
        '4': '已完成',
        '5': '已完成',
        '6': '已作废',
    };

    return config[status];
}

/**
 * @function 根据表名查询表单名称
 */
export function queryFormName(tableName) {
    var config = {
        BS_LEAVE: '请假流程申请单',
        BS_EGRESS: '外出流程申请单',
        BS_OVERTIME: '加班流程申请单',
        BS_ATTENDANCE: '考勤异常流程申请单',
        BS_RECORD_BORROW: '档案及证照借阅申请单',
        BS_SEAL_NORMAL: '用印申请流程申请单',
        BS_SEAL_CONTRACT: '用印申请流程申请单',
        BS_SEAL_DECLARE: '印章借用申请单',
        BS_TRAVEL: '出差申请单',
    };

    return config[tableName];
}

/**
 * @function 根据表名查询表单名称
 */
export function queryFormTypeName(tableName) {

    var config = {
        BS_LEAVE: '请假',
        BS_EGRESS: '外出',
        BS_OVERTIME: '加班',
        BS_ATTENDANCE: '考勤',
        BS_RECORD_BORROW: '借阅',
        BS_SEAL_NORMAL: '用印',
        BS_SEAL_CONTRACT: '用印',
        BS_SEAL_DECLARE: '印章',
        BS_TRAVEL: '出差',
    };

    return config[tableName];
}

/**
 * @function 根据表名查询表单名称
 */
export function queryFormTypeValue(tableName) {

    var config = {
        BS_LEAVE: '--',
        BS_EGRESS: '普通',
        BS_OVERTIME: '普通',
        BS_ATTENDANCE: '普通',
        BS_RECORD_BORROW: '普通',
        BS_SEAL_NORMAL: '非合同',
        BS_SEAL_CONTRACT: '合同',
        BS_SEAL_DECLARE: '印章',
        BS_TRAVEL: '出差',
    };

    return config[tableName];
}

/**
 * @function 根据表名查询表单名称
 */
export function queryFormMainTable(tableName) {

    var config = {
        BS_LEAVE: false,
        BS_EGRESS: false,
        BS_OVERTIME: false,
        BS_ATTENDANCE: true,
        BS_RECORD_BORROW: false,
        BS_SEAL_NORMAL: false,
        BS_SEAL_CONTRACT: false,
        BS_SEAL_DECLARE: false,
        BS_TRAVEL: false,
    };

    return config[tableName];
}

/**
 * @function 开始日期表单显示名称
 */
export function queryFormMTStarttimeName(tableName) {

    var config = {
        BS_LEAVE: '开始',
        BS_EGRESS: '开始',
        BS_OVERTIME: '开始',
        BS_ATTENDANCE: '开始',
        BS_RECORD_BORROW: '借阅',
        BS_SEAL_NORMAL: '开始',
        BS_SEAL_CONTRACT: '开始',
        BS_SEAL_DECLARE: '开始',
        BS_TRAVEL: '开始',
    };

    return config[tableName];
}

/**
 * @function 结束日期表单显示名称
 */
export function queryFormMTEndtimeName(tableName) {

    var config = {
        BS_LEAVE: '结束',
        BS_EGRESS: '结束',
        BS_OVERTIME: '结束',
        BS_ATTENDANCE: '结束',
        BS_RECORD_BORROW: '归还',
        BS_SEAL_NORMAL: '结束',
        BS_SEAL_CONTRACT: '结束',
        BS_SEAL_DECLARE: '结束',
        BS_TRAVEL: '结束',
    };

    return config[tableName];
}

/**
 * @function 结束日期表单显示名称
 */
export function queryFormMTFileName(tableName) {

    var config = {
        BS_LEAVE: '文件名称',
        BS_EGRESS: '文件名称',
        BS_OVERTIME: '文件名称',
        BS_ATTENDANCE: '文件名称',
        BS_RECORD_BORROW: '档案资料',
        BS_SEAL_NORMAL: '文件名称',
        BS_SEAL_CONTRACT: '文件名称',
        BS_SEAL_DECLARE: '文件名称',
        BS_TRAVEL: '文件名称',
    };

    return config[tableName];
}

/**
 * @function 查询附表字段
 */
export function queryFormMTSubColumns(tableName) {
    var config = {
        BS_LEAVE: [],
        BS_EGRESS: [],
        BS_OVERTIME: [],
        BS_ATTENDANCE: [{
                title: '序号',
                dataIndex: 'no',
                width: '10%',
                align: 'center',
            },
            {
                title: '异常时间',
                dataIndex: 'adate',
                width: '35%',
                align: 'center',
            },
            {
                title: '异常类型',
                dataIndex: 'type',
                width: '20%',
                align: 'center',
            },
            {
                title: '异常说明',
                dataIndex: 'content',
                width: '35%',
                align: 'left',
            },
        ],
        BS_RECORD_BORROW: [],
        BS_SEAL_NORMAL: [],
        BS_SEAL_CONTRACT: [],
        BS_SEAL_DECLARE: [],
        BS_TRAVEL: [],
    };

    return config[tableName];
}

/**
 * @function 查询附表数据
 */
export async function queryFormMTSubData(tableName, foreignKey, id) {
    var config = {
        BS_LEAVE: [],
        BS_EGRESS: [],
        BS_OVERTIME: [],
        BS_ATTENDANCE: [],
        BS_RECORD_BORROW: [],
        BS_SEAL_NORMAL: [],
        BS_SEAL_CONTRACT: [],
        BS_SEAL_DECLARE: [],
        BS_TRAVEL: [],
    };
    //查询考勤异常表的子表信息
    if (tableName == 'BS_ATTENDANCE') {
        try {
            var data = await queryTableDataByField(
                tableName + '_DETAILS',
                foreignKey,
                id
            );
            config['BS_ATTENDANCE'] = data;
        } catch (error) {
            console.log('查询考勤异常表的子表信息异常：' + error);
        }
    }
    //返回考勤异常表的子表信息
    return config[tableName];
}

/**
 * @function 查询审批流程信息
 */
export async function queryWorkflows(business_data_id) {

    //待返回审批流程数据
    var workflows = null;

    //从浏览器缓存中获取审批日志数据
    try {
        workflows = getStore(`workflows_by_data_id@${business_data_id}`);
    } catch (error) {
        console.log('query store info of workflows error :' + error );
    }

    //没有从缓存中获取到审批日志信息，则从数据中获取数据
    if (
        workflows == null ||
        workflows == '' ||
        typeof workflows == 'undefined' ||
        workflows.length == 0
    ) {
        //流程数据设置为数组
        workflows = [];

        //获取审批日志信息
        var processLogs = {}
        
        try {
            
            //查询审批日志信息
            processLogs = await queryPRLogHistoryByDataID(business_data_id);

            //遍历审批日志
            _.each(processLogs, (item, index) => {
                //获取下一节点
                var next =
                    index < processLogs.length - 1 ? processLogs[index + 1] : { action: '' };
                //获取标识
                var flag = index == processLogs.length - 1;
                //获取操作时间
                var optime = formatDate(item.operate_time, 'yyyy-MM-dd hh:mm:ss');

                var content = `节点：${deNull(item.process_station)} , 处理人： ${deNull(
            item.approve_user
        )} , 审批：${deNull(item.action)} , 审批意见：${deNull(
            item.action_opinion
        )}  时间：${deNull(optime)} `;

                var color =
                    item.action == '同意' ?
                    'green' :
                    item.action == '驳回' || item.action == '撤销' ?
                    'red' :
                    item.action == '知会' ?
                    'yellow' :
                    item.action == '发起' ?
                    '#00DD77' :
                    'blue';

                //默认认为最靠近知会的节点为审批节点，颜色标识为蓝色
                color = item.action == '同意' && next.action == '知会' ? 'blue' : color;
                color = flag && item.action == '同意' ? 'blue' : color;
                color = flag && item.action == '知会' ? 'orange' : color;

                var status =
                    (item.action == '同意' && next.action == '知会') ||
                    (flag && item.action == '同意') ?
                    'over' :
                    item.action == '发起' ?
                    'start' :
                    item.action == '同意' ?
                    'agree' :
                    item.action == '驳回' || item.action == '撤销' ?
                    'cancel' :
                    item.action == '知会' ?
                    'message' :
                    'over';

                var node = {
                    id: item.id,
                    color: color,
                    content: content,
                    status: status,
                };

                workflows.push(node);
            });

        } catch (error) {
            console.log('获取已处理的审批日志信息异常 :' + error);
        }

        try {
            //获取正在审批的审批日志信息
            processLogs = await queryPRLogByDataID(business_data_id);
            //遍历数据
            _.each(processLogs, (item, index) => {
                var node = {
                    id: item.id,
                    color: 'pink',
                    content: `节点：${deNull(item.process_station)} , 待处理人： ${deNull(
            item.employee
            )} , 审批：待处理 , 时间：-- `,
                    status: 'wait',
                };
                workflows.push(node);
            });
        } catch (error) {
            console.log('获取正在审批的审批日志信息失败 :' + error);
        }

        try {
            //获取正在审批的知会日志信息
            processLogs = await queryPRLogInfByDataID(business_data_id);

            _.each(processLogs, (item, index) => {
                //获取操作时间
                var optime = formatDate(item.operate_time, 'yyyy-MM-dd hh:mm:ss');
                var appruser = deNull(item.approve_user);
                var node = {
                    id: item.id,
                    color: 'orange',
                    content: `节点：${deNull(item.process_station)} , 待处理人： ${deNull(
            item.employee
            )} ,  已处理人： ${deNull(appruser)} , 审批：知会 , 时间：${deNull(
            optime
            )} `,
                    status: 'sound',
                };
                workflows.push(node);
            });
            
        } catch (error) {
            console.log('获取正在审批的知会日志信息异常：' + error);
        }

        try {
            setStore(
                `workflows_by_data_id@${business_data_id}`,
                JSON.stringify(workflows),
                10
            );
        } catch (error) {
            console.log('save workflows data error :' + error);
        }

    }

    //返回工作流程数据
    return workflows;
}

/**
 * 获取某业务记录对应的审批日志信息
 */
export async function queryDepartNameByCode(code) {
    //提交URL
    var queryURL = `${api.domain}/api/sys_depart?_where=(org_code,eq,${code})`;
    //根据部门编号，查询部门信息
    try {
        const res = await superagent.get(queryURL).set('accept', 'json');
        console.log(res);
        return res.body[0];
    } catch (err) {
        console.error(err);
    }
}

/**
 * @function 查询表单详情页面
 */
export async function watchFormLeave(that) {
    //显示提示信息
    var path = window.location.href.split(window.location.host)[1];
    //获取部门信息
    var department = '';
    //获取对应表单信息
    var tableName = queryUrlString('table_name');
    //查询主键ID
    var id = queryUrlString('id');
    //获取用户名称
    var username = queryUrlString('user');

    //如果不是表单详情页面，则直接返回
    if(!(path.includes('/workflow/view') || path.includes('/basewflow/view'))){
        return false;
    }

    try {
        //查询表单信息
        that.formName = queryFormName(tableName);
        //查询用户名称信息
        that.username = username;
    } catch (error) {
        console.log('query base info error :' + error)
    }

    try {
        //查询对应表单数据
        that.curRow = await queryTableData(tableName, id);
    } catch (error) {
        console.log('query cur row info error :' + error);
    }

    //此表单数据已经被删除，无法查看
    if (typeof that.curRow == 'undefined' || that.curRow == null) {
        try {
            //提示信息
            var message = '此表单数据已经被删除，无法查看此数据！';
            //当前审批流程相关信息转历史记录
            var result = await transWflowToHistory(tableName , id);

            //显示并确认提示信息
            that
                .$confirm(message, '提示', {
                    type: 'error',
                })
                .then(() => {
                    //关闭当前Tab页面
                    that.$root.$tabs.closeTab(path);
                })
                .catch(() => {
                    //关闭当前Tab页面
                    that.$root.$tabs.closeTab(path);
                });
            console.log('此表单数据已经被删除，无法查看此数据，result :' + result);
        } catch (error) {
            console.log('message confirm error :' + error);
        }
        return false;
    }

    try {
        department = await queryTableData(
            'sys_depart',
            that.curRow.department || that.curRow.sys_org_code
        );
    } catch (error) {
        console.log('query department error :' + error);
    }

    //如果没查询到部门信息，则通过org_code字段查询部门信息
    try {
        department =
            department || (await queryDepartNameByCode(that.curRow.sys_org_code));
    } catch (error) {
        console.log('query department error :' + error);
    }

    try {
        //查询审批流程信息
        that.workflows = await queryWorkflows(that.curRow.id);
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        that.curRow.leave_type_name =
            queryLeaveType(that.curRow.leave_off_type) || queryFormTypeValue(tableName);
        //查询当前流程状态
        that.curRow.bpm_status_name = queryBpmStatus(that.curRow.bpm_status);
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询申请开始日期
        that.curRow.starttime = formatDate(
            that.curRow.starttime,
            'yyyy-MM-dd HH:mm:ss'
        );

        //如果未查询到开始日期，则使用申请日期
        if (that.curRow.starttime == '--') {
            that.curRow.starttime = formatDate(
                that.curRow.create_time,
                'yyyy-MM-dd HH:mm:ss'
            );
        }
    } catch (error) {
        console.log('watch form leave error :' + error);  
    }

    try {
        //查询申请结束日期
        that.curRow.endtime = formatDate(that.curRow.endtime, 'yyyy-MM-dd HH:mm:ss');
        //查询申请创建日期
        that.curRow.create_time = formatDate(
            that.curRow.create_time,
            'yyyy-MM-dd HH:mm:ss'
        );
    } catch (error) {
        console.log('watch form leave error :' + error);  
    }

    try {
        //查询表单类型名称
        that.curRow.formTypeName = queryFormTypeName(tableName);
        //查询日期之间的天数
        that.curRow.total_days = queryDateDiff(
            that.curRow.starttime,
            that.curRow.endtime
        );
    } catch (error) {
        console.log('watch form leave error :' + error);   
    }

    try {
        //查询此表单是否为主表单
        that.curRow.main_table_status = queryFormMainTable(tableName);
        //查询此表单的附表字段
        that.curRow.sub_columns = queryFormMTSubColumns(tableName);
    } catch (error) {
        console.log('watch form leave error :' + error);   
    }

    try {
        //查询此表单的附表数据
        that.curRow.sub_data = await queryFormMTSubData(
            tableName,
            'foreign_key_id',
            id
        );
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询结束时间表单显示名称
        that.curRow.startTimeName = queryFormMTStarttimeName(tableName) || '开始';
        //查询结束时间表单显示名称
        that.curRow.endTimeName = queryFormMTEndtimeName(tableName) || '结束';
        //查询文件名称显示标题
        that.curRow.fileNameTitle = queryFormMTFileName(tableName) || '文件名称';
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询字段中文名称
        that.curRow.fieldName = {};
    } catch (error) {
        console.log('watch form leave error :' + error);
    }

    try {
        //查询工作流程状态
        that.wflowstatus = await queryWorkflowStatus(tableName,id);
    } catch (error) {
        console.log('query workflow status error :' + error);
    }

    try {
        //设置字段名称
        var filedValue = await queryTableFieldInfo(
            'v_table_field',
            tableName,
            'file_name'
        );

        //设置字段名称
        if (typeof filedValue != 'undefined') {
            that.curRow.fieldName['file_name'] = filedValue['txt'];
        }
    } catch (error) {
        console.log('setup fieldName info error :' + error);
    }

    try {
        that.depart = department;
    } catch (error) {
        console.log('setup department error : ' + error);
    }

    return that;
}

/**
 * @function 知会/流程通知转移到历史记录中
 */
export async function transWflowToHistory(tableName , id){

    //定义返回结果
    var result = null;
    //执行转历史操作
    try {
        //对应表单没有数据，故此知会/流程通知转移到历史记录中，获取关于此表单的所有当前审批日志信息
        var wfnode = await queryProcessLog(tableName, id);
        //对应表单没有数据，故此知会/流程通知转移到历史记录中，获取关于此表单的所有当前知会日志信息
        var messageNode = await queryProcessLogInformed(tableName, id);
        //如果审批日志信息不为空，则将审批日志信息转化为历史数据
        if(deNull(wfnode) != ''){
            result = await transWflowHistoring(tableName , wfnode);
        }
        //如果知会日志信息不为空，则将知会日志信息转化为历史数据
        if(deNull(messageNode) != ''){
            result = await transWflowHistoring(tableName , messageNode);
        }
    } catch (error) {
        console.log(error);
    }
    //返回结果
    return result;
}

/**
 * @function 知会/流程通知转移到历史记录的子操作
 */
export async function transWflowHistoring(tableName , wfnode){
    //定义返回结果
    var result = null;

    try {
        //删除当前审批节点中的所有记录
        result = await deleteProcessLog(tableName, wfnode);
        result = await deleteProcessLogInf(tableName, wfnode);
    } catch (error) {
        console.log(error);
    }

    try {
        //如果是数组，则遍历并转历史，如果是对象，则直接转历史
        if(wfnode instanceof Array && wfnode.length > 0){
            for(const item of wfnode){
                //转化日期格式
                item['operate_time'] = formatDate(item['operate_time'] , 'yyyy-MM-dd hh:mm:ss')
                item['create_time'] = formatDate(item['create_time'] , 'yyyy-MM-dd hh:mm:ss')
                //将当前审批日志转为历史日志，并删除当前审批日志中相关信息
                result = await postProcessLogHistory(item);
            }
        } else {
            //转化日期格式
            wfnode['operate_time'] = formatDate(wfnode['operate_time'] , 'yyyy-MM-dd hh:mm:ss')
            wfnode['create_time'] = formatDate(wfnode['create_time'] , 'yyyy-MM-dd hh:mm:ss')
            //将当前审批日志转为历史日志，并删除当前审批日志中相关信息
            result = await postProcessLogHistory(wfnode);
        }
    } catch (error) {
        console.log(error);
    }
    
    //返回结果
    return result;
}

/**
 * @function 查询文档对应预览地址
 * @param {*} text
 */
export function queryFileViewURL(text) {
    //文档URL
    var url = '';

    //查询文档对应预览地址
    try {
        //获取小写文档下载地址
        var textURL = deNull(text).toLowerCase();
        //如果不含有office文档
        if (!(
                textURL.includes('doc') ||
                textURL.includes('ppt') ||
                textURL.includes('xls') ||
                textURL.includes('pdf')
            )) {
            return false;
        }

        //文档数组
        var fileList = [];

        if (text.indexOf(',') > 0) {
            fileList = text.split(',');
        } else {
            fileList.push(text);
        }

        //获取第一个office文档
        url = _.find(fileList, function(text) {
            //获取小写字符串
            text = deNull(text).toLowerCase();
            return (
                text.includes('doc') ||
                text.includes('ppt') ||
                text.includes('xls') ||
                text.includes('pdf')
            );
        });

        //微软文档预览API
        var officeURL = window._CONFIG['previewURL'];
        //文档下载地址
        url = window._CONFIG['downloadURL'] + '/' + url;
        //URL加密，保证中文路径可以被正常解析
        var xurl = encodeURIComponent(url);

        //获取文件后缀
        var suffix = deNull(text)
            .substring(text.lastIndexOf('.'), text.length)
            .toLowerCase();

        //如果word文档，则使用微软API打开
        url =
            deNull(suffix).includes('doc') ||
            suffix.includes('ppt') ||
            suffix.includes('xls') ?
            officeURL + xurl :
            url;

        //如果pdf文档，则浏览器上直接打开
        url = suffix.includes('pdf') ? url : url;
    } catch (error) {
        console.log("query file view url error :" + error);
    }

    //返回URL
    return url;
}

/**
 * @function 查询文件类型
 * @description 查询表单含有的文件的文档类型
 * @param {*} text
 */
export function queryFileType(text) {
    //文档类型
    var type = '';
    //文件后缀
    var suffix = '';

    try {
        //获取文件后缀
        suffix = deNull(text).toLowerCase();
    } catch (error) {
        suffix = `${text}`;
    }

    try {

        //如果office文档，则使用微软API打开
        type =
            suffix.includes('jpg') ||
            suffix.includes('jpeg') ||
            suffix.includes('bmp') ||
            suffix.includes('gif') ||
            suffix.includes('webp') ||
            suffix.includes('png') ?
            '@image@' :
            '';

        type =
            suffix.includes('doc') || suffix.includes('xls') || suffix.includes('ppt') ?
            `${type}@office@` :
            type;
    } catch (error) {
        console.log("query file type error :" + error);
    }

    //返回URL
    return type;
}

/**
 * @function 查询附件中的图片地址
 */
export function queryImageURL(text) {
    //文档数组
    var fileList = [];
    var images = [];

    try {
        //如果text为空，则返回空数组
        if (deNull(text) == '') {
            return [];
        }
        //如果含有多个地址，则split后获取数组
        if (deNull(text).indexOf(',') > 0) {
            fileList = text.split(',');
        } else {
            fileList.push(text);
        }
    } catch (error) {
        console.log("query image url error :" + error);
    }

    try {
        //遍历并筛选出里面的图片信息
        fileList = _.filter(fileList, function(text) {
            //获取小写后的路径
            var ptext = deNull(text).toLowerCase();

            //获取图片标识
            var flag =
                ptext.includes('jpg') ||
                ptext.includes('jpeg') ||
                ptext.includes('bmp') ||
                ptext.includes('gif') ||
                ptext.includes('webp') ||
                ptext.includes('png');

            //获取图片真实下载地址
            text = window._CONFIG['downloadURL'] + '/' + text;

            //如果文件路径为图片地址，则存入images中
            if (flag) {
                //将数据存入images中
                images.push({
                    src: text,
                    msrc: window._CONFIG['thumborURL'] + encodeURIComponent(text),
                    title: '图片预览',
                    w: 900,
                    h: 600,
                });
            }
            return flag;
        });
    } catch (error) {
        console.log("query image url error :" + error);
    }

    //返回图片数组信息
    return images;
}

/**
 * @function 设置详情页面图片展示样式
 */
export function changeImageCSS() {
    //设置图片预览CSS样式
    try {
        setTimeout(() => {
            //图片预览，Css设置Float:left
            $('figure[itemscope="itemscope"]').css('float', 'left');
            $('figure[itemscope="itemscope"]').css('margin-right', '10px');
            $('figure[itemscope="itemscope"]').css('margin-bottom', '10px');
            //图片预览，文件名称展示位置Center
            $('.pswp__caption__center').css('text-align', 'center');
        }, 10);
    } catch (error) {
        console.log("change image css error :" + error);
    }
    //隐藏文档预览服务的图标
    try {
        //等待一段时间，文档加载完毕后，才可隐藏图标
        setTimeout(() => {
            $(".fa-file-image-o",$('#fileviewFrame')).remove();
        },3000)
    } catch (error) {
        console.log("hidden image icon of fileview framework");
    }
}

/**
 * @function 获取当前节点是否有知会或者审批节点信息
 */
export async function queryCurNodePageType(pageType) {
    //获取页面类型
    var type = queryUrlString('type');

    try {
        //如果审批详情或者知会详情页面，则设置pageType
        if (type == 'workflow' || type == 'notify') {
            //获取当前节点审批流程数据）
            var flag = await queryProcessLogByID(
                queryUrlString('table_name'),
                queryUrlString('processLogID')
            );

            //获取当前节点知会流程数据
            if (deNull(flag) == '') {
                flag = await queryProcessLogInfByID(
                    queryUrlString('table_name'),
                    queryUrlString('processLogID')
                );
            }

            //获取页面类型
            pageType = deNull(flag) == '' ? 'view' : pageType;
        } else if (type == 'workflowing') {

        }
    } catch (error) {
        console.log('获取当前节点是否有知会或者审批节点信息异常:' + error)
    }

    //返回pageType
    return pageType;
}

/**
 * @function 渲染审批流程详情
 */
export async function colorProcessDetail(that, main) {
    try {
        main.curRow = that.curRow;
    } catch (error) {
        console.log("set curRow error :" + error);
    }
    try {
        main.depart = that.depart;
    } catch (error) {
        console.log("set depart error :" + error);
    }
    try {
        main.workflows = that.workflows;
    } catch (error) {
        console.log("set curRow workflows error :" + error);
    }
    try {
        main.columns = that.curRow.sub_columns;
    } catch (error) {
        console.log("set curRow sub_columns error :" + error);
    }
    try {
        main.data = that.curRow.sub_data;
    } catch (error) {
        console.log("set curRow sub_data error :" + error);
    }
    try {
        main.pageType = queryUrlString('type');
    } catch (error) {
        console.log("set curRow pageType error :" + error);
    }
    try {
        main.curRow.fileStatus = deNull(main.curRow.files) == '' ? 1 : 0;
    } catch (error) {
        console.log("set curRow fileStatus error :" + error);
    }
    try {
        main.curRow.fileType = queryFileType(main.curRow.files);
    } catch (error) {
        console.log("set curRow fileType error :" + error);
    }
    try {
        main.curRow.fileURL = queryFileViewURL(main.curRow.files);
    } catch (error) {
        console.log("set curRow fileURL error :" + error);
    }
    try {
        main.slides = queryImageURL(main.curRow.files);
    } catch (error) {
        console.log("set curRow slides error :" + error);
    }
    try {
        main.tableName = queryUrlString('table_name');
    } catch (error) {
        console.log("set curRow tableName error :" + error);
    }
    //检查是否可以进行审批/同意等操作
    try {
        main.pageType = await queryCurNodePageType(main.pageType);
    } catch (error) {
        console.log("set curRow pageType error :" + error);
    }
    //查询表字段信息
    try {

        main.tableInfo = await queryTableFieldInfoJSON(main.tableName);
    } catch (error) {
        console.log("set tableInfo error :" + error);
    }
    //修改图片样式
    try {
        changeImageCSS();
    } catch (error) {
        console.log("change image css error :" + error);
    }
    
    //返回设置结果
    return main;
}

/**
 * @function 查询表字段信息
 * @param {*} tableName
 */
export async function queryTableFieldInfoJSON(tableName) {
    try {    
        //查询表单信息
        var tableInfo = await queryTableDataByField('v_table_info', 'id', tableName);
        //如果信息不为空，则解析表单信息
        if (deNull(tableInfo) != '' && tableInfo.length > 0) {
            try {
                tableInfo = deNull(tableInfo[0]['value']);
            } catch (error) {
                console.log('tabale info :' + tableInfo);
            }
        }
        //如果信息不为空，则进行解析数据
        if (deNull(tableInfo) != '') {
            try {
                tableInfo = JSON.parse(tableInfo);
            } catch (error) {
                console.log('tabale info :' + tableInfo);
            }
        }
    } catch (error) {
        console.log("query table field info json error :" + error);
    }
    return tableInfo;
}

/**
 * @function 查询工作流节点状态
 */
export async function queryWorkflowStatus(tableName, id) {

    //定义返回节点信息
    var node = null;

    //节点状态信息（待提交）
    var node_0 = JSON.parse('{"start":{"status":"wait","name":"发起","color":""},"audit":{"status":"wait","name":"审核","color":""},"approve":{"status":"wait","name":"审批","color":""},"message":{"status":"wait","name":"知会","color":""}}');
    //节点状态信息（处理中）
    var node_1 = JSON.parse('{"start":{"status":"finish","name":"发起","color":"skyblue"},"audit":{"status":"wait","name":"审核","color":""},"approve":{"status":"wait","name":"审批","color":""},"message":{"status":"wait","name":"知会","color":""}}');
    //节点状态信息（审核完成）
    var node_2 = JSON.parse('{"start":{"status":"finish","name":"发起","color":"skyblue"},"audit":{"status":"finish","name":"审核","color":""},"approve":{"status":"wait","name":"审批","color":""},"message":{"status":"wait","name":"知会","color":""}}');
    //节点状态信息（审批完成）
    var node_3 = JSON.parse('{"start":{"status":"finish","name":"发起","color":"skyblue"},"audit":{"status":"finish","name":"审核","color":""},"approve":{"status":"finish","name":"审批","color":""},"message":{"status":"wait","name":"知会","color":""}}');
    //节点状态信息（知会完成）
    var node_4 = JSON.parse('{"start":{"status":"finish","name":"发起","color":"skyblue"},"audit":{"status":"finish","name":"审核","color":""},"approve":{"status":"finish","name":"审批","color":""},"message":{"status":"finish","name":"知会","color":"pink"}}');

    //获取当前表单信息
    var curRow = await queryTableData(tableName , id);

    //根据流程状态，设置流程图渲染状态
    if(deNull(curRow)!='' && curRow.bpm_status == 1){
        node = node_0;
    } else if(deNull(curRow)!='' && curRow.bpm_status == 2){
        node = node_1;
    } else if(deNull(curRow)!='' && curRow.bpm_status == 3){
        node = node_2;
    } else if(deNull(curRow)!='' && curRow.bpm_status == 4){
        node = node_3;
    } else if(deNull(curRow)!='' && curRow.bpm_status == 5){
        node = node_4;
    } else {
        node = node_0;
    }

    //打印查询参数
    console.log(`tableName: ${tableName} \n\r id: ${id}`);

    //返回节点信息
    return node;
}
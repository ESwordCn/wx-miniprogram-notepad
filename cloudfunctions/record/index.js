// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.op == 'get') {
    var pageIndex = event.pageIndex || 1; //页面索引
    var pageSize = event.pageSize || 10; //页大小

    return await db.collection("record").where({
      user_id:event.user_id
    }).skip((pageIndex-1)*pageSize).limit(pageSize).get()  //skip配合limit可实现分页功能

  } else if (event.op == 'add') {
    
    var record = event

    record.user_id = record.userInfo.openId
  
    delete record.userInfo
    return await db.collection("record").add({
      data: {
  
        ...record
  
        
      }
    })
  } else if (event.op == 'update') {
    
    var _id = event._id
    delete event._id
    return await db.collection("record").where({
      _id
    }).update({
      
        data: {
          ...event
        }
      
      
    })
    
  }else if(event.op == 'delete'){
    return await db.collection("record").where({
      _id:event._id
    }).remove()

  }else if(event.op == 'search'){
    return await db.collection("record").where({
      title: db.RegExp({
        regexp:event.value
      })
    }).get()

  }


  


}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.op == "add") {

    return await db.collection("tag_list").where({
      type:event.type
    })
      .update({
        data: {
          tags:_.push([event.tags])
      }
      })
    
  } else if (event.op == "delete") {
    return await db.collection("tag_list").where({
      type:event.type
    }).update({
      data: {
        tags: _.pull({
          name:event.name
        })
      }
    })
    
  } else if (event.op == "get") {
    return await db.collection("tag_list").where({
      type:event.type
    }).get()

  }


  
}
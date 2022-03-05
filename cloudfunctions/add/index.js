// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  var record = event

  record.user_id = record.userInfo.openId

  delete record.userInfo
  return await db.collection("record").add({
    data: {

      ...record

      
    }
  })



}
export const callFunction = (params) => {
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            ...params,
            
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
      
        });
    })
}
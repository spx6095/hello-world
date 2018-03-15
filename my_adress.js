// pages/my_adress/my_adress.js
var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    console.log(wx.getStorageSync('memberId'))
    wx.request({
      url: app.globalData.apiURL + 'getDataMapByPageAction.action',
      data: {
        metaDataTableId: 24,
        "page.pageSize": 10,
        "props['memShipId']": wx.getStorageSync('memberId'),
        "searchType": true,

      },
      method: 'GET',
      // header: {}, // 设置请求的 header        
      success: function (res) {
        console.log(res)
        console.log(res.data.page.result)
        _this.setData({
          items: res.data.page.result
        })
      }
    })


    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goPage:util.goPage,

  setAddress:function(e){
    console.log(e.target.id)
    var thisId = e.currentTarget.id

    var _this = this
    wx.request({
      url: app.globalData.apiURL + 'batchUpdatePropsAction.action',
      data: {
        metaDataTableId: 24,
        "props['memShipId']": wx.getStorageSync('memberId'),
        "values['ifDefault']": 0,
        token: app.globalData.apiToken
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: { 'content-type': 'application/x-www-form-urlencoded' },

      success: function (res) {
        if(res.data.msg == 'success'){
              wx.request({
                url: app.globalData.apiURL + 'editSystemDataAction.action',
                data: {
                  "props['ifDefault']": 1,                
                  metaDataTableId: 24,
                  token: app.globalData.apiToken,
                  id: thisId
                },
                method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                  console.log(res)
                  if(res.data.msg == 'success'){
                      var newData = _this.data.items;
                      console.log(newData)
                      for(var i = 0; i < newData.length;i++){
                        (newData[i].id == e.target.id) ? newData[i].ifDefault = 1 : newData[i].ifDefault = 0 
                       
                      }
                     
                      _this.setData({
                        items: newData
                      })
                      
                  }
                }

              })
        }
      }
    })
  },

  //修改地址
  modify:function(e){
    console.log(e.currentTarget.id)
    var index = e.currentTarget.id;
    var items = this.data.items
     wx.navigateTo({
       url: '../modify_address/modify_address?items='+JSON.stringify(items)+'&index='+index
     })
  },
  deleteAddress:function(e){

    var _this = this;
    wx.showModal({
      title: '提示',
      content: '确认删除此地址？',
      success: function (res) {
        if (res.confirm) {
          var index = e.currentTarget.id;
        
          wx.request({
            url: app.globalData.apiURL + 'deleteSystemDataAction.action',
            data: {
              metaDataTableId: 24,
              id: _this.data.items[index].id
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: { 'content-type': 'application/x-www-form-urlencoded' },

            success: function (res) {
              if (res.data.msg == 'success') {
                  var items =  _this.data.items;
                  items.splice(index,1)
                  _this.setData({
                    items: items
                  })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }

})
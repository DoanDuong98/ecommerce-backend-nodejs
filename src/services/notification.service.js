'use strict'

const notificationModel = require("../models/notification.model");

const pushNotiToSystem = async({
    type = 'SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {}
}) => {
    let noti_content;
    if (type === 'SHOP-001') {
        noti_content = `@@@ vừa thêm mới 1 sản phẩm: @@@`
    } else if (type === 'PROMOTION-001') {
        noti_content = `@@@ vừa thêm mới 1 sản phẩm: @@@`
    }
    const newNoti = await notificationModel.create({
        noti_type: type,
        noti_receiveId: receivedId,
        noti_senderId: senderId,
        noti_options: options
    })
    return newNoti;
}

module.exports = {
    pushNotiToSystem
}
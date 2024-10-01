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


const listNotiByUser = async({ userId = 1, type= 'ALL', isRead = 0 }) => {
    const match = { noti_receiveId: userId };
    if (type !== 'ALL') {
        match['noti_type'] = type;
    }
    return await notificationModel.aggregate([
        { $match: match },
        { $project: {
            noti_type: 1,
            noti_senderId: 1,
            noti_receiveId: 1,
            noti_content: {
                $concat: [
                    {
                        $substr: ['$noti_options.shop_name', 0, -1]
                    },
                    'vừa mới thêm 1 sản phẩm mới:', //lang
                    {
                        $substr: ['$noti_options.productname_name', 0, -1]
                    },
                ]
            },
            noti_options: 1
        } }
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser
}
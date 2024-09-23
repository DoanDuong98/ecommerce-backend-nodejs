'use strict'

const redis = require('redis');
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3s

    for (let i = 0; i < retryTimes; i++) {
        const result =  await setnxAsync(key, expireTime);
        if (result === 1) {
            // inventory
            const isReservation = await reservationInventory({ productId, quantity, cartId })
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
}

/*
    String
    - cmd
        GET key
        SET key value
        EXISTS key
*/

/*
    Hash
    - one key - many value
    - CMD: f
        HSET name key value
        HGET name key
        HMSET name key1 vakue1 key2 value2
        HMGET name key1 key2
        HDEL name key
        HLEN name
        HEXISTS name key
        HINCRBY name key number
        HKEYS name
        HVALS name
        HGETALL name
    - using: 
        Cart
*/

/*
    List
    - cmd: 
        LPUSH name key1 key2 key3 ... // left push
        LRANGE name start stop // like slice js
        RPUSH ...
        LPOP name stop // delete number_ele first left
        RPOP ...
        BLOP name timeout
        LINDEX name index
        LLEN name
        LREM name index1 index2
        LTRIM name start stop
        LSET name index new_value
        LINSERT name BEFORE|AFTER ele value
     - using for queue, stack,..
        MQ: đảm bảo thứ tự, duplicate, 
*/

/*
    Sets
*/

module.exports = {
    releaseLock,
    acquireLock
}


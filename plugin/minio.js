const Minio = require('minio')
const minioClient = new Minio.Client({
    // endPoint: '172.18.5.171',
    endPoint: 'k8s-oss-minio.default',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'Wanwoo@123'
});

// 创建存储桶
const makeBucket = (bucketName,  region) => {
    return minioClient.makeBucket(bucketName, region)
}
// 验证存储桶是否存在
const bucketExistsOrmakeBucket = (bucketName) => {
    return minioClient.bucketExists(bucketName)
}
// 上传文件
const putObject = (bucketName, objectName, stringOrBuffer, callback, ) => {
    return minioClient.putObject(bucketName, objectName, stringOrBuffer, 'application/octet-stream', callback)
}
// 设置存储桶策略
const setBucketPolicy = (bucketName) => {
    return minioClient.setBucketPolicy(bucketName, JSON.stringify({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicRead",
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                    "s3:GetObject",
                    "s3:GetObjectVersion"
                ],
                "Resource": [`arn:aws:s3:::${bucketName}/*`]
                
            }
        ]
    }))
}

const presignedPutObject =  (bucketName, objectName, expiry ) => {
    // 默认一小时
    expiry = expiry || 1*60*60;
    return minioClient.presignedPutObject(bucketName, objectName, expiry)
}


module.exports = {
    makeBucket,
    bucketExistsOrmakeBucket,
    putObject,
    setBucketPolicy,
    presignedPutObject
}
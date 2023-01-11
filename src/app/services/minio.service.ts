import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from 'src/environments/environment';
// import {Client, BucketItem} from 'minio'

@Injectable({
  providedIn: 'root'
})
export class MinioService {

  minioClient: any;

  constructor() {
    this.minioClient = new AWS.S3({
      accessKeyId: environment.minio_s3_access_key,
      secretAccessKey: environment.minio_s3_secret_key,
      endpoint: `${environment.minio_s3_endpoint}:${environment.minio_s3_port}`,
      s3ForcePathStyle: true,
      s3BucketEndpoint: true
    });
    this.getObject("avatar.png");
  }

  listBuckets() {
    this.minioClient.listBuckets((err, data) => {
      return data;
    })
  }
  async getObject(key: string) {
    var params = {
      Bucket: environment.minio_s3_bucket_name,
      Key: key
    };
    const data_file = await this.minioClient.getObject(params).promise();
    return data_file.Body.toString('binary');
  }
}

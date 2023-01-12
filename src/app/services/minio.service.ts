import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from 'src/environments/environment.prod';
// import {Client, BucketItem} from 'minio'

@Injectable({
  providedIn: 'root'
})
export class MinioService {

  minioClient: any;
  url: string = "";
  constructor() {
    // this.minioClient = new AWS.S3({
    //   accessKeyId: environment.minio_s3_access_key,
    //   secretAccessKey: environment.minio_s3_secret_key,
    //   endpoint: `${this.url}`,
    //   // endpoint: this.url,
    //   s3ForcePathStyle: true,
    //   s3BucketEndpoint: true
    // });
    // this.getObject("avatar.png");
  }
  initMinio() {
    environment.minio_s3_endpoint = this.url;
    this.minioClient = new AWS.S3({
      accessKeyId: environment.minio_s3_access_key,
      secretAccessKey: environment.minio_s3_secret_key,
      endpoint: `${this.url}`,
      // endpoint: this.url,
      s3ForcePathStyle: true,
      s3BucketEndpoint: true
    });
    this.getObject("avatar.png");
  }

  getClient() {
    return this.minioClient;
  }

  listBuckets() {
    this.minioClient.listBuckets((err, data) => {
      return data;
    });
  }
  async getObject(key: string) {
    var params = {
      Bucket: environment.minio_s3_bucket_name,
      Key: key
    };
    const data_file = await this.minioClient.getObject(params).promise();
    return data_file.Body.toString('binary');
  }

  putObject(file: File) {
    var params = {
      Body: file,
      Bucket: environment.minio_s3_bucket_name,
      Key: file.name
    };
    this.minioClient.putObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }
}

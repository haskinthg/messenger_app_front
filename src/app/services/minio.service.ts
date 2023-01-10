import { Injectable } from '@angular/core';
import {Client, BucketItem} from 'minio'

@Injectable({
  providedIn: 'root'
})
export class MinioService {

  minioClient: Client

  constructor() {
    this.minioClient = new Client({
      endPoint: '/minio',
      port: 9000,
      useSSL: true,
      accessKey: 'm',
      secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
    })
  }
}

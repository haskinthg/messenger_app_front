import { UserFilename } from './../../../models/UserFilename';
import { MinioService } from './../../../services/minio.service';
import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFilename) {
    this.url_file = data.url;
  }

  url_file: string = '';

  file: File;
  public onFileSelected(event: EventEmitter<File[]>) {
    this.file = event[0];
  }

  delFile() {
    (document.getElementById('input__file') as HTMLInputElement).value = '';
    this.file = null as File;
  }

  onNoClick(): void {
    this.data = null;
    this.dialogRef.close();
  }

  onSave() {
    if (this.file != null) {
      this.data.user.photo = this.file.name;
      this.data.file = this.file;
    }
    this.dialogRef.close(this.data);
  }

}

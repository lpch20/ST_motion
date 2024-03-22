import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('file', { read: false })
  fileInput: ElementRef;

  // TODO Allow multiple upload
  // @Input()
  multiple: boolean = false;

  // TODO Drop file after upload
  // @Input()
  keepFile: boolean = true;

  @Output()
  onFileLoaded: EventEmitter<File> = new EventEmitter<File>();

  @Output()
  onFilesLoaded: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Input() // This field is in case there are multiple file-uploads in the page
  index: string = null;

  @Input()
  label = 'Elige un archivo';

  @Input('allowed-extensions')
  allowedExtensions: Array<string> = ['csv'];

  @Output()
  onErrors: EventEmitter<any[]> = new EventEmitter<any[]>();

  loadedFile: File = null;

  constructor() { }

  ngOnInit() { }

  onChange(event) {
    if (event.srcElement.files.length > 1) {
      // TODO allow multiple
      // this.onFilesLoaded.emit(event.srcElement.files);
    } else {
      this._onFilesChange(event.srcElement.files[0])
    }
  }

  private _onFilesChange(file: File) {
    const ext = file.name.split('.')[file.name.split('.').length - 1];
    if (this.allowedExtensions.lastIndexOf(ext) !== -1) {
      this.onFileLoaded.emit(file);
      if (this.keepFile) {
        this.loadedFile = file;
      } else {
        this.fileInput.nativeElement.value = '';
      }
    } else {
      this.onErrors.emit([{
        title: 'Formato Invalido',
        message: `El formato del archivo no es válido. Intanta subir un archivo con alguno de los siguientes formatos: [${this.allowedExtensions.join(',')}].`
      }]);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { APIService } from '../../services/api.service';
import { SidebarService } from '../../services/sidebar.service';
import { GlobalService } from '../../services/global.service';
import { NgIf, NgStyle } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop'

@Component({
  selector: 'app-sexton-sidebar-content',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgbDatepickerModule,
    JsonPipe,
    FormsModule,
    NgxFileDropModule,
  ],
  templateUrl: './sexton-sidebar-content.component.html',
  styleUrls: ['./sexton-sidebar-content.component.scss']
})
export class SextonSidebarContentComponent implements OnInit {
  // Plot data variable and date stuff
  plotData: any;
  model: NgbDateStruct = { year: 0, month: 0, day: 0 };
  date: { year: number; month: number } = { year: 0, month: 0 };

  // Image variables
  portraitFileUploaded: boolean = false;
  portraitInvalidFileType: boolean = false;
  portraitImageSrc: string | ArrayBuffer | null = null;

  landscapeFileUploaded: boolean = false;
  landscapeInvalidFileType: boolean = false;
  landscapeImageSrc: string | ArrayBuffer | null = null;

  constructor(
    private apiService: APIService,
    private globalService: GlobalService,
    private sidebarService: SidebarService,
    private calendar: NgbCalendar
  ) { }

  ngOnInit(): void {
    this.sidebarService.sidebarToggled$.subscribe((id: number) => {
      this.getSextonContentData(id);
    });

    this.date = { year: this.calendar.getToday().year, month: this.calendar.getToday().month };
  }

  async getSextonContentData(plotId: number): Promise<void> {
    try {
      this.sidebarService.setDataLoadedStatus(false);
      this.plotData = await this.apiService.getData('plot/' + plotId + '/');
      this.sidebarService.setDataLoadedStatus(true);
    } catch (err) {
      console.error('Error fetching Sexton content data:', err);
      this.sidebarService.setDataLoadedStatus(false);
    }
  }

  // Handle dropped files
  public handleDroppedFile(files: NgxFileDropEntry[], imageType: string) {
    // Variable for first file in array, we're only working with one file at a time
    const droppedFile = files[0]; 

    // Something I found on StackOverflow and updated with logic (imageType)
    if (droppedFile && droppedFile.fileEntry.isFile) {
      // fileEntry variable casted as FileSystemFileEntry
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

      // Use fileEntry and check for invalid file types
      fileEntry.file((file: Blob) => {
        // Check if the dropped file is an image
        if (!file.type.startsWith('image/')) {
          // Show invalid for portrait
          if (imageType === 'portrait')
            this.portraitInvalidFileType = true;

          // Show invaild for landscape
          else if (imageType === 'landscape')
            this.landscapeInvalidFileType = true;

          return;
        }
      
        // Create a FileReader to read the file asynchronously
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          // Set portrait source
          if (imageType === 'portrait') {
            this.portraitImageSrc = e.target?.result ?? null;   // Provide `null` as a fallback
            this.portraitFileUploaded = true;                   // Set the flag once a file is processed
          }

          // Set landscape source 
          else if (imageType === 'landscape') {
            this.landscapeImageSrc = e.target?.result ?? null;   // Provide `null` as a fallback
            this.landscapeFileUploaded = true;                   // Set the flag once a file is processed
          }
        };

        // Allow us to get a preview of uploaded file
        reader.readAsDataURL(file);
      });
    }
  }

  // Handle files uploaded through File Explorer
  handleFileInputChange(event: Event, imageType: string) {
    // Event target, contains uploaded file
    const target = event.target as HTMLInputElement;

    // Ensure we have a target file and grab first entry
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
  
      // Check for invalid file types
      if (!file.type.startsWith('image/')) {
        // Show invalid for portrait
        if (imageType === 'portrait') 
          this.portraitInvalidFileType = true;

        // Show invalid for landscape
        else if (imageType === 'landscape') 
          this.landscapeInvalidFileType = true;
        
        return;
      }
  
      // Create a FileReader to read the file asynchronously
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Set portrait source 
        if (imageType === 'portrait') {
          this.portraitImageSrc = e.target?.result ?? null;
          this.portraitFileUploaded = true;
        }

        // Set landscape source 
        else if (imageType === 'landscape') {
          this.landscapeImageSrc = e.target?.result ?? null;
          this.landscapeFileUploaded = true;
        }
      };

      // Allow us to get a preview of uploaded file
      reader.readAsDataURL(file);
    }
  }

  // Clear currently uploaded file
  clearFile(imageType: string) {
    // Clear portrait file
    if (imageType === 'portrait') {
      this.portraitFileUploaded = false;
      this.portraitImageSrc = null;
      this.portraitInvalidFileType = false;
    }

    // Clear landscape file
    else if (imageType === 'landscape') {
      this.landscapeFileUploaded = false;
      this.landscapeImageSrc = null;
      this.landscapeInvalidFileType = false;
    }
  }

  // Save changes to database
  onSave() {

  }
}

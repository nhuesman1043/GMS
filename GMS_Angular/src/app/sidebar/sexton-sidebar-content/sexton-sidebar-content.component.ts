import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { APIService } from '../../services/api.service';
import { SidebarService } from '../../services/sidebar.service';
import { GlobalService } from '../../services/global.service';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop'
import { MapService } from '../../services/map.service';
import { response } from 'express';

@Component({
  selector: 'app-sexton-sidebar-content',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgFor,
    NgClass,
    NgbDatepickerModule,
    JsonPipe,
    FormsModule,
    NgxFileDropModule
  ],
  templateUrl: './sexton-sidebar-content.component.html',
  styleUrls: ['./sexton-sidebar-content.component.scss']
})
export class SextonSidebarContentComponent implements OnInit {
  // Data variables and date stuff
  plotData: any;
  selectedPlotId: number = -1;
  personData: any;
  plotStatusData: any;
  dateOfBirthModel: NgbDateStruct | null = null;
  dateOfDeathModel: NgbDateStruct | null = null;
  dateOfBurialModel: NgbDateStruct | null = null
  date: { year: number; month: number } = { year: 0, month: 0 };

  // Image variables
  portraitFileUploaded: boolean = false;
  portraitInvalidFileType: boolean = false;
  portraitImageSrc: string | ArrayBuffer | null = null;

  landscapeFileUploaded: boolean = false;
  landscapeInvalidFileType: boolean = false;
  landscapeImageSrc: string | ArrayBuffer | null = null;

  // Image file variables
  portraitFile: File | null = null;
  landscapeFile: File | null = null;

  // Variable to determine if we need to PUT or POST depending on value of person_id in plot
  isNewPerson: boolean = false;

  // Variable for showing whether or not any changes have been made
  changesMade: boolean = false;

  constructor(
    private apiService: APIService,
    private globalService: GlobalService,
    private sidebarService: SidebarService,
    private calendar: NgbCalendar,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.sidebarService.sidebarToggled$.subscribe((id: number) => {
      this.getSextonContentData(id);
    });

    this.date = this.calendar.getToday()
  }

  async getSextonContentData(plotId: number): Promise<void> {
    // Reset images and changesMade
    this.portraitImageSrc = null;
    this.landscapeImageSrc = null;
    this.changesMade = false;

    try {
      // Set dataLoaded to false when starting to get Sexton data
      this.sidebarService.setDataLoadedStatus(false);

      // Set selectedPlotId so we can access it elsewhere
      this.selectedPlotId = plotId;

      // Get all plots statuses 
      this.plotStatusData = await this.apiService.getData('plot_statuses');

      // Get selected plot data and associated person_id
      this.plotData = await this.apiService.getData('plot/' + plotId + '/');
      const personId = this.plotData.person_id;

      // Check if we should pull in data about the person occupying the plot
      if (personId !== null) {
        // Get person's data beacuse we've confirmed that somebody is here
        this.personData = await this.apiService.getData('person/' + this.plotData.person_id + '/');

        // Check if there is an available portait image and if so, set value and show
        if (this.personData.portrait_image_url !== null) {
          this.portraitImageSrc = this.personData.portrait_image_url;
          this.portraitFileUploaded = true;
        }

        // Check if there is an available landscape image and if so, set value and show
        if (this.personData.landscape_image_url !== null) {
          this.landscapeImageSrc = this.personData.landscape_image_url;
          this.landscapeFileUploaded = true;
        }

        // Call initializeDateFields to set all date fields
        this.initializeDateFields()
      }

      // We are dealing with adding a new person to occupy this plot because there is currently nobody there
      else {
        // Set isNewPerson and disable images
        this.isNewPerson = true;
        this.portraitFileUploaded = false;
        this.landscapeFileUploaded = false;

        // Blank person...
        this.personData = {
          'first_name': '',
          'last_name': '',
          'date_of_birth': '',
          'date_of_death': '',
          'date_of_burial': '',
          'obituary': '',
          'portrait_image_url': null,
          'landscape_image_url': null
        };
      }

      // Set dataLoaded to true when data is fetched
      this.sidebarService.setDataLoadedStatus(true);
    } catch (err) {
      // Show error and set data loaded to false
      console.error('Error fetching Sexton content data:', err);
      this.sidebarService.setDataLoadedStatus(false);
    }
  }

  // Initialize date fields by getting values from date and setting accordingly
  initializeDateFields() {
    // Date of birth
    const dateOfBirthParts = this.personData.date_of_birth.split('-');
    this.dateOfBirthModel = {
        year: Number(dateOfBirthParts[0]),
        month: Number(dateOfBirthParts[1]),
        day: Number(dateOfBirthParts[2])
    };

    // Date of death
    const dateOfDeathParts = this.personData.date_of_death.split('-');
    this.dateOfDeathModel = {
        year: Number(dateOfDeathParts[0]),
        month: Number(dateOfDeathParts[1]),
        day: Number(dateOfDeathParts[2])
    };

    // Date of burial
    const dateOfBurialParts = this.personData.date_of_burial.split('-');
    this.dateOfBurialModel = {
        year: Number(dateOfBurialParts[0]),
        month: Number(dateOfBurialParts[1]),
        day: Number(dateOfBurialParts[2])
    };
  }

  // Method to handle when user inputs a change to a person property, updates our current personData
  updatePersonField(propertyName: string, value: any) {
    // Show changes have been made
    this.changesMade = true;

    // Convert to NgbDateStruct if we are dealing with a date
    if (propertyName.includes('date_of_')) {
      // Convert value to NgbDateStruct, so we don't break fancy datepickers
      const dateValue: NgbDateStruct = value;

      // Format the date as 'yyyy-mm-dd'
      const formattedDate = dateValue ? `${dateValue.year}-${String(dateValue.month).padStart(2, '0')}-${String(dateValue.day).padStart(2, '0')}` : null;

      // Set new value
      this.personData[propertyName] = formattedDate
    }

    // Everything else
    else {
      // Set new value
      this.personData[propertyName] = value;
    }
  }

  // Method to handle when user inputs a change to a plot property, updates our current personData
  updatePlotField(propertyName: string, value: any) {
    // Show changes have been made
    this.changesMade = true;

    // Set new value
    this.plotData[propertyName] = value;
  }

  // Handle dropped files
  handleDroppedFile(files: NgxFileDropEntry[], imageType: string) {
    // Show changes have been made
    this.changesMade = true;

    // Variable for first file in array, we're only working with one file at a time
    const droppedFile = files[0]; 

    // Something I found on StackOverflow and updated with logic (imageType)
    if (droppedFile && droppedFile.fileEntry.isFile) {
      // fileEntry variable casted as FileSystemFileEntry
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

      // Use fileEntry and check for invalid file types
      fileEntry.file((file: Blob) => {
        // Explicitly cast Blob to File
        const castedFile = file as File;

        // Check if the dropped file is an image
        if (!castedFile.type.startsWith('image/')) {
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
            this.portraitFile = castedFile;
          }

          // Set landscape source 
          else if (imageType === 'landscape') {
            this.landscapeImageSrc = e.target?.result ?? null;   // Provide `null` as a fallback
            this.landscapeFileUploaded = true;                   // Set the flag once a file is processed
            this.landscapeFile = castedFile;
          }
        };

        // Allow us to get a preview of the uploaded file
        reader.readAsDataURL(file);
      });
    }
  }

  // Handle files uploaded through File Explorer
  handleFileInput(event: Event, imageType: string) {
    // Show changes have been made
    this.changesMade = true;

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
          this.portraitFile = file;
        }

        // Set landscape source 
        else if (imageType === 'landscape') {
          this.landscapeImageSrc = e.target?.result ?? null;
          this.landscapeFileUploaded = true;
          this.landscapeFile = file;
        }
      };

      // Allow us to get a preview of the uploaded file
      reader.readAsDataURL(file);
    }
  }

  // Clear currently uploaded file
  clearFile(imageType: string) {
    // Show changes have been made
    this.changesMade = true;
    
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
  async onSave() {
    // We are creating a new person to occupy this plot, so POST
    if (this.isNewPerson) {
      // Create new person
      //await this.apiService.postData('persons/', createFields);
    }

    // We are updating the person already in this plot, so PUT
    else {
      // Upload images to this person
      await this.uploadImages();

      // Save person_id to variable before deletion
      const personId = this.personData.person_id;

      // Remove plot_id and person_id from update fields
      delete this.plotData.plot_id
      delete this.personData.person_id;

      // Update plot and then person
      await this.apiService.putData('plot/' + this.selectedPlotId + '/', this.plotData);
      await this.apiService.putData('person/' + personId + '/', this.personData);
    }

    // Refresh map to display newly updated set of plots
    this.mapService.mapInstance?.refreshMap('');
    
    // Reset changesMade and data by toggling sidebar woth selectPlot method on currently selected plot
    this.changesMade = false;
    //this.mapService.mapInstance?.selectPlot(this.selectedPlotId)
  }

  async uploadImages() {
    // Upload portrait image if available
    if (this.portraitFileUploaded && this.portraitFile !== null) {
      try {
        // Call uploadFile to upload file to database and save name to response.fileName
        const portraitFormData = new FormData();
        portraitFormData.append('image', this.portraitFile); 
        const response = await this.apiService.uploadFile('file/upload/image/', portraitFormData);

        // Assign the file object to personData['portrait_image_url']
        this.personData['portrait_image_url'] = this.globalService.IMAGE_URL + '/' + response.fileName;
      } catch (error) {
        // Something broke lol
        console.error('Error uploading portrait image: ', error);
      }      
    }

    // Remove portrait file
    else {

    }

    // Upload landscape image if available
    if (this.landscapeFileUploaded && this.landscapeFile !== null) {
      try {
        // Call uploadFile to upload file to database and save name to response.fileName
        const landscapeFormData = new FormData();
        landscapeFormData.append('image', this.landscapeFile); 
        const response = await this.apiService.uploadFile('file/upload/image/', landscapeFormData);

        // Assign the file object to personData['landscape_image_url']
        this.personData['landscape_image_url'] = this.globalService.IMAGE_URL + '/' + response.fileName;
      } catch (error) {
        // Something broke lol
        console.error('Error uploading landscape image: ', error);
      }      
    }

    // Remove landscape file
    else {

    }
  }
}
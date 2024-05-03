import { Component, OnInit, TemplateRef, inject, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { APIService } from '../../services/api.service';
import { SidebarService } from '../../services/sidebar.service';
import { GlobalService } from '../../services/global.service';
import { NgClass, NgFor, NgForOf, NgIf, NgStyle } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop'
import { MapService } from '../../services/map.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sexton-sidebar-content',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgFor,
    NgForOf,
    NgClass,
    NgbDatepickerModule,
    JsonPipe,
    FormsModule,
    NgxFileDropModule
  ],
  templateUrl: './sexton-sidebar-content.component.html',
  styleUrls: ['./sexton-sidebar-content.component.scss']
})
// Noah's pièce de résistance
export class SextonSidebarContentComponent implements OnInit {
  // Inject modal and get reference to templates
  private modalService = inject(NgbModal);
  @ViewChild('confirmation', { static: true }) confirmationTemplate!: TemplateRef<any>;
  @ViewChild('fail', { static: true }) failTemplate!: TemplateRef<any>;
  @ViewChild('warn', { static: true }) warnTemplate!: TemplateRef<any>;

  // Data variables and date stuff
  plotData: any;
  selectedPlotId: number = -1;
  personData: any;
  plotStatusData: any;
  dateOfBirthModel: NgbDateStruct | null = null;
  dateOfDeathModel: NgbDateStruct | null = null;
  dateOfBurialModel: NgbDateStruct | null = null
  date: { year: number; month: number } = { year: 0, month: 0 };
  currentYear: number = -1;

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

  // Variable for showing whether or not any changes have been made and canCreatePerson flag
  changesMade: boolean = false;
  hasTriedToCreatePerson: boolean = false;
  canCreatePerson: boolean = false;
  plotStatusChange: boolean = false;

  // Easter egg shhhh.....
  warningCount: number = 0;

  constructor(
    private apiService: APIService,
    private globalService: GlobalService,
    private sidebarService: SidebarService,
    private calendar: NgbCalendar,
    private mapService: MapService,
  ) { }

  ngOnInit(): void {
    this.sidebarService.sidebarToggled$.subscribe((id: number) => {
      this.getSextonContentData(id, true);
    });

    this.date = this.calendar.getToday();
    this.currentYear = this.date.year;
  }

  async getSextonContentData(plotId: number, toggleSidebar: boolean): Promise<void> {
    // Reset 
    this.portraitImageSrc = null;
    this.landscapeImageSrc = null;
    this.changesMade = false;
    this.plotStatusChange = false;
    this.hasTriedToCreatePerson = false; 
    this.portraitInvalidFileType = false;
    this.landscapeInvalidFileType = false;

    try {
      // Set dataLoaded to false when starting to get Sexton data
      this.sidebarService.setDataLoadedStatus(false, toggleSidebar);

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

        // Ensure an image isn't shown is there isn't one to show
        else 
          this.portraitFileUploaded = false;

        // Check if there is an available landscape image and if so, set value and show
        if (this.personData.landscape_image_url !== null) {
          this.landscapeImageSrc = this.personData.landscape_image_url;
          this.landscapeFileUploaded = true;
        }

        // Ensure an image isn't shown is there isn't one to show
        else 
          this.landscapeFileUploaded = false;

        // Call initializeDateFields to set all date fields
        this.initializeDateFields()
      }

      // We are dealing with adding a new person to occupy this plot because there is currently nobody there
      else {
        // Set isNewPerson and disable images
        this.isNewPerson = true;
        this.portraitFileUploaded = false;
        this.landscapeFileUploaded = false;

        // Set to blank person...
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
      if (toggleSidebar)
        this.sidebarService.setDataLoadedStatus(true, toggleSidebar);
    } catch (err) {
      // Show error and set data loaded to false
      console.error('Error fetching Sexton content data:', err);
      this.sidebarService.setDataLoadedStatus(false, toggleSidebar);
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

    // Check to see if we can create a person
    if (
      this.personData['first_name'] !== '' &&
      this.personData['last_name'] !== '' &&
      this.personData['date_of_birth'] !== '' &&
      this.personData['date_of_death'] !== '' &&
      this.personData['date_of_burial'] !== '' &&
      this.personData['obituary'] !== ''
    )
      this.canCreatePerson = true;
  }

  // Method to handle when user inputs a change to a plot property, updates our current personData
  updatePlotField(propertyName: string, value: any) {
    // Show changes have been made, different for plot_state
    if (propertyName !== 'plot_state')
      this.changesMade = true;

    // Update plotStatusChange if needed
    else
      this.plotStatusChange = true;

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
        if (castedFile.type !== 'image/webp') {
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

  // Clear currently uploaded file
  clearFile(imageType: string) {
    // Show changes have been made
    this.changesMade = true;
    
    // Clear portrait file
    if (imageType === 'portrait') {
      this.portraitFileUploaded = false;
      this.portraitImageSrc = null;
      this.portraitInvalidFileType = false;
      this.personData['portrait_image_url'] = null;
    }

    // Clear landscape file
    else if (imageType === 'landscape') {
      this.landscapeFileUploaded = false;
      this.landscapeImageSrc = null;
      this.landscapeInvalidFileType = false;
      this.personData['landscape_image_url'] = null;
    }
  }

  // Open confirmation popup
	showPopup(content: TemplateRef<any>) {
		this.modalService.open(content, { 
      backdrop: 'static', 
      animation: true, 
      centered: true 
    }).result.then();
	}

  // Save changes to database
  async onSave() {
    // We are creating a new person to occupy this plot, so POST
    if (this.isNewPerson) {
      // Update plot if we are just changing its status
      if (this.plotStatusChange && !this.changesMade) {
        try {
          // Remove plot_id from the update fields
          delete this.plotData.plot_id

          // Update plot
          await this.apiService.putData('plot/' + this.selectedPlotId + '/', this.plotData);

          // Show confirmation if we make it this far
          this.showPopup(this.confirmationTemplate);
        } catch(error) {
          // Show failure if there is an issue
          this.showPopup(this.failTemplate);
        }
      }

      // Show that we've tried to create a person, show invalid fields if applicable
      else if (this.changesMade) {
        this.hasTriedToCreatePerson = true;

        // Check that required fields are filled out before creation
        if (this.canCreatePerson) {
          try {
            // Upload images
            await this.uploadImages();

            // Remove person_id and plot_id from the create fields
            delete this.personData.person_id;
            delete this.plotData.plot_id

            // Create person and then update plot to reference this new person 
            const response = await this.apiService.postData('persons/', this.personData);
            const newPersonId = response.person_id;

            // Ensure reference to new person
            this.plotData['person_id'] = newPersonId;

            // Update plot with new person reference
            await this.apiService.putData('plot/' + this.selectedPlotId + '/', this.plotData);

            // Show confirmation if we make it this far
            this.showPopup(this.confirmationTemplate);
          } catch(error) {
            // Show failure if there is an issue
            this.showPopup(this.failTemplate);
          }
        }

        // Return for invalid fields
        else
          return;
      }
    }

    // We are updating the person already in this plot, so PUT
    else {
      try {
        // Upload images
        await this.uploadImages();

        // Save person_id to variable before deletion
        const personId = this.personData.person_id;

        // Remove plot_id and person_id from update fields
        delete this.plotData.plot_id
        delete this.personData.person_id;

        // Update plot and then person
        await this.apiService.putData('plot/' + this.selectedPlotId + '/', this.plotData);
        await this.apiService.putData('person/' + personId + '/', this.personData);

        // Show confirmation if we make it this far
        this.showPopup(this.confirmationTemplate);

      } catch(error) {
        // Show failure if there is an issue
        this.showPopup(this.failTemplate);
      }
    }

    // Refresh data and map
    await this.getSextonContentData(this.selectedPlotId, false);
    await this.mapService.mapInstance?.refreshMap('');
  }

  // Remove a person from a plot and delete them
  async onDelete() {
    try {
      // Save person_id and update plot to remove its refrence to person
      const personId = this.plotData['person_id']
      delete this.plotData.plot_id;
      this.plotData['person_id'] = null;
      this.plotData['plot_state'] = 1;
      await this.apiService.putData('plot/' + this.selectedPlotId + '/', this.plotData);

      // Delete person
      await this.apiService.deleteData('person/' + personId + '/');

      // Show confirmation if we make it this far
      this.showPopup(this.confirmationTemplate);
    } catch(error) {
      // Show failure if there is an issue
      this.showPopup(this.failTemplate);
    }

    // Refresh data and map
    this.getSextonContentData(this.selectedPlotId, false);
    this.mapService.mapInstance?.refreshMap('');
  }

  // Method to upload images to databse
  async uploadImages() {
    // Upload portrait image if available
    if (this.portraitFileUploaded && this.portraitFile !== null) {
      try {
        // Call uploadFile to upload file to database and save name to response.fileName
        // Create FormData object and clean file name
        // Create a new File object with the same content but a modified name - Remove spaces
        const modifiedPortraitFile = new File(
          [this.portraitFile], 
          this.portraitFile['name'].replaceAll(' ', ''), {  // Clean file name
          type: this.portraitFile.type,
          lastModified: this.portraitFile.lastModified
        });
        const portraitFormData = new FormData();
        portraitFormData.append('image', modifiedPortraitFile); 

        // Upload modifiedPortraitFile
        const response = await this.apiService.uploadFile('file/upload/image/', portraitFormData);

        // Assign the file object to personData['portrait_image_url']
        this.personData['portrait_image_url'] = this.globalService.IMAGE_URL + '/' + response.fileName;
      } catch (error) {
        // Something broke lol
        console.error('Error uploading portrait image: ', error);
      }      
    }

    // Upload landscape image if available
    if (this.landscapeFileUploaded && this.landscapeFile !== null) {
      try {
        // Call uploadFile to upload file to database and save name to response.fileName
        // Create FormData object and clean file name
        // Create a new File object with the same content but a modified name - Remove spaces
        const modifiedLandscapeFile = new File(
          [this.landscapeFile], 
          this.landscapeFile['name'].replaceAll(' ', ''), {  // Clean file name
          type: this.landscapeFile.type,
          lastModified: this.landscapeFile.lastModified
        });
        const landscapeFormData = new FormData();
        landscapeFormData.append('image', modifiedLandscapeFile); 

        // Upload modifiedPortraitFile
        const response = await this.apiService.uploadFile('file/upload/image/', landscapeFormData);

        // Assign the file object to personData['landscape_image_url']
        this.personData['landscape_image_url'] = this.globalService.IMAGE_URL + '/' + response.fileName;
      } catch (error) {
        // Something broke lol - Losing sanity
        console.error('Error uploading landscape image: ', error);
      }      
    }
  }

  easterEgg(reset: boolean) {
    if (reset)
      this.warningCount = 0;
    else
      this.warningCount++;
  }
}
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Application } from '../../../../../interfaces/application';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { isEqual, cloneDeep } from 'lodash';
import { TooltipModule } from 'primeng/tooltip';
import { ApplicationOptionGroup } from '../../../../../interfaces/application-optiongroup';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ApplicationOptionGroupItem } from '../../../../../interfaces/application-optiongroup-item';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';
import { LdapObject } from '../../../../../interfaces/ldap-object';
import { LdapServer } from '../../../../../interfaces/ldap-server';
import { Access } from '../../../../../interfaces/access';
import { UtilsService } from '../../../../../services/utils.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-application-page',
  imports: [
    ToastModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    KeyFilterModule,
    CardModule,
    CheckboxModule,
    TagModule,
    ButtonModule,
    DialogModule,
    ChipModule,
    DividerModule,
    InputGroupAddonModule,
    InputGroupModule,
    AccordionModule,
    TableModule,
    TooltipModule,
    SelectModule,
    ProgressSpinnerModule,
    SkeletonModule,
    FloatLabelModule,
    TextareaModule,
    MessageModule,
    AvatarModule,
    TooltipModule,
    FileUploadModule,
    ToggleSwitchModule,
  ],
  templateUrl: './application-page.component.html',
  styleUrl: './application-page.component.css',
  providers: [ApiService, MessageService],
})
export class ApplicationPageComponent {
  @ViewChild('optionGroupTable') optionGroupTable!: Table; // Reference to the table
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  application: Application | null = null;
  applicationOriginal: Application | null = null;

  addPathString: string = '';
  addHashString: string = '';

  selectedFileHash: string = '';

  temp: string = '';

  showDeleteModal: boolean = false;
  showConfigModal: boolean = false;

  selectedApplicationOptionGroup: ApplicationOptionGroup | null = null;
  applicationOptionGroups: ApplicationOptionGroup[] = [];
  originalApplicationOptionGroups: ApplicationOptionGroup[] = [];
  loadingApplicationOptionGroups: boolean = true;

  selectedApplicationOptionGroupItem: ApplicationOptionGroupItem | null = null;
  applicationOptionGroupItems: ApplicationOptionGroupItem[] = [];
  originalApplicationOptionGroupItems: ApplicationOptionGroupItem[] = [];
  loadingApplicationOptionGroupItems: boolean = true;

  editApplicationOptionGroup: boolean = false;
  editApplicationOptionGroupItem: boolean = false;
  editApplicationName: boolean = false;

  ldapObjects: LdapObject[] = [];
  selectedLdapObject: LdapObject | null = null;
  // selectedLdapObject2: string | undefined;
  loadingLdapObjects: boolean = false;

  authSources: LdapServer[] = [];
  selectedAuthSource: LdapServer | null = null;
  loadingAuthSources: boolean = false;

  accessRights: Access[] = [];
  loadingAccessRights: boolean = false;
  groupedAccessRights: { name: string; rights: Access[] }[] = [];

  loadingAddAccess: boolean = false;

  sensitiveDialogVisible: boolean = false;
  selectedSensitivePart: number[] = [];

  // path: string = '';
  // multiple_paths: string[] = [];
  // multiplePathEnabled: boolean = false;

  // hash: string = '';
  // multiple_hashes: string[] = [];
  // multipleHashEnabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private messageService: MessageService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    // this.selectedLdapObject = {dn: "test", name:"test", uuid: "abc", id: "testid", type: "user"}
    // this.selectedLdapObject2 = "abc";

    var id = this.route.snapshot.paramMap.get('id');
    if (id) {
      if (id == 'new') {
        this.application = {
          id: -1,
          name: 'New Application name',
          path: [],
          hash: [],
          check_hash: false,
          allow_request_access: true,
          multiple_processes: false,
          disabled: false,
        };
        this.applicationOriginal = cloneDeep(this.application);
      } else if (!isNaN(Number(id))) {
        this.fetchApplication(id);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Application ID',
          detail: 'Please provide a valid Application ID.',
        });
        this.router.navigate(['../../'], { relativeTo: this.route });
      }
    }

    // // Observable (use if the id might change while this component is active)
    // this.route.paramMap.subscribe(params => {
    //   this.applicationId = params.get('id');
    //   console.log('Application ID:', this.applicationId); // Debugging
    // });
  }

  isValidPath(path: string): boolean {
    // console.log('Path Value:', path, typeof path);

    path = path || '';

    if (path == '') {
      return false;
    }

    // Define regex patterns
    const windowsPathRegex =
      /^[a-zA-Z]:\\(?:[^<>:"/\\|?*\n]+\\)*[^<>:"/\\|?*\n]*$/;
    const unixPathRegex = /^(\/[^<>:"|?*\n]+)*\/?$/;

    // Validate against patterns
    const isWindowsPath = windowsPathRegex.test(path);
    const isUnixPath = unixPathRegex.test(path);

    // console.log('Windows Path Valid:', isWindowsPath);
    // console.log('Unix Path Valid:', isUnixPath);
    // console.log(isWindowsPath || isUnixPath)

    return isWindowsPath || isUnixPath;
  }

  areValidPaths(paths: string[]): boolean {
    return paths.every((path) => this.isValidPath(path));
  }

  isValidHash(hash: string): boolean {
    const md5Regex = /^[a-fA-F0-9]{32}$/;
    return md5Regex.test(hash);
  }

  areValidHash(hashes: string[]): boolean {
    return hashes.every((hash) => this.isValidHash(hash));
  }

  onFileSelect(event: any): void {
    console.log('File selected: ' + event.target);
  }

  addPath(path: string): void {
    if (this.isValidPath(path) && !this.application?.path.includes(path)) {
      this.application?.path.push(path);
      this.addPathString = '';
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: '"' + path + '" is an invalid path or already available',
      });
    }
  }

  addHash(hash: string): void {
    if (this.isValidHash(hash) && !this.application?.hash.includes(hash)) {
      this.application?.hash.push(hash);
      this.addHashString = '';
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: '"' + hash + '" is an invalid hash or already available',
      });
    }
  }

  saveApplication() {
    console.log('Saving application');
    if (this.application) {
      if (this.application.id == -1) {
        this.apiService.addApplication(this.application).subscribe(
          (response) => {
            console.log(response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully added application',
            });
            this.router.navigate(['../../'], { relativeTo: this.route });
          },
          (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while adding the application',
            });
          }
        );
      } else {
        this.apiService.updateApplication(this.application).subscribe(
          (response) => {
            console.log(response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully updated application',
            });
            this.applicationOriginal = cloneDeep(this.application);
          },
          (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while saving the application',
            });
            // this.apps = [];
          }
        );
      }
    }
  }

  deleteApplication(application: Application): void {
    if (this.application) {
      this.apiService.deleteApplication(this.application).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while saving the application',
          });
          // this.apps = [];
        }
      );
    }
    console.log('Deleting application: ' + application);
  }

  anythingOk(): boolean {
    // path
    if (this.application) {
      if (!this.areValidPaths(this.application.path)) {
        return false;
      }
      if (!this.areValidHash(this.application.hash)) {
        return false;
      }
    }
    if (isEqual(this.application, this.applicationOriginal)) {
      return false;
    }

    // if (isEqual(this.application, this.applicationOriginal) && isEqual(this.applicationOptionGroups, this.originalApplicationOptionGroups) && isEqual(this.applicationOptionGroupItems, this.originalApplicationOptionGroupItems)) {
    //   return false;
    // }

    return true;
  }

  removePathFromObject(selectedPath: string): void {
    if (this.application) {
      console.log('Removing path: ' + selectedPath);
      console.log(
        this.application.path.splice(
          this.application.path.indexOf(selectedPath),
          1
        )
      );
    }
  }

  removeHashFromObject(selectedHash: string): void {
    if (this.application) {
      for (let hash of this.application.hash) {
        console.log('Removing hash: ' + selectedHash);
        this.application.hash.splice(
          this.application.hash.indexOf(selectedHash),
          1
        );
        break;
      }
    }
  }

  fetchApplication(applicationId: string) {
    this.application = null;
    this.apiService.getApplication(applicationId).subscribe(
      (response) => {
        console.log(response);
        this.application = response.data;
        this.applicationOriginal = cloneDeep(this.application);
        if (this.application) {
          console.log(this.application);
          this.fetchApplicationOptionGroups(this.application.id);
        }

        // fetch the authServers
        this.fetchAuthSources();
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching applications',
        });
        // this.apps = [];
      }
    );
  }

  fetchApplicationOptionGroups(
    applicationId: number,
    selectedGroupId?: number
  ) {
    this.apiService.getApplicationOptionGroups(applicationId).subscribe(
      (response) => {
        console.log(response);
        this.applicationOptionGroups = response.data;
        this.originalApplicationOptionGroups = cloneDeep(
          this.applicationOptionGroups
        );
        this.loadingApplicationOptionGroups = false;

        // If a specific group ID was provided, reselect it
        if (selectedGroupId) {
          this.selectedApplicationOptionGroup =
            this.applicationOptionGroups.find(
              (group) => group.id === selectedGroupId
            ) || this.applicationOptionGroups[0];
        } else {
          this.selectedApplicationOptionGroup = this.applicationOptionGroups[0];
        }

        if (this.selectedApplicationOptionGroup) {
          this.fetchApplicationOptionGroupItems(
            this.application!.id,
            this.selectedApplicationOptionGroup.id
          );
        }
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching applications option groups',
        });
      }
    );
  }

  onApplicationOptionGroupChange(event: any) {
    console.log(event);
    this.fetchApplicationOptionGroupItems(this.application!.id, event.value.id);
  }

  fetchApplicationOptionGroupItems(applicationId: number, groupId: number) {
    if (groupId !== -1) {
      this.loadingApplicationOptionGroupItems = true;
      this.selectedApplicationOptionGroupItem = null;
      this.applicationOptionGroupItems = [];

      this.apiService
        .getApplicationOptionGroupItems(applicationId, groupId)
        .subscribe(
          (response) => {
            this.applicationOptionGroupItems = response.data;
            this.originalApplicationOptionGroupItems = cloneDeep(
              this.applicationOptionGroupItems
            );
            this.loadingApplicationOptionGroupItems = false; // Stop loading after data is fetched

            // if (this.applicationOptionGroupItems.length > 0) {
            //   this.selectedApplicationOptionGroupItem =
            //     this.applicationOptionGroupItems[0];
            // }
            this.fetchAccess(this.selectedApplicationOptionGroup);
          },
          (error) => {
            this.applicationOptionGroupItems = [];
            this.loadingApplicationOptionGroupItems = false; // Stop loading even in case of error
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while fetching application option group items',
            });
          }
        );
    }
  }

  saveApplicationOptionGroupItemsChanges(item: ApplicationOptionGroupItem) {
    if (item.id === -1) {
      // Add new item
      this.apiService
        .addApplicationOptionGroupItem(
          this.application!.id,
          this.selectedApplicationOptionGroup!.id,
          item
        )
        .subscribe(
          (response) => {
            console.log('Item Added:', response);
            this.fetchApplicationOptionGroupItems(
              this.application!.id,
              this.selectedApplicationOptionGroup!.id
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Item added successfully',
            });
          },
          (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add item',
            });
          }
        );
    } else {
      // Update existing item
      this.apiService
        .updateApplicationOptionGroupItem(
          this.application!.id,
          this.selectedApplicationOptionGroup!.id,
          item
        )
        .subscribe(
          (response) => {
            console.log('Item Updated:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Item updated successfully',
            });
          },
          (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update item',
            });
          }
        );
    }
  }

  deleteApplicationOptionGroup() {
    if (this.selectedApplicationOptionGroup) {
      // Confirm deletion
      if (
        confirm(
          `Are you sure you want to delete the group "${this.selectedApplicationOptionGroup.name}"?`
        )
      ) {
        this.apiService
          .deleteApplicationOptionGroup(
            this.application!.id,
            this.selectedApplicationOptionGroup.id
          )
          .subscribe(
            (response) => {
              console.log('Option Group Deleted:', response);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Option Group deleted successfully',
              });
              this.fetchApplicationOptionGroups(this.application!.id);
              this.selectedApplicationOptionGroup = null; // Deselect after deletion
            },
            (error) => {
              console.error(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete Option Group',
              });
            }
          );
      }
    }
  }

  deleteApplicationOptionGroupItem(item: ApplicationOptionGroupItem) {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      this.apiService
        .deleteApplicationOptionGroupItem(
          this.application!.id,
          this.selectedApplicationOptionGroup!.id,
          item.id
        )
        .subscribe(
          (response) => {
            console.log('Item Deleted:', response);
            this.fetchApplicationOptionGroupItems(
              this.application!.id,
              this.selectedApplicationOptionGroup!.id
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Item deleted successfully',
            });
          },
          (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete item',
            });
          }
        );
    }
  }

  newApplicationOptionGroup() {
    // Create a new option group with a default name
    const newGroup: ApplicationOptionGroup = {
      id: -1,
      name: 'New Group Name',
      description: '',
    };

    // Add it to the list of option groups
    this.applicationOptionGroups.push(newGroup);

    // Select the new group and enable edit mode
    this.selectedApplicationOptionGroup = newGroup;
    this.applicationOptionGroupItems = [];
    this.editApplicationOptionGroup = true;
  }

  newApplicationOptionGroupItem() {
    if (this.selectedApplicationOptionGroup) {
      const newItem: ApplicationOptionGroupItem = {
        id: -1,
        name: '',
        sensitive: false,
        value: '',
      };

      // Add the new item to the array
      this.applicationOptionGroupItems.push(newItem);

      this.selectedSensitivePart = [];
      this.selectedApplicationOptionGroupItem = newItem;

      // Wait for the view to update, then open the row in edit mode
      setTimeout(() => {
        const rowIndex = this.applicationOptionGroupItems.length - 1;
        this.optionGroupTable.initRowEdit(newItem);
      });
    }
  }

  applicationOptionGroupChanged(): boolean {
    if (
      !isEqual(
        this.applicationOptionGroups,
        this.originalApplicationOptionGroups
      )
    ) {
      return true;
    }

    return false;
  }

  applicationOptionGroupItemChanged(): boolean {
    if (
      !isEqual(
        this.applicationOptionGroupItems,
        this.originalApplicationOptionGroupItems
      )
    ) {
      return true;
    }

    return false;
  }

  applicationOptionChanged(): boolean {
    if (
      this.applicationOptionGroupItemChanged() ||
      this.applicationOptionGroupChanged()
    ) {
      return true;
    }

    return false;
  }

  cancelApplicationOptionGroupChanges(): void {
    // Restore the original state of option groups and items
    this.applicationOptionGroups = cloneDeep(
      this.originalApplicationOptionGroups
    );
    this.applicationOptionGroupItems = cloneDeep(
      this.originalApplicationOptionGroupItems
    );

    // Reselect the previously selected group
    if (this.selectedApplicationOptionGroup) {
      this.selectedApplicationOptionGroup =
        this.applicationOptionGroups.find(
          (group) => group.id === this.selectedApplicationOptionGroup!.id
        ) || null;

      // Re-fetch the items for the reselected group
      if (this.selectedApplicationOptionGroup) {
        this.fetchApplicationOptionGroupItems(
          this.application!.id,
          this.selectedApplicationOptionGroup.id
        );
      }
    }

    // Exit edit mode
    this.editApplicationOptionGroup = false;
    this.editApplicationOptionGroupItem = false;
  }

  saveApplicationOptionGroupChanges() {
    if (this.selectedApplicationOptionGroup) {
      // Store the currently selected group ID
      const selectedGroupId = this.selectedApplicationOptionGroup.id;

      if (selectedGroupId === -1) {
        // Add a new option group
        this.apiService
          .addApplicationOptionGroup(
            this.application!.id,
            this.selectedApplicationOptionGroup
          )
          .subscribe(
            (response) => {
              console.log('Option Group Added:', response);
              this.fetchApplicationOptionGroups(
                this.application!.id,
                selectedGroupId
              ); // Pass the selected group ID
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Option Group added successfully',
              });
              this.editApplicationOptionGroup = false;
            },
            (error) => {
              console.error(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add Option Group',
              });
            }
          );
      } else {
        // Update an existing option group
        this.apiService
          .updateApplicationOptionGroup(
            this.application!.id,
            this.selectedApplicationOptionGroup
          )
          .subscribe(
            (response) => {
              console.log('Option Group Updated:', response);
              this.fetchApplicationOptionGroups(
                this.application!.id,
                selectedGroupId
              ); // Pass the selected group ID
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Option Group updated successfully',
              });
              this.editApplicationOptionGroup = false;
            },
            (error) => {
              console.error(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update Option Group',
              });
            }
          );
      }
    }
  }

  onRowEditInit(groupitem: ApplicationOptionGroupItem) {
    // this.selectedApplicationOptionGroupItem = cloneDeep(groupitem);
    console.log('onRowEditInit');
  }

  onRowEditSave(groupitem: ApplicationOptionGroupItem) {
    if (!groupitem.name || !groupitem.value) {
      // Show error message and prevent closing the edit mode
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid values. Please fill in all required fields.',
      });
      this.optionGroupTable.initRowEdit(groupitem);
      return;
    }

    // Call your save function
    this.saveApplicationOptionGroupItemsChanges(groupitem);
  }

  onRowEditCancel(groupitem: ApplicationOptionGroupItem, index: number) {
    // Find the original item in the original array by ID
    const originalItem = this.originalApplicationOptionGroupItems.find(
      (item) => item.id === groupitem.id
    );

    // If the original item exists, restore its values
    if (originalItem) {
      this.applicationOptionGroupItems[index] = cloneDeep(originalItem);
    }

    // Remove the item from the table's editing state
    delete this.optionGroupTable.editingRowKeys[groupitem.id];

    console.log('Row edit canceled');
  }

  onRowDelete(groupitem: ApplicationOptionGroupItem) {
    // If the item is newly added (id < 0), just remove it from the array
    if (groupitem.id < 0) {
      this.applicationOptionGroupItems =
        this.applicationOptionGroupItems.filter((item) => item !== groupitem);
    } else {
      // Otherwise, call the API to delete the item
      this.deleteApplicationOptionGroupItem(groupitem);
    }
  }

  onSearchInput(event: any) {
    if (!event || !event.value) {
      return;
    }
    const query = event.value;
    // console.log(query)

    // Only perform search if the input length is 2 or more characters
    if (query.length < 2) {
      return;
    }
    console.log(event.originalEvent);
    // Call the LDAP search method
    if (event.originalEvent instanceof InputEvent) {
      if (this.selectedAuthSource) {
        this.searchAuthSource(this.selectedAuthSource?.id, query);
      }
    }
  }

  // Search LDAP using the API service
  searchAuthSource(authSourceID: number, query: string) {
    this.loadingLdapObjects = true;

    this.apiService.searchLdap(authSourceID, query).subscribe(
      (response) => {
        // console.log(response);
        this.ldapObjects = response.data;
        // this.authSearch = response.data.map((item: any) => ({
        //   name: item.id,
        //   uuid: item.uuid,
        //   type: item.type,
        // }));
        this.loadingLdapObjects = false;
        console.log(this.ldapObjects);
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while searching for ' + query,
        });
        this.loadingLdapObjects = false;
      }
    );
  }

  // onFocusAuthServer(event: any) {
  //   console.log(event);

  //   if (this.authSources.length == 0) {
  //     this.fetchAuthSources();
  //   }
  // }

  fetchAuthSources() {
    this.ldapObjects = [];
    this.loadingAuthSources = true;

    this.apiService.getAuthSource().subscribe(
      (response) => {
        console.log(response);
        this.authSources = response.data;
        this.loadingAuthSources = false;
        this.fetchAccess(this.selectedApplicationOptionGroup);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetchign the auth sources',
        });
        this.loadingAuthSources = false;
      }
    );
  }

  // // addAccess for grouped
  // addAccess(
  //   applicationOptionGroup: ApplicationOptionGroup,
  //   identity: LdapObject,
  //   authSource: LdapServer
  // ) {
  //   // console.log(applicationOptionGroup.name);
  //   // console.log(identity.name);
  //   // console.log(authSource.name);

  //   this.loadingAddAccess = true;
  //   this.apiService
  //     .addAccessRight(authSource.id, identity.uuid, applicationOptionGroup.id)
  //     .subscribe(
  //       (response) => {
  //         console.log(response);
  //         this.loadingAddAccess = false;
  //       },
  //       (error) => {
  //         console.log(error);
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail:
  //             'Error while fetching the access rights: ' + error.error.message,
  //         });

  //         this.loadingAddAccess = false;
  //       }
  //     );
  // }

  addAccess(
    applicationOptionGroup: ApplicationOptionGroup,
    identity: LdapObject,
    authSource: LdapServer
  ) {
    this.loadingAddAccess = true;

    this.apiService
      .addAccessRight(authSource.id, identity.uuid, applicationOptionGroup.id)
      .subscribe(
        (response) => {
          console.log('Access right added successfully:', response);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Access right added successfully',
          });

          this.loadingAddAccess = false;
          this.fetchAccess(this.selectedApplicationOptionGroup);
        },
        (error) => {
          console.error('Error adding access right:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add access right: ' + error.error.message,
          });
          this.loadingAddAccess = false;
        }
      );
  }

  // fetchAccess without grouped
  // fetchAccess(application: Application | null = null) {
  //   this.loadingAccessRights = true;

  //   // Prepare the parameters
  //   let params: { [key: string]: any } = {};
  //   if (application) {
  //     params['application_id'] = application.id;
  //   }

  //   // Call the API with the params
  //   this.apiService.getAccessRights(params).subscribe(
  //     (response) => {
  //       console.log(response);
  //       this.accessRights = response.data;
  //       this.loadingAccessRights = false;
  //     },
  //     (error) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail:
  //           'Error while fetching the access rights: ' + error.error.message,
  //       });
  //       this.loadingAccessRights = false;
  //       console.log(error);
  //     }
  //   );
  // }

  fetchAccess(applicationOptionGroup: ApplicationOptionGroup | null = null) {
    this.loadingAccessRights = true;

    let params: { [key: string]: any } = {};
    if (applicationOptionGroup) {
      params['access_to'] = applicationOptionGroup.id;
    }

    console.log(params);

    this.apiService.getAccessRights(params).subscribe(
      (response) => {
        console.log(response);

        // this.accessRights = response.data;
        // Group the access rights by authSource name
        const grouped: { [key: string]: Access[] } = {};

        for (const access of response.data) {
          // Find the corresponding auth source name from authSources
          const authSource = this.authSources.find(
            (source) => source.id === access.auth_source_id
          );
          if (authSource) {
            if (!grouped[authSource.name]) {
              grouped[authSource.name] = [];
            }
            grouped[authSource.name].push(access);
          }
        }
        // Convert the grouped object to an array
        this.groupedAccessRights = Object.entries(grouped).map(
          ([name, rights]) => ({
            name,
            rights,
          })
        );

        this.loadingAccessRights = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error while fetching the access rights: ' + error.error.message,
        });
        this.loadingAccessRights = false;
        console.log(error);
      }
    );
  }

  //removeAccess for grouped
  removeAccessRight(access: Access) {
    console.log('Removing access right: ', access);

    // Call the API to delete the access right
    this.apiService.deleteAccessRight(access.id).subscribe(
      (response) => {
        console.log('Access right removed successfully:', response);

        // Remove the access right from the groupedAccessRights array
        for (const accessArea of this.groupedAccessRights) {
          const index = accessArea.rights.findIndex(
            (item) => item.id === access.id
          );
          if (index !== -1) {
            accessArea.rights.splice(index, 1);
            // If no rights remain, remove the whole group
            if (accessArea.rights.length === 0) {
              this.groupedAccessRights = this.groupedAccessRights.filter(
                (group) => group.name !== accessArea.name
              );
            }
            break;
          }
        }

        // Show a success message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Access right removed successfully',
        });
      },
      (error) => {
        // Handle errors
        console.error('Error removing access right:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove access right: ' + error.error.message,
        });
      }
    );
  }

  getAvatarString(string: string, digits: number): string {
    return this.utilsService.getAvatarString(string, digits);
  }

  removeAppIcon() {
    this.application!.image = undefined;
    // console.log(this.application!.image)
    this.apiService.removeApplicationAppIcon(this.application!.id).subscribe({
      next: (response) => {
        console.log('Image removed successfully:', response);
        this.fetchApplication(this.application!.id.toString());
      },
      error: (err) => {
        console.error('Image removal failed:', err);
      },
    });
  }

  triggerFileUpload(): void {
    // console.log("check");
    this.fileInput.nativeElement.click();
  }

  uploadAppIcon(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Validate file size (example: max 1MB)
      if (file.size > 10_000_000) {
        console.error('File size exceeds the maximum allowed size of 10MB.');
        return;
      }

      // Optional: Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Only image files are allowed.');
        return;
      }

      // tbd upload file
      this.apiService
        .addApplicationAppIcon(this.application!.id, file)
        .subscribe({
          next: (response) => {
            console.log('Image uploaded successfully:', response);
            this.fetchApplication(this.application!.id.toString());
          },
          error: (err) => {
            console.error('Image upload failed:', err);
          },
        });
    }
  }

  toggleSensitiveDialog(item: ApplicationOptionGroupItem) {
    this.selectedApplicationOptionGroupItem = item;
    this.sensitiveDialogVisible = !this.sensitiveDialogVisible;
  }

  selectSensitivePart(stringIndex: number) {
    if (this.selectedApplicationOptionGroupItem?.sensitive) {
      console.log('Selecting char at position ', stringIndex);
      if (this.selectedSensitivePart.includes(stringIndex)) {
        this.selectedSensitivePart = this.selectedSensitivePart.filter(
          (index) => index !== stringIndex
        );
      } else {
        this.selectedSensitivePart.push(stringIndex);
      }
    }
    // creating the mask with s and h for show and hide
    // Initialize the mask with 's' (show)
    let mask = Array(
      this.selectedApplicationOptionGroupItem!.value.length
    ).fill('s');

    // Set 'h' (hide) for selected sensitive parts
    for (let i = 0; i < this.selectedSensitivePart.length; i++) {
      mask[this.selectedSensitivePart[i]] = 'h';
    }

    // Join the array back into a string
    this.selectedApplicationOptionGroupItem!.sensitive_mask = mask.join('');
  }

  checkSensitivePart(stringIndex: number): boolean {
    if (this.selectedSensitivePart.includes(stringIndex)) {
      return true;
    }
    return false;
  }

  closeSensitiveDialogVisible(item: ApplicationOptionGroupItem): void {
    console.log(this.selectedSensitivePart)
    if (item && this.selectedSensitivePart) {
      if (this.selectedSensitivePart.length > 0) {
        return;
      }
    }
    item.sensitive = false;
  }
}

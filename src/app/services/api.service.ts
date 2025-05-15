import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LdapServer } from '../interfaces/ldap-server';
import { SyslogServer } from '../interfaces/syslog-server';
import { Application } from '../interfaces/application';
import { HttpParams } from '@angular/common/http';
import { head } from 'lodash';
import { ApplicationOptionGroup } from '../interfaces/application-optiongroup';
import { ApplicationOptionGroupItem } from '../interfaces/application-optiongroup-item';
import { SmtpServer } from '../interfaces/smtp-server';
import { TwoFaSource } from '../interfaces/two-fa-source';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public apiUrl: string = this.loadApiUrl();
  // public apiUrl: string = 'http://127.0.0.1:2233';

  constructor(private http: HttpClient, public cookieService: CookieService) {
    // this.apiUrl = this.loadApiUrl();
  }

  private loadApiUrl(): string {
    return (window as any).__env?.apiUrl;
  }

  // private getHeaders(): HttpHeaders {
  //   var token = this.cookieService.get('token');

  //   return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  // }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/auth/register`, userData);
  }

  setup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/setup`, data);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/auth/login`, userData);
  }

  changePassword(current_password: string, new_password: string): Observable<any> {
    const data = {
      current_password: current_password,
      new_password: new_password
    }
    return this.http.post(`${this.apiUrl}/api/admin/auth/change-password`, data);
  }

  ping() {
    return this.http.get(this.apiUrl + '/api/ping');
  }

  authPing(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/authping`);
  }

  getAuthSource(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/authsource`);
  }

  updateAuthSource(server: LdapServer): Observable<any> {
    const { id, ...data } = server;

    return this.http.put(
      `${this.apiUrl}/api/admin/authsource/${server.id}`,
      data);
  }

  addAuthSource(server: LdapServer): Observable<any> {
    console.log(server);
    const { id, ...data } = server;
    return this.http.post(
      `${this.apiUrl}/api/admin/authsource`,
      data,
    );
  }

  deleteAuthSource(server: LdapServer): Observable<any> {
    console.log(server);
    return this.http.delete(
      `${this.apiUrl}/api/admin/authsource/${server.id}`);
  }

  testAuthSource(
    server?: LdapServer,
    byID: boolean = false,
    id: number | undefined = undefined
  ): Observable<any> {

    if (byID && id) {
      return this.http.post(
        `${this.apiUrl}/api/admin/authsource/test`,
        { manualID: id }
      );
    }
    // console.log(data);
    return this.http.post(
      `${this.apiUrl}/api/admin/authsource/test`,
      server
    );
  }


  getSyslogServer(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/syslog`);
  }

  updateSyslogServer(server: SyslogServer): Observable<any> {
    const { id, ...payload} = server;
    return this.http.put(
      `${this.apiUrl}/api/admin/syslog/${server.id}`,
      payload
    );
  }

  addSyslogServer(server: SyslogServer): Observable<any> {
    const { id, ...payload} = server;
    return this.http.post(`${this.apiUrl}/api/admin/syslog`, payload);
  }

  deleteSyslogServer(server: SyslogServer): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/admin/syslog/${server.id}`
    );
  }

  getSmtpServer(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/smtp`);
  }

  updateSmtpServer(server: SmtpServer): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/admin/smtp/${server.id}`,
      server
    );
  }

  addSmtpServer(server: SmtpServer): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/smtp`, server);
  }

  deleteSmtpServer(server: SmtpServer): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/admin/smtp/${server.id}`
    );
  }

  getApplication(applicationId?: string): Observable<any> {

    // If applicationId is provided, add it as a query parameter
    const url = applicationId
      ? `${this.apiUrl}/api/admin/application?id=${applicationId}`
      : `${this.apiUrl}/api/admin/application`;

    return this.http.get(url);
  }

  updateApplication(app: Application): Observable<any> {
    const { id,image, ...payload } = app;
    return this.http.put(
      `${this.apiUrl}/api/admin/application/${app.id}`,
      payload
    );
  }

  addApplication(app: Application): Observable<any> {
    const { id,image, ...payload } = app;
    return this.http.post(
      `${this.apiUrl}/api/admin/application`,
      payload
    );
  }

  deleteApplication(app: Application): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/admin/application/${app.id}`
    );
  }

  // Get all option groups for a specific application
  getApplicationOptionGroups(applicationId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/admin/application/${applicationId}/optiongroup`
    );
  }

  // Add a new option group to a specific application
  addApplicationOptionGroup(
    applicationId: number,
    group: ApplicationOptionGroup
  ): Observable<any> {

    const { id, ...payload } = group; // remove the id from the object

    return this.http.post(
      `${this.apiUrl}/api/admin/application/${applicationId}/optiongroup`,
      payload
    );
  }

  // Update an option group for a specific application
  updateApplicationOptionGroup(
    applicationId: number,
    group: ApplicationOptionGroup
  ): Observable<any> {

    const { id, created_at, updated_at, ...payload } = group; // remove the id from the object

    return this.http.put(
      `${this.apiUrl}/api/admin/application/${applicationId}/optiongroup/${group.id}`,
      payload
    );
  }

  // Delete an option group from a specific application
  deleteApplicationOptionGroup(
    applicationId: number,
    groupId: number
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/admin/application/${applicationId}/optiongroup/${groupId}`
    );
  }

  // Get all items in a specific option group
  getApplicationOptionGroupItems(
    applicationId: number,
    groupId: number
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/admin/application/${applicationId}/optiongroup/${groupId}/item`
    );
  }

  // Add a new item to a specific option group
  addApplicationOptionGroupItem(
    applicationId: number,
    groupId: number,
    item: ApplicationOptionGroupItem
  ): Observable<any> {

    const { id, ...payload } = item; // remove the id from the object

    return this.http.post(
      `${this.apiUrl}/api/admin/application/${applicationId}/optiongroup/${groupId}/item`,
      payload
    );
  }

  // Update an item in a specific option group
  updateApplicationOptionGroupItem(
    applicationId: number,
    groupId: number,
    item: ApplicationOptionGroupItem
  ): Observable<any> {

    const { id, ...payload } = item; // remove the id from the object

    return this.http.put(
      `${this.apiUrl}/api/admin/application/${applicationId}/optiongroup/${groupId}/item/${item.id}`,
      payload
    );
  }

  // Delete an item from a specific option group
  deleteApplicationOptionGroupItem(
    applicationId: number,
    groupId: number,
    itemId: number
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/admin/application/${applicationId}/optiongroup/${groupId}/item/${itemId}`
    );
  }

  getLogs(
    level: string = '',
    page: number = 1,
    perPage: number = 10,
    sortField: string = 'timestamp',
    sortOrder: string = 'desc',
    searchString: string = ''
  ): Observable<any> {
    const headers = new HttpHeaders();
    console.log(sortOrder)
    console.log(sortField)

    const params = new HttpParams()
      .set('level', level)
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('sort_field', sortField)
      .set('sort_order', sortOrder)
      .set('search_string', searchString);

    const options = { headers, params };

    return this.http.get(`${this.apiUrl}/api/admin/logs`, options);
  }

  searchLdap(
    authSourceId: number,
    query: string = '',
    uuid: string = '',
    searchType: string = 'all',
    username: string = ''
  ): Observable<any> {
    const params = new HttpParams()
      .set('auth_source_id', authSourceId.toString())
      .set('query', query)
      .set('uuid', uuid)
      .set('search_type', searchType)
      .set('username', username);
    return this.http.get(`${this.apiUrl}/api/admin/authsource/search`, { params });
  }

  addAccessRight(
    authSourceId: number,
    objectUuid: string,
    accessTo: number
  ): Observable<any> {
    const body = {
      auth_source_id: authSourceId,
      object_uuid: objectUuid,
      access_to: accessTo,
    };
    return this.http.post(`${this.apiUrl}/api/admin/access`, body);
  }

  getAccessRights(params: { [key: string]: any } = {}): Observable<any> {
    let httpParams = new HttpParams();
    // Dynamically set query parameters
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    // Make the HTTP GET request
    return this.http.get(`${this.apiUrl}/api/admin/access`, { params: httpParams });
  }

  deleteAccessRight(accessRightId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/admin/access/${accessRightId}`);
  }

  sendMail(message: string, to: string, caption: string): Observable<any> {
    var data = {
      message: message,
      to: to,
      caption: caption
    }
    return this.http.post(`${this.apiUrl}/api/admin/mail`, data);
  }

  addApplicationAppIcon(application_id: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image); // Append the image file

    return this.http.post(`${this.apiUrl}/api/admin/application/${application_id}/image`, formData);

  }

  removeApplicationAppIcon(application_id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/admin/application/${application_id}/image`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/user`);
  }

  getTwoFaSource(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/twofa`);
  }

  addTwoFaSource(source: TwoFaSource): Observable<any> {
    const { id, ...payload } = source;
    return this.http.post(`${this.apiUrl}/api/admin/twofa`, payload);
  }

  updateTwoFaSource(source: TwoFaSource): Observable<any> {
    const { id, ...payload } = source;
    return this.http.put(`${this.apiUrl}/api/admin/twofa/${id}`, payload);
  }

  deleteTwoFaSource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/admin/twofa/${id}`);
  }

  testTwoFa(username: string, code: string): Observable<any> {
    const data = {
      user: username,
      code: code
    }
    return this.http.post(`${this.apiUrl}/api/admin/twofa/validate`, data);
  }


}

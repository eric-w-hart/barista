import { ChartElementDto } from '@app/shared/api/model/chart-element-dto';

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { ProjectStatusType } from '../model/project-status-type';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class StatsApiService {

    protected basePath = 'http://localhost/api/v1';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }

    /**
     * Retrieve Stats/Components
     * @param id
     * @param fields &lt;h4&gt;Selects fields that should be returned in the reponse body.&lt;/h4&gt;&lt;i&gt;Syntax:&lt;/i&gt; &lt;strong&gt;?fields&#x3D;field1,field2,...&lt;/strong&gt; &lt;br/&gt;&lt;i&gt;Example:&lt;/i&gt; &lt;strong&gt;?fields&#x3D;email,name&lt;/strong&gt;
     * @param join &lt;h4&gt;Receive joined relational objects in GET result (with all or selected fields).&lt;/h4&gt;&lt;i&gt;Syntax:&lt;/i&gt;&lt;ul&gt;&lt;li&gt;&lt;strong&gt;?join[]&#x3D;relation&lt;/strong&gt;&lt;/li&gt;&lt;li&gt;&lt;strong&gt;?join[]&#x3D;relation||field1,field2,...&lt;/strong&gt;&lt;/li&gt;&lt;li&gt;&lt;strong&gt;?join[]&#x3D;relation1||field11,field12,...&amp;join[]&#x3D;relation1.nested||field21,field22,...&amp;join[]&#x3D;...&lt;/strong&gt;&lt;/li&gt;&lt;/ul&gt;&lt;br/&gt;&lt;i&gt;Examples:&lt;/i&gt;&lt;/i&gt;&lt;ul&gt;&lt;li&gt;&lt;strong&gt;?join[]&#x3D;profile&lt;/strong&gt;&lt;/li&gt;&lt;li&gt;&lt;strong&gt;?join[]&#x3D;profile||firstName,email&lt;/strong&gt;&lt;/li&gt;&lt;li&gt;&lt;strong&gt;?join[]&#x3D;profile||firstName,email&amp;join[]&#x3D;notifications||content&amp;join[]&#x3D;tasks&lt;/strong&gt;&lt;/li&gt;&lt;li&gt;&lt;strong&gt;?join[]&#x3D;relation1&amp;join[]&#x3D;relation1.nested&amp;join[]&#x3D;relation1.nested.deepnested&lt;/strong&gt;&lt;/li&gt;&lt;/ul&gt;&lt;strong&gt;&lt;i&gt;Notice:&lt;/i&gt;&lt;/strong&gt; &lt;code&gt;id&lt;/code&gt; field always persists in relational objects. To use nested relations, the parent level MUST be set before the child level like example above.
     * @param cache &lt;h4&gt;Reset cache (if was enabled) and receive entities from the DB.&lt;/h4&gt;&lt;i&gt;Usage:&lt;/i&gt; &lt;strong&gt;?cache&#x3D;0&lt;/strong&gt;
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public statsComponentsGet(fields?: string, join?: string, cache?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<ChartElementDto>> {


        let queryParameters = new HttpParams({encoder: this.encoder});
        if (fields !== undefined && fields !== null) {
            queryParameters = queryParameters.set('fields', <any>fields);
        }
        if (join !== undefined && join !== null) {
            queryParameters = queryParameters.set('join[]', <any>join);
        }
        if (cache !== undefined && cache !== null) {
            queryParameters = queryParameters.set('cache', <any>cache);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<Array<ChartElementDto>>(`${this.configuration.basePath}/stats/components`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }


    public statsComponentsScansGet(fields?: string, join?: string, cache?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<ChartElementDto>> {


        let queryParameters = new HttpParams({encoder: this.encoder});
        if (fields !== undefined && fields !== null) {
            queryParameters = queryParameters.set('fields', <any>fields);
        }
        if (join !== undefined && join !== null) {
            queryParameters = queryParameters.set('join[]', <any>join);
        }
        if (cache !== undefined && cache !== null) {
            queryParameters = queryParameters.set('cache', <any>cache);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<Array<ChartElementDto>>(`${this.configuration.basePath}/stats/components/scans`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    public statsProjectsGet(fields?: string, join?: string, cache?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<ChartElementDto>> {


        let queryParameters = new HttpParams({encoder: this.encoder});
        if (fields !== undefined && fields !== null) {
            queryParameters = queryParameters.set('fields', <any>fields);
        }
        if (join !== undefined && join !== null) {
            queryParameters = queryParameters.set('join[]', <any>join);
        }
        if (cache !== undefined && cache !== null) {
            queryParameters = queryParameters.set('cache', <any>cache);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<Array<ChartElementDto>>(`${this.configuration.basePath}/stats/projects`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    public statsProjectsScansGet(fields?: string, join?: string, cache?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<ChartElementDto>> {


        let queryParameters = new HttpParams({encoder: this.encoder});
        if (fields !== undefined && fields !== null) {
            queryParameters = queryParameters.set('fields', <any>fields);
        }
        if (join !== undefined && join !== null) {
            queryParameters = queryParameters.set('join[]', <any>join);
        }
        if (cache !== undefined && cache !== null) {
            queryParameters = queryParameters.set('cache', <any>cache);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<Array<ChartElementDto>>(`${this.configuration.basePath}/stats/projects/scans`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }
}

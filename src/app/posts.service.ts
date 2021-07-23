import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";

import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) {}

    // .subscribe is here because its not returning anything to the component. just console.log()'ing some data 
    createAndStorePost(title: string, content: string) {
        const postData: Post = { title: title, content: content};
        this.http
        // The <> defines response data types of generic HTTP verb methods is optional BUT recommended. For better autocompletion and avoid unnecessary TypeScript errors.
        .post<{ name: string }>(
            'https://angular-tcg-sect-18-http-req-default-rtdb.firebaseio.com/posts.json',
            postData,
            {
                observe: 'response'
            }
        )
        .subscribe( responseData => {
            console.log(responseData);
        }, error => {
            this.error.next(error.message);
        });
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        // reassign to && append b/c searchParams object is immutable
        // formats the response into a human readable way. In THIS project our code reads it, so not necessary
        searchParams = searchParams.append('print', 'pretty');
        // dummy query params
        searchParams = searchParams.append('custom', 'key');
        // heavy-lifting, part detached from template & UI
        return this.http
            // sending of the request
            .get<{ [key: string]: Post }>(
                'https://angular-tcg-sect-18-http-req-default-rtdb.firebaseio.com/posts.json',
                {
                    headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
                    params: searchParams,
                }
            )
            // transformation of the data
            .pipe(
                map(responseData => {
                    const postsArray: Post[] = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postsArray.push({ ...responseData[key], id: key });
                        }
                    }
                    return postsArray;
                }),
                catchError(errorRes => {
                    // errorRes is error response. Same data from 2nd arg of the .subscribe()
                    // Send to analytics server, or some generic error handling task not related to the UI (Behind the scenes)
                    // Alternative is use Subject & .next(error.message)
                    // When done handling error, need to pass something to reach .subscribe() in the app.component
                    // throwError wraps errorRes into an Observable
                    // Doesn't do anything useful, but an idea to use catchError for generic handling task you want to execute
                    return throwError(errorRes);
                })
            );
    }

    deletePosts() {
        return this.http
            .delete('https://angular-tcg-sect-18-http-req-default-rtdb.firebaseio.com/posts.json', {
                observe: 'events'
            })
            .pipe(
                tap(event => {
                    console.log(event);
                    if (event.type == HttpEventType.Sent) {
                        // .... only event.type works for .Sent
                        // These are helpful if you need control over your request status
                    }
                    if (event.type == HttpEventType.Response) {
                        console.log(event.body);
                    }
                })
            );
    }
}
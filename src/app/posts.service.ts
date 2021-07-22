import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
            postData
        )
        .subscribe( responseData => {
            console.log(responseData);
        }, error => {
            this.error.next(error.message);
        });
    }

    fetchPosts() {
        // heavy-lifting, part detached from template & UI
        return this.http
            // sending of the request
            .get<{ [key: string]: Post }>(
                'https://angular-tcg-sect-18-http-req-default-rtdb.firebaseio.com/posts.json'
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
                })
            );
    }

    deletePosts() {
        return this.http.delete('https://angular-tcg-sect-18-http-req-default-rtdb.firebaseio.com/posts.json');
    }
}
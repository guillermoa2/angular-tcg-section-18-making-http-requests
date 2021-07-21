import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {

    constructor(private http: HttpClient) {}

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
        });
    }

    fetchPosts() {
        this.http
            .get<{ [key: string]: Post }>(
                'https://angular-tcg-sect-18-http-req-default-rtdb.firebaseio.com/posts.json'
            )
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
            )
            .subscribe(posts => {
                
            });
    }
}
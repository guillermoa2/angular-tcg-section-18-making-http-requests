import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log('Request is on its way');
        // Must return the next to let the req continue & not break the app
        return next.handle(req);
    }
}
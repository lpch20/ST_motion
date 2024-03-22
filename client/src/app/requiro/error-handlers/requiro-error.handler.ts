// errors-handler.ts
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorsService } from '../services/errors.service';

@Injectable()
export class RequiroErrorHandler implements ErrorHandler {

    constructor(
        // Because the ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
        private injector: Injector,
    ) { }

    handleError(error: Error) {
        // const notificationService = this.injector.get(NotificationService);
        const errorsService = this.injector.get(ErrorsService);
        // const router = this.injector.get(Router);

        if (error instanceof HttpErrorResponse) {
            // Server error happened
            if (!navigator.onLine) {
                // No Internet connection
                // return notificationService.notify('No Internet Connection');
            } else {
                // Http Error
                // Send the error to the server
                errorsService
                    .log(error)
                    .subscribe();
                // Show notification to the user
                // return notificationService.notify(`${error.status} - ${error.message}`);
            }
        } else {
            // Client Error Happend
            // Send the error to the server and then
            // redirect the user to the page with all the info
            errorsService
                .log(error)
                .subscribe(errorWithContextInfo => {
                    // router.navigate(['/error'], { queryParams: errorWithContextInfo });
                });
        }
    }





    // if (error instanceof HttpErrorResponse) {

    //     // const notificationService = this.injector.get(NotificationService);

    //     // Server or connection error happened
    //     if (!navigator.onLine) {
    //         // Handle offline error
    //         // return notificationService.notify('No Internet Connection');
    //     } else {
    //         // Handle Http Error (error.status === 403, 404...)
    //         // return notificationService.notify(`${error.status} - ${error.message}`);

    //         const errorsService = this.injector.get(ErrorsService);

    //     }
    // } else {
    //     // Handle Client Error (Angular Error, ReferenceError...)

    //     // const router = this.injector.get(Router);
    //     // router.navigate(['/error'], { queryParams: { error: error } });

    // }



    // // log it to the console
    // console.error('It happens: ', error);
}

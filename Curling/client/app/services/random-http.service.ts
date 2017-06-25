import { Injectable } from '@angular/core';

@Injectable()
export class RandomHttpService {
    getObject(): Promise<Object> {
        return Promise.resolve({
            data: "A constant string and " + Math.random().toString()
        });
    }
}

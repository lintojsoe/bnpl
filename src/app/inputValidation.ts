import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AdditionalService } from './services/additionalService';

@Injectable()
export class ValidateInputs {
    constructor(private additionalService: AdditionalService) {}
    async inputValidation(data, name, type,id?) {
        try {
            const validate = await this.additionalService
                .getValidateInputs(type, data, name,id)
                .toPromise();
            if (validate) {
               return true
            } else {
                 return null
            }
        } catch {
        } finally {
        }
    }
}

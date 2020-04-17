import { Pipe, PipeTransform } from '@angular/core';
import { UtilitiesService } from './utilities.services';

@Pipe({
    name: 'translate'
})
export class TranslatePipe implements PipeTransform {

    constructor(private utilitiesService: UtilitiesService) { }

    transform(labelName: any, moduleName: any): string {
        const labels = this.utilitiesService.getLabels();
        return labels && labels[moduleName] && labels[moduleName][labelName] ? labels[moduleName][labelName] : 'NA';
    }
}

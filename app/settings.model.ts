export class SettingsModel
{
    loan : {name:string,zplString:string}[];
    return : {name:string,zplString:string}[];
    fee: {name:string,zplString:string}[];
    defTemplateSelctedInd: number[]; //Index of the default template selected 0 loan 1 return 2 fee

}
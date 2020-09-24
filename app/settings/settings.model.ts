export class SettingsModel
{
    selectedPrinter: string;
    loanTemplates : {name:string,zplString:string}[];
    returnTemplates : {name:string,zplString:string}[];
    feeTemplates : {name:string,zplString:string}[];
    defTemplateSelctedInd: number[]; //Index of the default template selected 0 loan 1 return 2 fee

}
export class Patient
{
  id: string = "";
  sex: string = '';
  age: number = 0;
  preconditions: string[] = [];
  preconditonsStr: string = "";
  riskScore: number = 0;
  highRisk: boolean = false;
  uploaded: Date = new Date(0);
  modified: Date = new Date(0);
  rowColour: string = "";
  phoneNumber: string = "";
  deletePatient: boolean = false;
}

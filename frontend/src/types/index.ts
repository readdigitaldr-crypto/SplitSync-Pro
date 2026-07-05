export type User={id:string;username:string;email:string;full_name:string;profile_picture_url:string;preferred_currency:string};
export type Trip={id:string;name:string;destination:string;description:string;currency:string;start_date:string;end_date:string;trip_image_url:string;status:string;members:User[]};
export type Expense={id:string;trip:string;title:string;amount:string;category:string;paid_by:string;expense_date:string;split_method:string};

import { Injectable } from '@angular/core';
import { Router, UrlHandlingStrategy } from '@angular/router';
import { Http, Response } from '@angular/http';
import { HttpParams,HttpClient } from '@angular/common/http';
import { GlobalConfig, NodeApiURL,GlobalVariable} from '../globalConfig';
import { BehaviorSubject,Observable,Subject } from 'rxjs';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
public baseApiUrl = GlobalVariable.BASE_API_URL;
public baseFolderUrl = GlobalVariable.BASE_FOLDER_URL;
  constructor(
    private router : Router,
    private http : HttpClient,
  ) { }


post(url, data){
  return this.http.post(this.baseApiUrl+url, data)
  .share()
  .map((response: Response) => {
    if(response['status'] === 501){
      
    }else {
      return response;
    }
  })
}

 // put method
 put(url, data) {
  return this.http.put(this.baseApiUrl + url, data)
    .share()
    .map((response: Response) => { console.log(response);
      if (response['status'] === 501) {
        
      } else {
        return response;
      }
    });
}

//get 
get(url, data) {
  const httpParams = this.getHttpParams(data);
  return this.http.get(this.baseApiUrl + url, { params: httpParams })
    .share()
    .map((response: Response) => { console.log(response);
      if (response['status'] === 501) {
        this.router.navigate(['login']);
      } else {
        return response;
      }
    });
}

//delete
delete(url, data) {
  const httpParams = this.getHttpParams(data);
  return this.http.delete(this.baseApiUrl + url, { params: httpParams })
    .share()
    .map((response: Response) => {
      if (response['status'] === 501) {
        
      } else {
        return response;
      }
    });
}


getHttpParams(data: any) {
  let httpParams = new HttpParams();
  Object.keys(data).forEach(function (key) {
    httpParams = httpParams.append(key, data[key]);
  });
  return httpParams;
}

}
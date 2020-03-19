
let nekosama = {
  mc: null,
  hi: null 
  };
  
nekosama.hi = {
  loadMemo: function(){nekosama.mc.loadMemo()},
  saveMemo: function(data){nekosama.mc.saveMemo(data)}
};

window.onload = ()=>{main()};

async function main(){
  document.getElementById("title").innerHTML = document.getElementById("title").innerHTML + " > " + window.location.href.split("?")[1];
  nekosama.mc = new MemoController();
  try{
    const data = await nekosama.mc.loadMemo();
    document.getElementById('memo').innerHTML = data;
    document.getElementById("memo").addEventListener("input",function(){
      document.getElementById("saveStatus").innerHTML="post ready";
      clearTimeout(nekosama.mc.saveTimerIdArray.shift());
      nekosama.mc.saveTimerIdArray.push(
        setTimeout(async function(){
          document.getElementById("saveStatus").innerHTML="posting...";
          await nekosama.mc.saveMemo((<HTMLInputElement>document.getElementById('memo')).value);
          const date_obj = new Date();
          document.getElementById("saveStatus").innerHTML="posted " + date_obj.toString();
          nekosama.mc.saveTimerIdArray.shift();
        }, 3000)
      );
    });
    document.getElementById("memo").focus();
  }catch(e){
    document.getElementById("saveStatus").innerHTML="request failed";
    throw e;
  }
}

class MemoController{
  
  URL: string;
  loadApiUrl: string;
  saveApiUrl: string;
  saveTimerIdArray: Array<number>;
  
  constructor(){
    this.URL = window.location.href;
    this.loadApiUrl = window.location.href.split(window.location.pathname)[0] + "/" + window.location.pathname.split("/")[1] + "/" + "GetText.cgi" + "?" + window.location.href.split("?")[1];
    this.saveApiUrl = window.location.href.split(window.location.pathname)[0] + "/" + window.location.pathname.split("/")[1] + "/" + "SetText.cgi" + "?" + window.location.href.split("?")[1];
    this.saveTimerIdArray = new Array();
  }
  
  loadMemo(): Promise<any>{
    return new Curd(this.loadApiUrl).get();
  }
   
  saveMemo(data): Promise<any>{
    return new Curd(this.saveApiUrl).post(data);
  }
}

class Curd{
  
  requestUrl: string;
  
  constructor(requestUrl: string){
    this.requestUrl = requestUrl;
  }
   
  get(){
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("get", this.requestUrl, true);
      xhr.onreadystatechange = function () {
         if(xhr.readyState === XMLHttpRequest.DONE) {
          if(xhr.status === 200){
            console.log(xhr.responseText);
            return resolve(xhr.responseText);
          }else{
            console.log(xhr.statusText);
            return reject(new Error(xhr.responseText));
          }
        }
      };
      xhr.send(null);
    });
    return promise;
  }
    
  post(data){
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("post", this.requestUrl, true);
      xhr.onreadystatechange = function () {
         if(xhr.readyState === XMLHttpRequest.DONE) {
          if(xhr.status === 200){
            console.log(xhr.responseText);
            return resolve(xhr.responseText);
          }else{
            console.log(xhr.statusText);
            return reject(new Error(xhr.responseText));
          }
        }
      };
      xhr.send(data);
    });
    return promise;
  }
  
}
 


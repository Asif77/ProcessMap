class MapApi {
  public static getMap() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(
          "http://localhost/UltimusProcessConfig/Api/v1.0/UltimusProcess/GetProcess"
        )
          .then(response => {
            return response.json();
          })
          .then(result => {
            console.log(result);
            resolve(Object.assign({}, result.Data));
          })
          .catch(error => {
            console.log(error);
          });
      }, 0);
    });
  }

  public static getProcessMap2(
    server: string,
    processName: string,
    version: number,
    incident: number
  ) {
    //if (process.env.NODE_ENV === 'production')
    // port = "";
    // const url = port === "" ? `${protocol}://${hostName}` : `${protocol}//${hostName}:${port}`;

    const api = `${server}/UltimusProcessConfig/Api/v1.0/UltimusProcess/GetProcessMap/?processName=${processName}&version=${version}&incident=${incident}`;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(api)
          .then(response => {
            return response.json();
          })
          .then(result => {
            console.log(result);
            resolve(Object.assign({}, result));
          })
          .catch(error => {
            console.log(error);
          });
      }, 0);
    });
  }

  public static async getLocalizedData(
    server: string,
    serverId: string,
    processName: string,
    language: string
  ) {
    try {
      const api =
        process.env.NODE_ENV === "production"
          ? `${server}/UltimusWebClient/ultapi/common/statuslocalization?serverId=${serverId}&processName=${processName}&language=${language}`
          : "http://192.168.10.73/UltimusWebClient/ultapi/common/statuslocalization?serverId=2&processName=JA&language=en";
      console.log(api);
      const response = await fetch(api);
      const data =
        response.ok === true && response.status === 200
          ? await response.json()
          : [];
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }

    // return await [
    //   {
    //     Id: 1000,
    //     LocaleType: 0,
    //     LanguageCode: "en",
    //     ServerId: 2,
    //     Label: "JA\\*",
    //     Translation: "JA ENGLISH",
    //     ParentId: null
    //   },
    //   {
    //     Id: 1001,
    //     LocaleType: 1,
    //     LanguageCode: "en",
    //     ServerId: 2,
    //     Label: "JA\\*\\Step 2",
    //     Translation: "Step 2 ENGLISH",
    //     ParentId: 1000
    //   },
    //   {
    //     Id: 1002,
    //     LocaleType: 1,
    //     LanguageCode: "en",
    //     ServerId: 2,
    //     Label: "JA\\*\\Begin",
    //     Translation: "Begin ENGLISH",
    //     ParentId: 1000
    //   },
    //   {
    //     Id: 1003,
    //     LocaleType: 1,
    //     LanguageCode: "en",
    //     ServerId: 2,
    //     Label: "JA\\*\\End",
    //     Translation: "End ENGLISH",
    //     ParentId: 1000
    //   }
    // ];
  }

  public static async getProcessMap(
    server: string,
    processName: string,
    version: number,
    incident: number
  ) {
    try {
      const api = `${server}/UltimusProcessConfig/Api/v1.0/UltimusProcess/GetProcessMap/?processName=${processName}&version=${version}&incident=${incident}`;
      const response = await fetch(api);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public static async getLocalizedData2(
    server: string,
    serverId: string,
    processName: string,
    language: string
  ) {
    const mode = "no-cors";
    const method = "GET";
    const headers = {
      "content-Type":
        "application/x-www-form-urlencoded, multipart/form-data, text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept, X-API-KEY, Access-Control-Request-Method",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE"
    };

    const api =
      "http://192.168.10.73/UltimusWebClient/ultapi/common/statuslocalization?serverId=2&processName=JA&language=en";
    //const api = `${server}/UltimusWebClient/App/BpmMap?serverId=${serverId}&processName=${processName}&language=${language}`;
    console.log(api);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(api, { method, mode, headers })
          .then(response => {
            console.log(response);
            return response.ok === true ? response.json() : [];
          })
          .then(result => {
            console.log(result);
            resolve(Object.assign({}, result));
          })
          .catch(error => {
            console.log(error);
            //throw error;
          });
      }, 0);
    });
  }

  public static saveProcessMap(map: any) {
    const api = `http://localhost/UltimusProcessConfig/Api/v1.0/UltimusProcess/SaveProcessMap/`;

    const method = "POST";
    const body = JSON.stringify(map);
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    return new Promise((resolve, reject) => {
      fetch(api, { method, headers, body })
        .then(response => {
          return response.json();
        })
        .then(result => {
          console.log(result);
          resolve(Object.assign({}, result.Data));
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
}

export default MapApi;

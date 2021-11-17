import WebSocket from 'ws';
import * as axios from 'axios';
import * as url from 'url';
import {Stream} from './stream';

const defaultPrefix = 'v1/';
const defaultAddress = 'http://localhost:8080/';

export interface Options {
  token?: string;
  // Address of the micro platform.
  // By default it connects to live. Change it or use the local flag
  // to connect to your local installation.
  address?: string;
  // Helper flag to set the url prefix of the server
  prefix?: string;
}

/**
 *
 */
export interface ClientOptions {
  token?: string;
  address: string;
  prefix: string;
}

export class Client {
  public options: ClientOptions = {
    address: defaultAddress,
    prefix: defaultPrefix,
  };

  constructor(options?: Options) {
    if (options) {
      if (options.token) {
        this.options.token = options.token;
      }
      if (options.address) {
        this.options.address = options.address;
      }
      if (typeof options.prefix == 'string') {
        this.options.prefix = options.prefix;
      }
    }
  }

  // Call enables you to access any endpoint of any service on Micro
  call<R>(service: string, endpoint: string, req?: any): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      try {
        // example curl: curl -XPOST -d '{"service": "go.micro.srv.greeter", "endpoint": "Say.Hello"}'
        //  -H 'Content-Type: application/json' http://localhost:8080/client {"body":"eyJtc2ciOiJIZWxsbyAifQ=="}
        if (req === undefined || req === null) {
          req = {};
        }

        const headers: any = {};

        if (this.options.token) {
          headers['authorization'] = 'Bearer ' + this.options.token;
        }

        const options: axios.AxiosRequestConfig = {
          method: 'post',
          //json: true,
          responseType: 'json',
          headers: headers,
          data: req,
          url: this.options.address + this.options.prefix + service + '/' + endpoint,
        };

        return axios
          .default(options)
          .then(res => {
            resolve(res.data);
          })
          .catch(error => {
            if (error.response) {
              reject(error.response.data);
              return;
            }
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  stream(service: string, endpoint: string, msg?: any): Promise<Stream> {
    return new Promise<Stream>((resolve, reject) => {
      try {
        const uri = url.parse(this.options.address as string);

        // TODO: make optional
        uri.path = '/' + this.options.prefix + service + '/' + endpoint;
        uri.pathname = '/' + this.options.prefix + service + '/' + endpoint;

        uri.protocol = (uri.protocol as string).replace('http', 'ws');

        const conn = new WebSocket(url.format(uri), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.options.token,
          },
        });

        conn.on('open', function open() {
          conn.send(JSON.stringify(msg));
          const stream = new Stream(conn, service, endpoint);
          resolve(stream);
          conn.on;
        });
        conn.on('close', function close(e, reason) {});
        conn.on('error', function err(e) {});
      } catch (e) {
        reject(e);
      }
    });
  }
}

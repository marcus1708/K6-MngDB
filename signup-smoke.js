import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from './Libs/uuid.js'

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "signup smoke report.html": htmlReport(data),
    };
}
export const options = {
    vus: 1,
    duration: '1m',
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% das requisiçoes devem responder em ate 2s
        http_req_failed: ['rate<0.01']     // 1% das requisiçoes podem ocorrer erro
    }
}

export default function () {
    const url = 'http://localhost:3333/signup'
    
    const payload = JSON.stringify({ email: `${uuid.v4().substring(24)}@teste.io`, password: 'pwd123' })
    const headers = {'headers': {'Content-Type': 'application/json'}}  
    const res = http.post(url, payload, headers)
    
    console.log(res.body)

    check(res,{
        'status should be 201': (r) => r.status === 201
    })    
    sleep(1);
}

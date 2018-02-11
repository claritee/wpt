# Example WPT setup

This contains settings for setting up 

- private Web page test instance
- running perfbudget against it

# wpt-server

The image: https://hub.docker.com/r/webpagetest/server/

Locations settings: 
```
/var/www/html/settings/locations.ini
```
See: locations.ini in this project

# wpt-agent

The image: https://hub.docker.com/r/webpagetest/agent/

# Docker

You can run a local WPT server and agent using docker compose.

Commands
```
make start
make stop
```

## To run tests


### (1) Manually:

1. Go to http://localhost:4000
2. Enter the URL you want to test
3. Choose `"Native Connection (No Traffic Shaping)"` on the `Connection` dropdown
4. On the `Advanced` tab, tick `Ignore SSL Certificate Errors` and `Clear SSL Certificate Caches`
5. Click on `START TEST`


### (2) Via PerfBudget

What you need:

```
- Grunt installed
- wpt dockerized instance running
```

#### Install grunt 

```
npm install -g grunt-cli
```

#### Install perfbudget

https://github.com/tkadlec/grunt-perfbudget
(This is based on the following library: https://github.com/marcelduran/webpagetest-api)

```
npm install grunt-perfbudget --save-dev
```

```
grunt perf --url=https://www.google.com.au --wpt=http://localhost:4000
```

Running with timeout, runs and repeatView options

```
grunt perf --url=https://www.google.com.au --wpt=http://localhost:4000 --timeout=2400 --runs=2 --repeatView=false
```

Options:

```
- url = host url to test (default: none, required)
- wpt = WPT instance (default: http://localhost:4000)
- timeout = timeout in seconds (default: "1200")
- runs = test runs (default: 2)
- repeatView = repeat views (default: false)
- connectivity = type of connection - Native, DSL, 3GFast etc. (Default: according to env_setup.json configuration). Use `Native` when running locally.
- firstViewOnly = only request first view (default: true)
- clearCerts = clear certificates (default: true, required when running locally)
- ignoreSSL = ignore SSL certificate errors (default: true, required when running locally)
```

Example run:

```
$ grunt perf --url=https://www.google.com.au --wpt=http://localhost:4000 --timeout=2400 --runs=2 --repeatView=false --connectivity='Native'

Running "perfbudget:default" (perfbudget) task
>> -----------------------------------------------
>> Test for https://www.google.com.au     FAILED
>> -----------------------------------------------
>> SpeedIndex: 739 [PASS]. Budget is 5000
>> render: 700 [PASS]. Budget is 2000
>> visualComplete: 2200 [FAIL]. Budget is 1000
>> TTFB: 593 [PASS]. Budget is 5000
>> domElements: 353 [PASS]. Budget is 5000
>> basePageSSLTime: 239 [PASS]. Budget is 2000
>> bytesInDoc: 381764 [FAIL]. Budget is 7000
>> Summary: http://localhost:4000/results.php?test=180204_QF_1
Warning: Task "perfbudget:default" failed. Use --force to continue.

Aborted due to warnings.
```


### (3) Via the API

API: https://sites.google.com/a/webpagetest.org/docs/advanced-features/webpagetest-restful-apis#TOC-Check-test-status

(1) Invoke a test:

```
curl -H "Accept: application/json" -H "Content-Type: application/json" -XPOST -L "http://localhost:4000/runtest.php?url=https://www.google.com.au&runs=1&video=1&ignoreSSL=1&location=Test:Chrome.Native&browser=Chrome&timeline=1&f=json"
```

Response:

```
{
   "statusCode": 200,
   "statusText": "Ok",
   "data": {
      "testId": "xxx",
      "ownerKey": "yyy",
      "jsonUrl": "http://localhost:4000/jsonResult.php?test=xxx",
      "xmlUrl": "http://localhost:4000/xmlResult/xxx/",
      "userUrl": "http://localhost:4000/result/xxx/",
      "summaryCSV": "http://localhost:4000/result/xxx/page_data.csv",
      "detailCSV": "http://localhost:4000/result/xxx/requests.csv"
   }
}
```

(2) Check the test status of the test:

```
curl -L "http://localhost:4000/testStatus.php?f=json&test=xxx"
```

Note:
- You should get. a HTTP response code of 200 on success and JSON response
- If the test has completed you'll see this in the response `"statusText":"Test Complete"`

(3) Get the test results:

```
curl "http://localhost:4000/jsonResult.php?test=xxx"
```

(4) Download the har of the test

```
curl "http://localhost:4000/xmlResult/xxx/?r=12345"
```


### Gotchas

#### Traffic shaping:

```
This does not work on Mac
```

Workaround: https://medium.com/@francis.john/local-webpagetest-using-docker-90441d7c2513

Then remove from `docker-compose.yaml`

`EXTRA_ARGS=--log /wptagent/error.log --shaper none`
    

#### Blocking domains

Scripting not yet supported, so domains need to be blocked in a comma separated string e.g.

```

perfbudget: {
  default: {
    options: {
      block: 'abc.com xyz.com'  
    }
  }
}

```
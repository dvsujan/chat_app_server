import requests
import csv
import time 

csv_file = open('top10milliondomains.csv', 'r')
# write_file = open('result.csv', 'w')
csv_reader = csv.reader(csv_file)
# csv_writer = csv.writer(write_file)
# csv_writer.writerow(['id','long_url','short_url','time(ms)']) ; 
# ignore the first line
next(csv_reader)
for line in csv_reader:
    url = "http://localhost:8000/url/shorten"
    headers = {"Content-Type": "application/json",
        "x_api_key":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImR2c3VqYW4iLCJjbGllbnRfbmFtZSI6InN1amFuIiwiZW1haWwiOiJkdnN1amFuQGdtYWlsLmNvbSIsIl9pZCI6IjY0OTdiMWVlYTA3YTY5ZDgzZDY5MTU5NiIsImlhdCI6MTY4ODYyNDI3MywiZXhwIjo0ODQ0Mzg0MjczfQ.XSF7OwkA2tcBYhVgjEEic2UPWCEmXqDk2askVPhStN4"
    }
    # print(line[1]); 
    data = {"url": line[1]}
    
    print("shortening url: ", line[1]); 
    tim = time.time()

    r = requests.post(url, headers=headers, json=data)

    res = r.json()

    url = res['short_url']
    tim = time.time() - tim 
    print("shortened url: ", url, " time: ", tim*1000)

    # csv_writer.writerow([i,line[1], url,tim*1000])
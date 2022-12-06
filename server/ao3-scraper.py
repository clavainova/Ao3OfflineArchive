#https://www.edureka.co/blog/web-scraping-with-python/
#https://www.twilio.com/blog/asynchronous-http-requests-in-python-with-aiohttp

import asyncio
import aiohttp
from selenium import webdriver
import pandas as pd
from flask import Flask, request

ficMetadata = [] #where we store metadata
url = '' #this should be passed in



app = Flask(__name__)
@app.route('/', methods=['POST'])
def result():
    print(request.form['foo']) # should display 'bar'
    return 'Received !' # response to your request.


driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver")
driver.get("<a href='" + url + "'>")

content = driver.page_source


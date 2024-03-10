from flask import Flask, jsonify, request, send_file
import requests
import json
from datetime import datetime, timedelta
from datetime import datetime
from dateutil.relativedelta import relativedelta


app = Flask(__name__, static_url_path='/static')


@app.route('/')
def index():
    return send_file('templates/main.html')

@app.route('/companyData', methods=['GET'])
def get_company_data():
    parameter_value = request.args.get('stockSymbol')
    # symbol = 'TSLA'
    token = 'cn8q7ppr01qocbpgvcogcn8q7ppr01qocbpgvcp0'
    url = f'https://finnhub.io/api/v1/stock/profile2?symbol={parameter_value}&token={token}'
    
    try:
        responseData = requests.get(url)
        if responseData.status_code == 200:
            data = responseData.json()
            return jsonify(data)
        else:
            return jsonify({'error': 'Failed to fetch data from Finnhub API'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/stockSummary', methods=['GET'])
def get_stock_summary():
    symbol = request.args.get('stockSymbol')
    # symbol = 'TSLA'
    token = 'cn8q7ppr01qocbpgvcogcn8q7ppr01qocbpgvcp0'
    url = f'https://finnhub.io/api/v1/quote?symbol={symbol}&token={token}'
    
    try:
        responseData = requests.get(url)
        if responseData.status_code == 200:
            data = responseData.json()
            return jsonify(data)
        else:
            return jsonify({'error': 'Failed to fetch data from Finnhub API'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/recommendationTrend', methods=['GET'])
def get_recommendation_trend():
    symbol = request.args.get('stockSymbol')
    # symbol = 'TSLA'
    token = 'cn8q7ppr01qocbpgvcogcn8q7ppr01qocbpgvcp0'
    url = f'https://finnhub.io/api/v1/stock/recommendation?symbol={symbol}&token={token}'
    
    try:
        responseData = requests.get(url)
        if responseData.status_code == 200:
            data = responseData.json()
            return jsonify(data)
        else:
            return jsonify({'error': 'Failed to fetch data from Finnhub API'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/stockChart', methods=['GET'])
def get_stock_chart():
    symbol = request.args.get('stockSymbol')
    token = 'DMQhJvwVy_9_79CEl3czhYeFIB8NUpOU'
    multiplier = 1
    timespan = 'day'
    symbol1=symbol.upper()

    from_date = (datetime.now() - relativedelta(months=6, days=1)).strftime('%Y-%m-%d')
    to_date = datetime.now().strftime('%Y-%m-%d')
    
    url = f'https://api.polygon.io/v2/aggs/ticker/{symbol1}/range/{multiplier}/{timespan}/{from_date}/{to_date}?adjusted=true&sort=asc&apiKey={token}'
    # url = f'https://api.polygon.io/v2/aggs/ticker/AAPL/range/{multiplier}/{timespan}/{from_date}/{to_date}?adjusted=true&sort=asc&apiKey={token}'
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return jsonify(data)
        else:
            return jsonify({'error': 'Failed to fetch data from Polygon.io API'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/latestNews', methods=['GET'])
def get_latest_news():
    symbol = request.args.get('stockSymbol')
    token = 'cn8q7ppr01qocbpgvcogcn8q7ppr01qocbpgvcp0' 

    # Calculate the 'from' date (30 days before the current date)
    from_date = (datetime.now() - relativedelta(days=30)).strftime('%Y-%m-%d')

    # Current date (Today's date)
    to_date = datetime.now().strftime('%Y-%m-%d')

    # Construct the URL for the Finnhub API
    url = f'https://finnhub.io/api/v1/company-news?symbol={symbol}&from={from_date}&to={to_date}&token={token}'

    try:
        # Fetch data from the Finnhub API
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            
            # Filter articles based on required keys and non-empty values
            filtered_articles = []
            for article in data:
                if all(key in article and article[key] for key in ['image', 'url', 'headline', 'datetime']):
                    filtered_articles.append(article)
            
            # Display the first five valid articles
            return jsonify(filtered_articles[:5])
        else:
            return jsonify({'error': 'Failed to fetch data from Finnhub API'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


    

if __name__ == '__main__':
    app.run(debug=True)

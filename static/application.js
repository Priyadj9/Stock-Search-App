function fetchData() {
    clearpage(); // Clear previous content

    const userInput = document.getElementById('parameterInput').value.toUpperCase(); // Get user input and convert to uppercase
//"How to get async calls from all api's at once" prompt (10 lines), ChatGPT, 12nd Febuary version, OpenAI, 22nd Febuary 2024, chat.openai.com/chat
    // Define the URLs for the four APIs
    const urls = [
        `/companyData?stockSymbol=${userInput}`,
        `/stockSummary?stockSymbol=${userInput}`,
        `/recommendationTrend?stockSymbol=${userInput}`,
        `/latestNews?stockSymbol=${userInput}`
    ];
    
    // Fetch data from all APIs simultaneously
    Promise.all(urls.map(url => fetch(url)))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(dataArray => {
            const [companyData, stockSummary, recommendationTrend, latestNews] = dataArray;

            // Render company data
            clearpage();
            const companyLogo = companyData.logo;
            const companyName = companyData.name;
            const stockTickerSymbol = companyData.ticker;
            const stockExchangeCode = companyData.exchange;
            const companyStartDate = companyData.ipo;
            const category = companyData.finnhubIndustry;

            const table = document.createElement('table');
            table.classList.add('company-table');
            table.style.borderCollapse = 'collapse'; // Ensure border collapse
            table.style.borderTop = '1px solid #f2f2f2'; // Add top border

            const fields = ['Company Name', 'Stock Ticker Symbol', 'Stock Exchange Code', 'Company IPO Date', 'Category'];
            const values = [companyName, stockTickerSymbol, stockExchangeCode, companyStartDate, category];
            for (let i = 0; i < fields.length; i++) {
                const row = table.insertRow(); // Insert row
                row.classList.add('company-table-row'); // Add class to each row
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = fields[i];
                cell2.textContent = values[i];
                cell1.style.textAlign = 'right';
                cell1.style.fontWeight = 'bold';
                cell1.style.padding = '5';
                cell1.style.width = '300';
                cell2.style.width = '300';
            }

            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.borderBottom = '1px solid #f2f2f2';
            });

            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image-container');
            const img = document.createElement('img');
            img.src = companyLogo;
            img.alt = 'Company Logo';
            img.width = 100;
            imageDiv.appendChild(img);

            const companyDataContainer = document.getElementById('companydata');
            companyDataContainer.innerHTML = '';
            companyDataContainer.appendChild(imageDiv);
            companyDataContainer.appendChild(table);

            imageDiv.style.textAlign = 'center';
            imageDiv.style.maxWidth = '600px'
            imageDiv.style.margin = '10px';

            // Render stock summary
            const ticker = userInput;

            const summaryTable = document.createElement('table');
            summaryTable.classList.add('stock-summary-table');
            summaryTable.style.borderCollapse = 'collapse';
            summaryTable.style.borderTop = '1px solid #f2f2f2';
            summaryTable.style.width = '400px';

            const summaryFields = ['Stock Ticker Symbol', 'Trading Day', 'Previous Closing Price', 'Opening Price', 'High Price', 'Low Price', 'Change', 'Change Percent'];
            
            //"How to change data to required format" prompt (5 lines), ChatGPT, 12nd Febuary version, OpenAI, 22nd Febuary 2024, chat.openai.com/chat
            function formatDate(timestamp) {
                const date = new Date(timestamp * 1000);
                const day = date.getDate();
                const month = date.toLocaleString('default', { month: 'long' });
                const year = date.getFullYear();
                return `${day} ${month}, ${year}`;
            }
            

            const summaryValues = [
                ticker,
                formatDate(stockSummary.t),
                stockSummary.pc,
                stockSummary.o,
                stockSummary.h,
                stockSummary.l,
                `${stockSummary.d}`,
                `${stockSummary.dp}`
            ];
            for (let i = 0; i < summaryFields.length; i++) {
                const row = summaryTable.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = summaryFields[i];
                cell2.textContent = summaryValues[i];
                cell1.style.textAlign = 'right';
                cell1.style.fontWeight = 'bold';
                cell1.style.padding = '5px';
                cell1.style.width = '200px';
                cell2.style.padding = '5px';
                cell2.style.width = '200px';

                if (summaryFields[i] === 'Change' || summaryFields[i] === 'Change Percent') {
                    const arrowImg = document.createElement('img');
                    arrowImg.src = stockSummary.d >= 0 ? 'static/img/GreenArrowUp.png' : 'static/img/RedArrowDown.png';
                    arrowImg.alt = stockSummary.d >= 0 ? 'Up Arrow' : 'Down Arrow';
                    arrowImg.style.width = '16px';
                    arrowImg.style.height = '16px';
                    cell2.appendChild(arrowImg);
                }
            }

            const summaryRows = summaryTable.querySelectorAll('tr');
            summaryRows.forEach(row => {
                row.style.borderBottom = '1px solid #f2f2f2';
            });

            const stockSummaryContainer = document.getElementById('stocksummary');
            stockSummaryContainer.innerHTML = '';
            stockSummaryContainer.appendChild(summaryTable);

            // Render recommendation trend
            const outputDiv = document.createElement('div');
            outputDiv.classList.add('recommendation-trend');

            outputDiv.innerHTML = `
                <div class= "recommendation-trend_left_label">
                    <p class="recommendation-trend__label">Strong<br>Sell</p>
                </div>
                <div class="recommendation-trend__item strong-sell">
                    <p class="recommendation-trend__value">${recommendationTrend[0].strongSell}</p>
                </div>
                <div class="recommendation-trend__item sell">
                    <p class="recommendation-trend__value">${recommendationTrend[0].sell}</p>
                </div>
                <div class="recommendation-trend__item hold">
                    <p class="recommendation-trend__value">${recommendationTrend[0].hold}</p>
                </div>
                <div class="recommendation-trend__item buy">
                    <p class="recommendation-trend__value">${recommendationTrend[0].buy}</p>
                </div>
                <div class="recommendation-trend__item strong-buy">
                    <p class="recommendation-trend__value">${recommendationTrend[0].strongBuy}</p>
                </div>
                <div class= "recommendation-trend_right_label">
                    <p class="recommendation-trend__label">Strong<br>Buy</p>
                </div>
            `;

            const textDiv = document.createElement('div');
            textDiv.classList.add('recommendation-trend__text');
            textDiv.innerHTML = `
                <p class="recommendation-trend__text-value">Recommendation Trends</p>
            `;

            const containerDiv = document.createElement('div');
            containerDiv.classList.add('recommendation-trend__container');
            containerDiv.appendChild(outputDiv);
            containerDiv.appendChild(textDiv);

            document.getElementById('recommendationtrend').appendChild(containerDiv);

            // Render latest news
            const newsContainer = document.createElement('div');
            newsContainer.classList.add('latest-news-container');

            latestNews.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('latest-news-item');

                const img = document.createElement('img');
                img.src = article.image;
                img.alt = article.headline;
                img.width = 80;
                img.height = 80;
                img.style.paddingLeft = '10px';
                articleDiv.appendChild(img);

                const contentDiv = document.createElement('div');
                contentDiv.classList.add('latest-news-content');

                const headline = document.createElement('h3');
                headline.textContent = article.headline;
                headline.style.paddingBottom = '0';
                contentDiv.appendChild(headline);

                function formatDate1(timestamp) {
                    const date = new Date(timestamp * 1000);
                    const day = date.getDate();
                    const month = date.toLocaleString('default', { month: 'long' });
                    const year = date.getFullYear();
                    return `${day} ${month}, ${year}`;
                }
                
                const date = document.createElement('p');
                date.textContent = formatDate1(article.datetime);
                date.style.paddingTop = '0';
                contentDiv.appendChild(date);
                
                


                const link = document.createElement('a');
                link.href = article.url;
                link.textContent = 'See Original Post';
                link.target = '_blank';
                contentDiv.appendChild(link);

                articleDiv.appendChild(contentDiv);
                newsContainer.appendChild(articleDiv);
            });

            document.getElementById('latestNews').appendChild(newsContainer);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        getstockchartsdata();
        document.getElementById('companydata').style.display = 'none';
        document.getElementById('stocksummary').style.display = 'none';
        document.getElementById('recommendationtrend').style.display = 'none';
        document.getElementById('latestNews').style.display = 'none';
}

function getstockchartsdata() {
    clearpage();
    var userInput = document.getElementById('parameterInput').value;
    fetch(`/stockChart?stockSymbol=${userInput}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            //"How to get the data in desired format" prompt (10 lines), ChatGPT, 12nd Febuary version, OpenAI, 22nd Febuary 2024, chat.openai.com/chat
            // Process the fetched data
            const primarySeries = [];
            const secondarySeries = [];

            data.results.forEach(result => {
                const timestamp = result.t;
                const value = result.c;
                const volumeWeighted = result.v;

                // Push data to primary y-axis series
                primarySeries.push([timestamp, value]);

                // Push data to secondary y-axis series
                secondarySeries.push([timestamp, volumeWeighted]);
            });

            // Find the min and max values of the primary y-axis
            const minValue = Math.min(...primarySeries.map(pair => pair[1]));
            const maxValue = Math.max(...primarySeries.map(pair => pair[1]));
            //const padding = (maxValue - minValue) * 0.1; // Add some padding for better visualization
            const maxValue1 = Math.max(...secondarySeries.map(pair => pair[1]));
            const minValue1 = Math.min(...secondarySeries.map(pair => pair[1]));
            

            // Find the timestamp of the last data point
            const lastTimestamp = primarySeries[primarySeries.length - 1][0];

            // // Find today's date
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

            const titleText = `Stock Price ${userInput.toUpperCase()} ${formattedDate}`;

            // Create the chart
            Highcharts.stockChart('stockchart', {
                title: {
                    text: titleText // Add title to the graph
                },
                subtitle: {
                    text: '<a href="https://polygon.io" target="_blank" style="color: blue; text-decoration: underline;">Source: Polygon.io</a>'
                },
                
                rangeSelector: {
                    buttons: [{
                        type: 'day',
                        count: 7,
                        text: '7d'
                    }, {
                        type: 'day',
                        count: 15,
                        text: '15d'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }],
                    selected: 4, 
                    inputEnabled: false,
                },
                yAxis: [{

                    title: {
                        text: 'Stock Price'
                    },

                    opposite: false, // Position the axis on the left side

                }, {
                    
                    title: {
                        text: 'Volume'
                    },
                    opposite: true,
                    plotOptions: {
                        column: {
                            pointWidth: 5,
                        }
                    },

        max:2*maxValue1,
        
                }],
                series: [{
                    type: 'area',
                    name: 'Stock Price',
                    data: primarySeries,
                    yAxis: 0, // Primary Y Axis
                    // showInNavigator: false,
                    threshold: null,
                    //gapSize: 5,

                //"How to give gradiant of blue in highcharts area chart" prompt (13 lines), ChatGPT, 12nd Febuary version, OpenAI, 22nd Febuary 2024, chat.openai.com/chat
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
                },
                {
                    type: 'column',
                    name: 'Volume',
                    data: secondarySeries,
                    yAxis: 1, // Secondary Y Axis
                    color: 'black', 
 
                }],
                
                
            });
            //document.getElementById('stockchart').appendChild(stockchart);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
        document.getElementById('stockchart').style.display = 'none';
}


function clearInput() {
    document.getElementById('parameterInput').value = '';
    document.getElementById('response').innerHTML = '';
    document.getElementById('button-container').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    //document.getElementById('error-message').innerHTML = '';
    document.getElementById('company-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('summary-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('charts-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('latestnews-button').style.backgroundColor = '#f8f9fa'
    clearpage();
}

function clearpage(){
    document.getElementById('companydata').innerHTML = '';
    document.getElementById('stocksummary').innerHTML = '';
    document.getElementById('recommendationtrend').innerHTML = '';
    document.getElementById('stockchart').innerHTML = '';
    document.getElementById('latestNews').innerHTML = '';
    //document.getElementById('error-message').innerHTML = '';
  
}

function wronginput(){
    document.getElementById('response').innerHTML = '';
    document.getElementById('button-container').style.display = 'none';
    
    clearpage();
}
function search() {
    var userInput = document.getElementById('parameterInput').value;
    if (userInput.trim() === '') {
      alert('Please fill out this field');
      return;
    }
  
    // Clear previous error message
    document.getElementById('error-message').style.display = 'none';
  
    fetch(`/companyData?stockSymbol=${userInput}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          // Display error message
          document.getElementById('error-message').innerText = 'Error: No record has been found, please enter a valid symbol';
          document.getElementById('error-message').style.display = 'block';
          // Clear input and other buttons
          wronginput();
          // Hide buttons
          document.getElementById('button-container').style.display = 'none';
        } else {
          // Clear error message
          document.getElementById('error-message').style.display = 'none';
          // Display the buttons
          
          fetchData();
          document.getElementById('button-container').style.display = 'flex';
          document.getElementById('companydata').style.display = 'block';
          document.getElementById('company-button').style.backgroundColor = '#e8e8e8'
          document.getElementById('summary-button').style.backgroundColor = '#f8f9fa'
          document.getElementById('charts-button').style.backgroundColor = '#f8f9fa'
          document.getElementById('latestnews-button').style.backgroundColor = '#f8f9fa'
        }
      })

      .catch(error => {
        console.error('Error:', error);
      });
  }

function stockcompanydata() {
    document.getElementById('company-button').style.backgroundColor = '#e8e8e8'
    document.getElementById('summary-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('charts-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('latestnews-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('companydata').style.display = 'block';
    document.getElementById('stocksummary').style.display = 'none';
    document.getElementById('recommendationtrend').style.display = 'none';
    document.getElementById('latestNews').style.display = 'none';
    document.getElementById('stockchart').style.display = 'none';

}

function getstocksummary() {
    document.getElementById('company-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('summary-button').style.backgroundColor = '#e8e8e8'
    document.getElementById('charts-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('latestnews-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('companydata').style.display = 'none';
    document.getElementById('stocksummary').style.display = 'block';
    document.getElementById('recommendationtrend').style.display = 'block';
    document.getElementById('latestNews').style.display = 'none';
    document.getElementById('stockchart').style.display = 'none';

}

function stocklatestnews() {
    document.getElementById('company-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('summary-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('charts-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('latestnews-button').style.backgroundColor = '#e8e8e8'
    document.getElementById('companydata').style.display = 'none';
    document.getElementById('stocksummary').style.display = 'none';
    document.getElementById('recommendationtrend').style.display = 'none';
    document.getElementById('latestNews').style.display = 'block';
    document.getElementById('stockchart').style.display = 'none';

}

async function stockchartsdata() {
    document.getElementById('company-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('summary-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('charts-button').style.backgroundColor = '#e8e8e8'
    document.getElementById('latestnews-button').style.backgroundColor = '#f8f9fa'
    document.getElementById('companydata').style.display = 'none';
    document.getElementById('stocksummary').style.display = 'none';
    document.getElementById('recommendationtrend').style.display = 'none';
    document.getElementById('latestNews').style.display = 'none';
    document.getElementById('stockchart').style.display = 'block';

}
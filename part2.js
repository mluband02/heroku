const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://userguy:MaxLuband@cluster0.o5isz7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
var http = require('http');
var url = require('url');
var port = process.env.PORT || 3000;
//var port = 8080; 
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  urlObj = url.parse(req.url,true)
  if (urlObj.pathname == "/") 
  {
     s = "<form method = 'get' action = '/search'>" +
     "<label for= 'query'>Input stock ticker or comapny name: <br></label>" +
     "<input type = 'text' id = 'query' name = 'target'><br><br>" +
     "<input type = 'radio' name = 'choice' id = 'ticker' value = 'ticker'>" +
     "<label for= 'ticker'>Ticker</label><br><br>" +
     "<input type = 'radio' name = 'choice' id = 'name' value = 'name'>" +
     "<label for= 'name'>Name</label><br><br>" +
    "<input type='submit' value='Submit'> </form>"
     res.write(s)
     res.end()
  }
  else if (urlObj.pathname == "/search") {
    MongoClient.connect(uri, async function(err, db) 
    {
        if(err) { return console.log(err); return;}
    
        var dbo = db.db("Stock"); 
        var collection = dbo.collection('PublicCompanies');
        target = urlObj.query.target

        if(urlObj.query.choice == 'name')
        {
          theTarget = {"Company" : target}
          collection.find(theTarget).toArray(async function(err, items)
          {
            if(err) 
            {
              console.log("Error:" + err)
            }
            else
            {
              if(items.length == 0)
              {
                console.log("invalid query")
                res.write("invalid query")
              }
              else
              {
                items.forEach((element) =>
                {

                  console.log("Company name: " + element.Company + " Ticker: " +element.Ticker + " Price: "  + element.Price)
                  res.write("Company name: " + element.Company + " Ticker: " +element.Ticker + " Price: "  + element.Price)
                })
              }
            }
            db.close()
          })
        } 
        else if(urlObj.query.choice == 'ticker')
        {
          theTarget = {"Ticker" : target}
          collection.find(theTarget).toArray(async function(err, items)
          {
            if(err) 
            {
              console.log("Error:" + err)
            }
            else
            {
              if(items.length == 0)
              {
                console.log("invalid query")
                res.write("invalid query")
                
               }
              else
              {
                items.forEach((element) =>
                {
  
                  console.log("Company name: " + element.Company + " Ticker: " +element.Ticker + " Price: "  + element.Price)
                  res.write("Company name: " + element.Company + " Ticker: " +element.Ticker + " Price: "  + element.Price)
                })
              }
            }
            db.close()
          })
        }
        else 
        {
          console.log("invalid query")
          res.write("invalid query")
        }
      
    })
  res.end();
  }
}).listen(port);

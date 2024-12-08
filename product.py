from flask import Flask,request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/GamerShop'
mongo = PyMongo(app)

@app.route('/Products', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def Products():

    collection = mongo.db.Products
    data = collection.find()
    products = [product for product in data] 
    for product in products:
        if '_id' in product:
            product['_id'] = str(product['_id'])
    if not products:
        return "Data Not Found"
    return products

@app.route('/UpdatePrice', methods=['POST'] )
@cross_origin(supports_credentials=True)
def UpdatePrice():

    collection = mongo.db.Products
    data = collection.find({'_id': ObjectId(request.get_json()["id"])})
    products = [product for product in data] 
    for product in products:
        if '_id' in product:
            product['_id'] = str(product['_id'])
    if not products:
        return "Data Not Found"
    myquery = { "_id": ObjectId(request.get_json()["id"])}
    newvalues = { "$set": {
        'price': request.get_json()["price"],          
    } }
    collection.update_one(myquery,newvalues)
    return products[0]

@app.route('/UpdateStock', methods=['POST'] )
@cross_origin(supports_credentials=True)
def UpdateStock():

    collection = mongo.db.Products
    data = collection.find({'_id': ObjectId(request.get_json()["id"])})
    products = [product for product in data] 
    for product in products:
        if '_id' in product:
            product['_id'] = str(product['_id'])
    if not products:
        return "Data Not Found"
    myquery = { "_id": ObjectId(request.get_json()["id"])}
    newvalues = { "$set": {
        'stock': request.get_json()["stock"],          
    } }
    collection.update_one(myquery,newvalues)
    return products[0]    


@app.route('/SearchProduct',methods=['POST'])
@cross_origin(supports_credentials=True)
def SearchProduct():

    collection = mongo.db.Products
    data = collection.find({'name': {'$regex' : request.get_json()["name"] }})
    products = [product for product in data] 
    for product in products:
        if '_id' in product:
            product['_id'] = str(product['_id'])
    if not products:
        return []

    return products

@app.route('/AddProduct', methods=['POST'] )
@cross_origin(supports_credentials=True)
def AddProduct():

    collection = mongo.db.Products
    data = {
        'name': request.get_json()["name"],
        'link': request.get_json()["link"],
        'price': request.get_json()["price"],
        'stock': request.get_json()["stock"]        
        }
    collection.insert_one(data)
    data = collection.find()
    products = [product for product in data] 
    for product in products:
        if '_id' in product:
             product['_id'] = str(product['_id'])
    if not products:
         return "Data Not Found" 
    return products 

@app.route('/DeleteProduct', methods=['POST'] )
@cross_origin(supports_credentials=True)
def DeleteProduct():

    collection = mongo.db.Products
    data = {
        '_id': request.get_json()["id"],
      
    }
    collection.delete_one({ "_id": ObjectId(request.get_json()["id"])} )
    data = collection.find()
    products = [product for product in data] 
    for product in products:
        if '_id' in product:
             product['_id'] = str(product['_id'])
    if not products:
         return "Data Not Found" 
    return products 


if __name__ == "__main__":
    app.run(debug=True)
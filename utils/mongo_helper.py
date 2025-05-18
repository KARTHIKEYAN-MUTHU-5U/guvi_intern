from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client['guvi_profiles']
collection = db['profiles']

def get_profile(email):
    return collection.find_one({"email": email}, {"_id": 0, "email": 0})

def update_profile(email, data):
    collection.update_one({"email": email}, {"$set": data}, upsert=True)